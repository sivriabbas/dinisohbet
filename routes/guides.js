const express = require('express');
const router = express.Router();
const PrayerGuide = require('../models/PrayerGuide');

// İbadet rehberi listesi
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    const guides = await PrayerGuide.find(query).sort({ createdAt: -1 });
    res.render('guides/list', { guides, category: category || 'all' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Rehber detayı
router.get('/:id', async (req, res) => {
  try {
    const guide = await PrayerGuide.findById(req.params.id);
    if (!guide) {
      return res.status(404).send('Rehber bulunamadı');
    }

    guide.viewCount += 1;
    await guide.save();

    res.render('guides/detail', { guide });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

module.exports = router;
