import { GoogleGenAI } from "@google/genai";

// Promo code → API key mapping (case-insensitive matching)
const PROMO_KEYS: Record<string, string> = {
  "gpt32%off!": "AIzaSyDXyC82QyXUiXRmAZcMg8_tDi7y0cbvX1c",
};

class ApiService {
  private currentApiKey: string;
  private aiInstance: GoogleGenAI | null;

  constructor() {
    const savedKey = localStorage.getItem("mahmudgpt-custom-api-key");
    this.currentApiKey = savedKey || import.meta.env.VITE_GEMINI_API_KEY || "";
    this.aiInstance = this.currentApiKey
      ? new GoogleGenAI({ apiKey: this.currentApiKey })
      : null;
  }

  get ai() {
    return this.aiInstance;
  }

  get apiKey() {
    return this.currentApiKey;
  }

  get isReady() {
    return !!this.currentApiKey;
  }

  applyPromoCode(code: string): boolean {
    const key = PROMO_KEYS[code.toLowerCase().trim()];
    if (key) {
      this.updateApiKey(key);
      return true;
    }
    return false;
  }

  updateApiKey(key: string) {
    this.currentApiKey = key;
    this.aiInstance = new GoogleGenAI({ apiKey: key });
    localStorage.setItem("mahmudgpt-custom-api-key", key);
  }

  resetApiKey() {
    this.currentApiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    this.aiInstance = this.currentApiKey
      ? new GoogleGenAI({ apiKey: this.currentApiKey })
      : null;
    localStorage.removeItem("mahmudgpt-custom-api-key");
  }
}

export const apiService = new ApiService();

