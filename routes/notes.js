const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Bookmark = require('../models/Bookmark');

// Middleware: Kullanıcı girişi kontrolü
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// Notlar sayfası
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { type, filter } = req.query;
    
    // Notlar sorgusu
    let notesQuery = { user: userId };
    if (type) notesQuery.type = type;
    if (filter === 'favorites') notesQuery.isFavorite = true;
    
    const notes = await Note.find(notesQuery)
      .populate('hadithId')
      .populate('duaId')
      .sort({ createdAt: -1 });
    
    // İşaretler sorgusu
    let bookmarksQuery = { user: userId };
    if (type) bookmarksQuery.type = type;
    
    const bookmarks = await Bookmark.find(bookmarksQuery)
      .populate('hadithId')
      .populate('duaId')
      .sort({ createdAt: -1 });
    
    // İstatistikler
    const stats = {
      totalNotes: await Note.countDocuments({ user: userId }),
      totalBookmarks: await Bookmark.countDocuments({ user: userId }),
      quranNotes: await Note.countDocuments({ user: userId, type: 'quran' }),
      hadithNotes: await Note.countDocuments({ user: userId, type: 'hadith' }),
      duaNotes: await Note.countDocuments({ user: userId, type: 'dua' }),
      favoriteNotes: await Note.countDocuments({ user: userId, isFavorite: true })
    };
    
    res.render('notes/index', {
      notes,
      bookmarks,
      stats,
      currentType: type || 'all',
      currentFilter: filter || 'all'
    });
  } catch (error) {
    console.error('Notlar yükleme hatası:', error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Yeni not oluştur
router.post('/create', requireAuth, async (req, res) => {
  try {
    const { type, surahNumber, ayahNumber, hadithId, duaId, content, highlightColor, tags } = req.body;
    
    const note = new Note({
      user: req.session.user._id,
      type,
      content,
      highlightColor: highlightColor || 'yellow'
    });
    
    if (type === 'quran') {
      note.surahNumber = parseInt(surahNumber);
      note.ayahNumber = parseInt(ayahNumber);
    } else if (type === 'hadith') {
      note.hadithId = hadithId;
    } else if (type === 'dua') {
      note.duaId = duaId;
    }
    
    if (tags) {
      note.tags = tags.split(',').map(t => t.trim()).filter(t => t);
    }
    
    await note.save();
    
    if (req.headers['content-type'] === 'application/json') {
      res.json({ success: true, note });
    } else {
      res.redirect('/notes');
    }
  } catch (error) {
    console.error('Not oluşturma hatası:', error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

// Not güncelle
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { content, highlightColor, tags, isFavorite } = req.body;
    
    const note = await Note.findOne({ _id: req.params.id, user: req.session.user._id });
    
    if (!note) {
      return res.status(404).json({ error: 'Not bulunamadı' });
    }
    
    if (content) note.content = content;
    if (highlightColor) note.highlightColor = highlightColor;
    if (tags !== undefined) {
      note.tags = tags.split(',').map(t => t.trim()).filter(t => t);
    }
    if (isFavorite !== undefined) note.isFavorite = isFavorite;
    
    await note.save();
    res.json({ success: true, note });
  } catch (error) {
    console.error('Not güncelleme hatası:', error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

// Not sil
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, user: req.session.user._id });
    res.json({ success: true });
  } catch (error) {
    console.error('Not silme hatası:', error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

// Yeni işaret oluştur
router.post('/bookmarks/create', requireAuth, async (req, res) => {
  try {
    const { type, surahNumber, ayahNumber, surahName, ayahText, hadithId, hadithTitle, duaId, duaTitle, category, note } = req.body;
    
    const bookmark = new Bookmark({
      user: req.session.user._id,
      type,
      category: category || 'reading',
      note
    });
    
    if (type === 'quran') {
      bookmark.surahNumber = parseInt(surahNumber);
      bookmark.ayahNumber = parseInt(ayahNumber);
      bookmark.surahName = surahName;
      bookmark.ayahText = ayahText;
    } else if (type === 'hadith') {
      bookmark.hadithId = hadithId;
      bookmark.hadithTitle = hadithTitle;
    } else if (type === 'dua') {
      bookmark.duaId = duaId;
      bookmark.duaTitle = duaTitle;
    }
    
    await bookmark.save();
    res.json({ success: true, bookmark });
  } catch (error) {
    console.error('İşaret oluşturma hatası:', error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

// İşaret sil
router.delete('/bookmarks/:id', requireAuth, async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.session.user._id });
    res.json({ success: true });
  } catch (error) {
    console.error('İşaret silme hatası:', error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

// API: Kullanıcının belirli bir ayet için notunu getir
router.get('/api/ayah/:surahNumber/:ayahNumber', requireAuth, async (req, res) => {
  try {
    const { surahNumber, ayahNumber } = req.params;
    const note = await Note.findOne({
      user: req.session.user._id,
      type: 'quran',
      surahNumber: parseInt(surahNumber),
      ayahNumber: parseInt(ayahNumber)
    });
    
    res.json({ note });
  } catch (error) {
    console.error('Not getirme hatası:', error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

// API: Kullanıcının belirli bir ayet için işaretini getir
router.get('/api/bookmark/ayah/:surahNumber/:ayahNumber', requireAuth, async (req, res) => {
  try {
    const { surahNumber, ayahNumber } = req.params;
    const bookmark = await Bookmark.findOne({
      user: req.session.user._id,
      type: 'quran',
      surahNumber: parseInt(surahNumber),
      ayahNumber: parseInt(ayahNumber)
    });
    
    res.json({ bookmark });
  } catch (error) {
    console.error('İşaret getirme hatası:', error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

module.exports = router;
