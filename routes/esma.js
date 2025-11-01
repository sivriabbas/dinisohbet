const express = require('express');
const router = express.Router();
const Esma = require('../models/Esma');

// Esma-ül Hüsna listesi
router.get('/', async (req, res) => {
  try {
    const esmas = await Esma.find().sort({ number: 1 });
    res.render('esma/index', { esmas });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Esma detayı
router.get('/:number', async (req, res) => {
  try {
    const esma = await Esma.findOne({ number: req.params.number });
    if (!esma) {
      return res.status(404).send('İsim bulunamadı');
    }

    esma.viewCount += 1;
    await esma.save();

    res.render('esma/detail', { esma });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

module.exports = router;
