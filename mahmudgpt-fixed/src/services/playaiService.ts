
// Enhanced Bengali TTS service using ElevenLabs

import { Language } from "@/store/languageStore";

// Use environment variables or secure storage in production
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || "sk_759334495cf1b6d6a8162f6170a42b018f911fcdbff35bed";
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";

// Bengali optimized voice ID from ElevenLabs - using a prettier female voice for Bengali
const BENGALI_VOICE_ID = "kyUoyeYKYWwUMdNExUEn"; // Enhanced multilingual female voice with Bengali support

export async function convertBengaliTextToSpeech(text: string): Promise<Blob> {
  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/${BENGALI_VOICE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2", // Using multilingual v2 for better quality
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.15, // Adding a bit of style for more emotion
          use_speaker_boost: true, // Speaker boost for clearer voice
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs Bengali API error: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Error calling ElevenLabs Bengali API:", error);
    throw error;
  }
}

// Get natural sounding voice sample for demonstration
export async function getVoiceSample(language: string): Promise<Blob> {
  // Sample text for various languages
  const sampleTexts: Record<string, string> = {
    bn: "আমি আপনাকে সাহায্য করতে এখানে আছি। আমি কিভাবে আপনাকে সাহায্য করতে পারি?",
    en: "I'm here to help you. How can I assist you today?",
    hi: "मैं आपकी मदद करने के लिए यहां हूं। मैं आपकी कैसे सहायता कर सकता हूं?",
    default: "Hello, I'm here to assist you."
  };
  
  const text = sampleTexts[language] || sampleTexts.default;
  
  // Use Bengali voice for Bengali and Hindi, English voice for others
  const voiceId = (language === 'bn' || language === 'hi') 
    ? BENGALI_VOICE_ID 
    : "EXAVITQu4vr4xnSDxMaL"; // Sarah - pretty female voice for English
  
  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.15,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Error getting voice sample:", error);
    throw error;
  }
}
