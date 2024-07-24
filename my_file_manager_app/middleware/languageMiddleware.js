function setLanguage(req, res, next) {
    const lng = req.query.lng || req.cookies.i18next || 'en';
    res.cookie('i18next', lng);
    req.i18n.changeLanguage(lng);
    next();
  }
  
  module.exports = setLanguage;