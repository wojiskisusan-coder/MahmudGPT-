
import { create } from 'zustand';

export type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
];

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

// Load the saved language preference from localStorage, or default to English
const getSavedLanguage = (): Language => {
  try {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      const langObj = JSON.parse(savedLanguage);
      const foundLang = languages.find(l => l.code === langObj.code);
      if (foundLang) return foundLang;
    }
  } catch (e) {
    console.error('Error loading saved language:', e);
  }
  return languages[0]; // Default to English
};

export const useLanguageStore = create<LanguageState>((set) => ({
  currentLanguage: getSavedLanguage(),
  setLanguage: (language) => {
    // Save the language preference to localStorage
    localStorage.setItem('preferredLanguage', JSON.stringify(language));
    set({ currentLanguage: language });
  },
}));
