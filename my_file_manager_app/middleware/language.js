function setLanguage(req, res, next) {
    const language = req.query.language || req.cookies.i18next || 'en';
    req.language = language;
    next();
  }
  
  module.exports = { setLanguage };