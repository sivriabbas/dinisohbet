const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { isAuthenticated } = require('./auth');

// Kullanıcı profili
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password');

    if (!user) {
      return res.status(404).send('Kullanıcı bulunamadı');
    }

    const posts = await Post.find({ author: user._id, isApproved: true })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    res.render('users/profile', { profileUser: user, posts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Profil düzenleme sayfası
router.get('/:username/edit', isAuthenticated, async (req, res) => {
  try {
    if (req.session.user.username !== req.params.username) {
      return res.status(403).send('Bu işlem için yetkiniz yok');
    }

    const user = await User.findById(req.session.user.id)
      .select('-password');

    res.render('users/edit', { user, error: null });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Profil güncelleme
router.post('/:username/edit', isAuthenticated, async (req, res) => {
  try {
    if (req.session.user.username !== req.params.username) {
      return res.status(403).send('Bu işlem için yetkiniz yok');
    }

    const { bio } = req.body;
    const user = await User.findById(req.session.user.id);

    if (bio !== undefined) {
      user.bio = bio;
    }

    await user.save();
    res.redirect(`/users/${user.username}`);
  } catch (error) {
    console.error(error);
    const user = await User.findById(req.session.user.id).select('-password');
    res.render('users/edit', { user, error: 'Profil güncellenirken bir hata oluştu' });
  }
});

module.exports = router;
