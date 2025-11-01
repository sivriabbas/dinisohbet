const express = require('express');
const router = express.Router();
const Surah = require('../models/Surah');

// Tüm sureleri listele
router.get('/', async (req, res) => {
  try {
    const surahs = await Surah.find().sort({ number: 1 });
    res.render('quran/list', { surahs });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Sure detayı
router.get('/:number', async (req, res) => {
  try {
    const surah = await Surah.findOne({ number: req.params.number });
    if (!surah) {
      return res.status(404).send('Sure bulunamadı');
    }
    res.render('quran/detail', { surah });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Rastgele ayet
router.get('/random/ayah', async (req, res) => {
  try {
    const count = await Surah.countDocuments();
    const random = Math.floor(Math.random() * count);
    const surah = await Surah.findOne().skip(random);
    
    if (surah && surah.ayahs.length > 0) {
      const randomAyah = surah.ayahs[Math.floor(Math.random() * surah.ayahs.length)];
      res.json({ surah: surah.name, ayah: randomAyah });
    } else {
      res.json({ error: 'Ayet bulunamadı' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

module.exports = router;
