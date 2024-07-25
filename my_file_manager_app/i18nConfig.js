// const i18next = require('i18next');
// const i18nextFsBackend = require('i18next-fs-backend');
// const i18nextHttpMiddleware = require('i18next-http-middleware');

// i18next
//   .use(i18nextFsBackend)
//   .use(i18nextHttpMiddleware.LanguageDetector)
//   .init({
//     fallbackLng: 'en',
//     backend: {
//       loadPath: './locales/{{lng}}/translation.json',
//     },
//     debug: process.env.NODE_ENV === 'development',
//     detection: {
//       order: ['querystring', 'cookie', 'header'],
//       caches: ['cookie'],
//     },
//     saveMissing: true,
//     saveMissingTo: 'fallback',
//   });

//   module.exports = i18next;