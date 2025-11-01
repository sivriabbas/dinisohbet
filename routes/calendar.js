const express = require('express');
const router = express.Router();

// İslami Takvim sayfası
router.get('/', (req, res) => {
  res.render('calendar/index');
});

module.exports = router;
