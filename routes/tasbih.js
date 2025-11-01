const express = require('express');
const router = express.Router();

// Dijital Tesbih sayfası
router.get('/', (req, res) => {
  res.render('tasbih/index');
});

module.exports = router;
