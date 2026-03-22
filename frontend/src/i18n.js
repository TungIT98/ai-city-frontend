/**
 * i18n Configuration
 * Part of Phase 7: Internationalization (AIC-703)
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

// Get saved language or default to browser language
const getSavedLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('language') || navigator.language.split('-')[0] || 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Save language preference on change
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lng);
    document.documentElement.lang = lng;
  }
});

export default i18n;
