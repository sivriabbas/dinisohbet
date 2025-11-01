const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const Playlist = require('../models/Playlist');

// Video listesi
router.get('/', async (req, res) => {
  try {
    const { category, type, speaker, page = 1 } = req.query;
    const limit = 12;
    const skip = (page - 1) * limit;
    
    const filter = { isApproved: true };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (speaker) filter.speaker = new RegExp(speaker, 'i');
    
    const videos = await Video.find(filter)
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalVideos = await Video.countDocuments(filter);
    const totalPages = Math.ceil(totalVideos / limit);
    
    const featuredVideos = await Video.find({ isApproved: true, isFeatured: true })
      .limit(5)
      .sort({ views: -1 });
    
    const playlists = await Playlist.find({ isPublic: true })
      .populate('videos', 'title thumbnailUrl')
      .limit(6)
      .sort({ createdAt: -1 });
    
    res.render('videos/index', {
      videos,
      featuredVideos,
      playlists,
      currentPage: parseInt(page),
      totalPages,
      category: category || '',
      type: type || '',
      speaker: speaker || ''
    });
  } catch (error) {
    console.error('Video listesi hatası:', error);
    res.status(500).send('Sunucu hatası');
  }
});

// Video detay
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploadedBy', 'username avatar')
      .populate('playlist', 'title');
    
    if (!video) {
      return res.status(404).send('Video bulunamadı');
    }
    
    // Görüntülenme sayısını artır
    video.views += 1;
    await video.save();
    
    // İlgili videolar
    const relatedVideos = await Video.find({
      _id: { $ne: video._id },
      category: video.category,
      isApproved: true
    }).limit(6);
    
    res.render('videos/detail', {
      video,
      relatedVideos,
      isLiked: req.session.user ? video.likes.includes(req.session.user._id) : false
    });
  } catch (error) {
    console.error('Video detay hatası:', error);
    res.status(500).send('Sunucu hatası');
  }
});

// Video beğen
router.post('/:id/like', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Giriş yapmanız gerekiyor' });
  }
  
  try {
    const video = await Video.findById(req.params.id);
    const userId = req.session.user._id;
    
    const likeIndex = video.likes.indexOf(userId);
    if (likeIndex > -1) {
      video.likes.splice(likeIndex, 1);
    } else {
      video.likes.push(userId);
    }
    
    await video.save();
    res.json({ likes: video.likes.length, isLiked: likeIndex === -1 });
  } catch (error) {
    res.status(500).json({ error: 'Beğeni işlemi başarısız' });
  }
});

// Playlist detay
router.get('/playlist/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('videos')
      .populate('createdBy', 'username');
    
    if (!playlist) {
      return res.status(404).send('Playlist bulunamadı');
    }
    
    playlist.views += 1;
    await playlist.save();
    
    res.render('videos/playlist', { playlist });
  } catch (error) {
    console.error('Playlist hatası:', error);
    res.status(500).send('Sunucu hatası');
  }
});

// Video arama
router.get('/search/query', async (req, res) => {
  try {
    const { q } = req.query;
    
    const videos = await Video.find({
      isApproved: true,
      $or: [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { speaker: new RegExp(q, 'i') },
        { tags: new RegExp(q, 'i') }
      ]
    }).limit(20);
    
    res.json({ videos });
  } catch (error) {
    res.status(500).json({ error: 'Arama başarısız' });
  }
});

module.exports = router;
