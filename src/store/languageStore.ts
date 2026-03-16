import { create } from 'zustand';

export type LanguageCode = 'en' | 'bn';

export interface Language {
  code: LanguageCode;
  name: string;
}

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: { code: 'en', name: 'English' },
  setLanguage: (language) => set({ language }),
}));
