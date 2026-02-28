import { GoogleGenAI } from "@google/genai";

const PROMO_KEYS: Record<string, string> = {
  "Gpt32%off!": "AIzaSyDXyC82QyXUiXRmAZcMg8_tDi7y0cbvX1c",
};

class ApiService {
  private currentApiKey: string;
  private aiInstance: GoogleGenAI;

  constructor() {
    const savedKey = localStorage.getItem("mahmudgpt-custom-api-key");
    this.currentApiKey = savedKey || process.env.GEMINI_API_KEY || "";
    this.aiInstance = new GoogleGenAI({ apiKey: this.currentApiKey });
  }

  get ai() {
    return this.aiInstance;
  }

  get apiKey() {
    return this.currentApiKey;
  }

  applyPromoCode(code: string): boolean {
    const key = PROMO_KEYS[code];
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
    const defaultKey = process.env.GEMINI_API_KEY || "";
    this.updateApiKey(defaultKey);
    localStorage.removeItem("mahmudgpt-custom-api-key");
  }
}

export const apiService = new ApiService();
