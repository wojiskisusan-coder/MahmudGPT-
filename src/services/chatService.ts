import { cleanTextForSpeech } from "@/utils/textCleaner";
import { generateResponse as fallbackGeminiResponse } from "./geminiService";
import { useLanguageStore } from "@/store/languageStore";
import { apiService } from "./apiService";
import { MODE_SYSTEM_PROMPTS, type AiMode } from "@/constants/chatConstants";

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const CHAT_URL = `${SUPABASE_URL}/functions/v1/chat`;

export async function streamChat({
  messages,
  mode,
  onDelta,
  onThinking,
  onDone,
  onError,
  fileData,
}: {
  messages: ChatMessage[];
  mode?: string;
  onDelta: (text: string) => void;
  onThinking?: (text: string) => void;
  onDone: () => void;
  onError?: (error: string) => void;
  fileData?: { name: string; type: string; base64: string }[];
}) {
  // Use direct Gemini API for research modes to enable Google Search grounding
  if (apiService.ai && (mode === "research" || mode === "deep-research")) {
    try {
      const systemInstruction = MODE_SYSTEM_PROMPTS[mode as AiMode] || MODE_SYSTEM_PROMPTS.assistant;
      const contents = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));
      
      if (fileData && fileData.length > 0) {
        const lastContent = contents[contents.length - 1];
        for (const file of fileData) {
          lastContent.parts.unshift({
            inlineData: {
              data: file.base64,
              mimeType: file.type,
            }
          } as unknown as { text: string });
        }
      }

      const responseStream = await apiService.ai.models.generateContentStream({
        model: mode === "deep-research" ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview",
        contents,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        }
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          onDelta(chunk.text);
        }
      }
      onDone();
      return;
    } catch (err) {
      console.error("Direct Gemini API failed for research mode:", err);
      // Fall through to Supabase or fallback
    }
  }

  // If Supabase is not configured, use direct Gemini API immediately
  if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes("placeholder")) {
    try {
      const lastMessage = messages[messages.length - 1]?.content || "";
      const { language } = useLanguageStore.getState();
      const response = await fallbackGeminiResponse(lastMessage, language);
      
      const words = response.split(" ");
      for (let i = 0; i < words.length; i++) {
        onDelta(words[i] + (i === words.length - 1 ? "" : " "));
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      onDone();
      return;
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Chat service unavailable");
      return;
    }
  }

  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ messages, mode, fileData }),
    });

    if (!resp.ok) {
      throw new Error(`Supabase function failed with status ${resp.status}`);
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done: readerDone, value } = await reader.read();
      if (readerDone) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIdx: number;
      while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIdx);
        buffer = buffer.slice(newlineIdx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const json = line.slice(6).trim();
        if (json === "[DONE]") { onDone(); return; }

        try {
          const parsed = JSON.parse(json);
          const delta = parsed.choices?.[0]?.delta;
          if (delta?.reasoning_content && onThinking) {
            onThinking(delta.reasoning_content);
          }
          const content = delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }

    // Process remaining buffer
    if (buffer.trim()) {
      for (let raw of buffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (!raw.startsWith("data: ")) continue;
        const json = raw.slice(6).trim();
        if (json === "[DONE]") continue;
        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone();
  } catch (error) {
    console.error("Primary chat stream failed, falling back to direct Gemini API:", error);
    
    try {
      // Fallback to direct Gemini API call
      const lastMessage = messages[messages.length - 1]?.content || "";
      const { language } = useLanguageStore.getState();
      
      // Convert fileData to File objects if possible, or just pass the prompt
      // Note: generateResponse expects File objects, but we have base64. 
      // For simplicity in fallback, we'll just send the text prompt.
      const response = await fallbackGeminiResponse(lastMessage, language);
      
      // Simulate streaming for the fallback
      const words = response.split(" ");
      for (let i = 0; i < words.length; i++) {
        onDelta(words[i] + (i === words.length - 1 ? "" : " "));
        // Small delay to simulate streaming feel
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      
      onDone();
    } catch (fallbackError) {
      console.error("Fallback Gemini API also failed:", fallbackError);
      const errorMsg = error instanceof Error ? error.message : "Chat service unavailable";
      onError?.(errorMsg);
    }
  }
}

export async function generateImage(prompt: string): Promise<string> {
  // Try Supabase first if configured
  if (SUPABASE_URL && !SUPABASE_URL.includes("placeholder")) {
    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (resp.ok) {
        const data = await resp.json();
        return data.imageUrl;
      }
    } catch (e) {
      console.error("Supabase image generation failed, falling back:", e);
    }
  }

  // Fallback to DeepAI API (as seen in ImageCreator.tsx)
  try {
    const API_KEY = "491714787ba156962489692c9b23000a";
    const API_URL = "https://api.deepai.org/api/text2img";
    
    const formData = new FormData();
    formData.append('text', prompt);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'api-key': API_KEY,
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data.output_url) return data.output_url;
    }
  } catch (e) {
    console.error("DeepAI fallback failed:", e);
  }

  // Final fallback to a high-quality placeholder
  return `https://picsum.photos/seed/${encodeURIComponent(prompt.slice(0, 20))}/1024/1024`;
}

export async function speakWithElevenLabs(text: string, voiceId: string): Promise<void> {
  const cleanedText = cleanTextForSpeech(text);
  if (!cleanedText.trim()) return;

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/elevenlabs-tts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ text: cleanedText.slice(0, 4000), voiceId }),
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: "TTS failed" }));
    throw new Error(errData.error || `TTS failed: ${response.status}`);
  }

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  await audio.play();
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // Remove data:...;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
