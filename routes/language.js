const express = require('express');
const router = express.Router();

// Change language
router.get('/change/:lang', (req, res) => {
  const { lang } = req.params;
  const supportedLanguages = ['tr', 'en', 'ar', 'de', 'fr'];
  
  if (supportedLanguages.includes(lang)) {
    res.cookie('language', lang, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // 1 year
  }
  
  const redirectUrl = req.query.returnUrl || req.headers.referer || '/';
  res.redirect(redirectUrl);
});

module.exports = router;
