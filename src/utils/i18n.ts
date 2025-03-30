import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// React 18 doesn't use initReactI18next anymore in v15
// The i18n instance will be used directly in components via useTranslation

import enTranslation from '../translations/en.json';
import thTranslation from '../translations/th.json';

// the translations
const resources = {
  en: {
    translation: enTranslation
  },
  th: {
    translation: thTranslation
  }
};

// Initialize i18next instance
i18n
  .use(initReactI18next) // pass i18n down to react-i18next
  .init({
    resources,
    lng: 'th', // default language เป็นภาษาไทย
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n; 