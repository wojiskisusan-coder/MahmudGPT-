import { cleanTextForSpeech } from "@/utils/textCleaner";
import { generateResponse as fallbackGeminiResponse } from "./geminiService";
import { useLanguageStore } from "@/store/languageStore";

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL) console.error("VITE_SUPABASE_URL is not configured. Backend APIs will fail.");
if (!SUPABASE_KEY) console.error("VITE_SUPABASE_PUBLISHABLE_KEY is not configured. Backend APIs will fail.");

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
  // If Supabase is not configured, use direct Gemini API immediately
  if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes("placeholder")) {
    try {
      const lastMessage = messages[messages.length - 1]?.content || "";
      const { currentLanguage } = useLanguageStore.getState();
      const response = await fallbackGeminiResponse(lastMessage, currentLanguage);
      
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
      const { currentLanguage } = useLanguageStore.getState();
      
      // Convert fileData to File objects if possible, or just pass the prompt
      // Note: generateResponse expects File objects, but we have base64. 
      // For simplicity in fallback, we'll just send the text prompt.
      const response = await fallbackGeminiResponse(lastMessage, currentLanguage);
      
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
  const resp = await fetch(`${SUPABASE_URL}/functions/v1/generate-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ prompt }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Image generation failed" }));
    throw new Error(err.error || "Image generation failed");
  }

  const data = await resp.json();
  return data.imageUrl;
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
