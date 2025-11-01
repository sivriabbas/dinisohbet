const express = require('express');
const router = express.Router();
const Hadith = require('../models/Hadith');

// Hadis listesi
router.get('/', async (req, res) => {
  try {
    const { source, category, page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;
    
    let query = {};

    if (source && source !== 'all') {
      query.source = source;
    }
    if (category && category !== 'all') {
      query.category = category;
    }

    const totalHadiths = await Hadith.countDocuments(query);
    const totalPages = Math.ceil(totalHadiths / limit);
    const hadiths = await Hadith.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.render('hadiths/list', { 
      hadiths, 
      source: source || 'all', 
      category: category || 'all',
      currentPage: parseInt(page),
      totalPages,
      totalHadiths
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Hadis detayı
router.get('/:id', async (req, res) => {
  try {
    const hadith = await Hadith.findById(req.params.id);
    if (!hadith) {
      return res.status(404).send('Hadis bulunamadı');
    }

    hadith.viewCount += 1;
    await hadith.save();

    res.render('hadiths/detail', { hadith });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Rastgele hadis
router.get('/random/hadith', async (req, res) => {
  try {
    const count = await Hadith.countDocuments();
    const random = Math.floor(Math.random() * count);
    const hadith = await Hadith.findOne().skip(random);
    res.json(hadith);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

// Favorilere ekle/çıkar
router.post('/:id/favorite', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Giriş yapmalısınız' });
    }

    const hadith = await Hadith.findById(req.params.id);
    if (!hadith) {
      return res.status(404).json({ error: 'Hadis bulunamadı' });
    }

    const userId = req.session.user.id;
    const favIndex = hadith.favorites.indexOf(userId);

    if (favIndex > -1) {
      hadith.favorites.splice(favIndex, 1);
    } else {
      hadith.favorites.push(userId);
    }

    await hadith.save();
    res.json({ favorites: hadith.favorites.length, favorited: favIndex === -1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

module.exports = router;
