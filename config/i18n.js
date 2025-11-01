const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + '/../locales/{{lng}}/{{ns}}.json',
      addPath: __dirname + '/../locales/{{lng}}/{{ns}}.missing.json'
    },
    fallbackLng: 'tr',
    preload: ['tr', 'en', 'ar'],
    ns: ['translation'],
    defaultNS: 'translation',
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: ['cookie'],
      lookupQuerystring: 'lang',
      lookupCookie: 'language',
      cookieSecure: false,
      cookieMaxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
    },
    interpolation: {
      escapeValue: false
    }
  });

module.exports = i18next;
