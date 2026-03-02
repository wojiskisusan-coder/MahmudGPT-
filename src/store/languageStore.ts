import { create } from 'zustand';

interface LanguageState {
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
}));
