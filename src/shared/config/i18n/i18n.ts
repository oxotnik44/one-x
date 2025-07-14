import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(HttpBackend) // загрузка переводов из файлов
    .use(LanguageDetector) // определение языка пользователя
    .use(initReactI18next) // интеграция с React
    .init({
        fallbackLng: 'ru',
        supportedLngs: ['ru', 'en'],

        ns: ['common'], // namespace, загружаемые сразу
        defaultNS: 'common',

        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },

        detection: {
            order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage'],
        },

        react: {
            useSuspense: true, // обязательно для ленивой загрузки
        },

        interpolation: {
            escapeValue: false, // React экранирует
        },

        debug: import.meta.env.DEV,
    });

export default i18n;
