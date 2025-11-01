const express = require('express');
const router = express.Router();

// Ramazan Özel sayfası
router.get('/', (req, res) => {
  res.render('ramadan/index');
});

module.exports = router;
