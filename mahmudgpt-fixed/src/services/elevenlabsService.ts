import { cleanTextForSpeech } from "@/utils/textCleaner";

interface VoiceOption {
  id: string;
  name: string;
  gender: "male" | "female" | "neutral";
  description?: string;
  languages?: string[];
}

export const voiceOptions: VoiceOption[] = [
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", gender: "female", description: "Professional female voice", languages: ["en"] },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte", gender: "female", description: "Pretty girl voice with warm tone", languages: ["en"] },
  { id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice", gender: "female", description: "Young female voice", languages: ["en", "bn"] },
  { id: "N2lVS1w4EtoT3dr4eOWO", name: "River", gender: "female", description: "Soft female voice", languages: ["en", "bn"] },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", gender: "female", description: "Sweet female voice", languages: ["en", "bn"] },
  { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie", gender: "male", languages: ["en"] },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", gender: "male", languages: ["en", "bn"] },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George", gender: "male", languages: ["en", "bn"] },
];

export const defaultVoiceId = "XB0fDUnXU5powFXDhCwa"; // Charlotte

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const getLangCode = (language: unknown): string => {
  if (typeof language === "string") return language;
  if (language && typeof language === "object" && "code" in language) return (language as { code: string }).code;
  return "en";
};

export const getVoiceForLanguage = (language: unknown): VoiceOption => {
  const code = getLangCode(language);
  const isBengali = code === "bn" || code === "bengali" || code === "bn-BD";
  if (isBengali) {
    return voiceOptions.find(v => v.id === "pFZP5JQG7iQjIQuC4Bku") || voiceOptions[0];
  }
  return voiceOptions.find(v => v.id === defaultVoiceId) || voiceOptions[0];
};

export const getVoiceNameForLanguage = (language: unknown): string => {
  return getVoiceForLanguage(language).name;
};

export const convertTextToSpeech = async (text: string, language: unknown): Promise<Blob> => {
  // Clean markdown before speaking
  const cleanedText = cleanTextForSpeech(text);

  if (!cleanedText.trim()) {
    throw new Error("No speakable text after cleaning");
  }

  const voice = getVoiceForLanguage(language);

  // Call the edge function (keeps API key server-side)
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/elevenlabs-tts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        text: cleanedText.slice(0, 4000),
        voiceId: voice.id,
      }),
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: "TTS failed" }));
    throw new Error(errData.error || `TTS failed with status ${response.status}`);
  }

  return response.blob();
};
