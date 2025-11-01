const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { isAuthenticated } = require('./auth');

// Tüm paylaşımları listele
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isApproved: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'username avatar')
      .populate('comments.user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.render('posts/list', { posts, category: category || 'all', search: search || '' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Yeni paylaşım sayfası
router.get('/new', isAuthenticated, (req, res) => {
  res.render('posts/new', { error: null });
});

// Yeni paylaşım oluştur
router.post('/new', isAuthenticated, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content) {
      return res.render('posts/new', { error: 'Başlık ve içerik gerekli' });
    }

    const post = new Post({
      title,
      content,
      category: category || 'genel',
      author: req.session.user.id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await post.save();
    res.redirect(`/posts/${post._id}`);
  } catch (error) {
    console.error(error);
    res.render('posts/new', { error: 'Paylaşım oluşturulurken bir hata oluştu' });
  }
});

// Paylaşım detayı
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('comments.user', 'username avatar');

    if (!post) {
      return res.status(404).send('Paylaşım bulunamadı');
    }

    // Görüntüleme sayısını artır
    post.viewCount += 1;
    await post.save();

    res.render('posts/detail', { post });
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Yorum ekle
router.post('/:id/comment', isAuthenticated, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.redirect(`/posts/${req.params.id}`);
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Paylaşım bulunamadı');
    }

    post.comments.push({
      user: req.session.user.id,
      content: content.trim()
    });

    await post.save();
    res.redirect(`/posts/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.redirect(`/posts/${req.params.id}`);
  }
});

// Beğen/Beğenme
router.post('/:id/like', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Paylaşım bulunamadı' });
    }

    const userId = req.session.user.id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: likeIndex === -1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

module.exports = router;
