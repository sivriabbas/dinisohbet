const express = require('express');
const router = express.Router();
const Dua = require('../models/Dua');
const { isAuthenticated } = require('./auth');

// Dua listesi
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isApproved: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    const duas = await Dua.find(query)
      .populate('addedBy', 'username')
      .sort({ createdAt: -1 });

    res.render('duas/list', { duas, category: category || 'all' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Yeni dua ekleme sayfası
router.get('/new', isAuthenticated, (req, res) => {
  res.render('duas/new', { error: null });
});

// Yeni dua ekle
router.post('/new', isAuthenticated, async (req, res) => {
  try {
    const { title, arabicText, turkishText, meaning, category, source } = req.body;

    if (!title || !arabicText || !turkishText || !meaning) {
      return res.render('duas/new', { error: 'Tüm zorunlu alanları doldurunuz' });
    }

    const dua = new Dua({
      title,
      arabicText,
      turkishText,
      meaning,
      category: category || 'genel',
      source,
      addedBy: req.session.user.id,
      isApproved: req.session.user.role === 'admin' || req.session.user.role === 'moderator'
    });

    await dua.save();
    res.redirect('/duas');
  } catch (error) {
    console.error(error);
    res.render('duas/new', { error: 'Dua eklenirken bir hata oluştu' });
  }
});

// Dua detayı
router.get('/:id', async (req, res) => {
  try {
    const dua = await Dua.findById(req.params.id)
      .populate('addedBy', 'username');

    if (!dua) {
      return res.status(404).send('Dua bulunamadı');
    }

    dua.viewCount += 1;
    await dua.save();

    res.render('duas/detail', { dua });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Favorilere ekle/çıkar
router.post('/:id/favorite', isAuthenticated, async (req, res) => {
  try {
    const dua = await Dua.findById(req.params.id);
    if (!dua) {
      return res.status(404).json({ error: 'Dua bulunamadı' });
    }

    const userId = req.session.user.id;
    const favIndex = dua.favorites.indexOf(userId);

    if (favIndex > -1) {
      dua.favorites.splice(favIndex, 1);
    } else {
      dua.favorites.push(userId);
    }

    await dua.save();
    res.json({ favorites: dua.favorites.length, favorited: favIndex === -1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

module.exports = router;
