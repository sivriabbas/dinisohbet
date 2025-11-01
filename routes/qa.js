const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// Soru listesi
router.get('/', async (req, res) => {
  try {
    const { category, sort = 'recent', page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;
    
    const filter = { isApproved: true, isClosed: false };
    if (category) filter.category = category;
    
    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { views: -1 };
    if (sort === 'unanswered') {
      filter.answers = { $size: 0 };
    }
    
    const questions = await Question.find(filter)
      .populate('author', 'username avatar')
      .populate('bestAnswer')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    
    const totalQuestions = await Question.countDocuments(filter);
    const totalPages = Math.ceil(totalQuestions / limit);
    
    const stats = {
      total: await Question.countDocuments({ isApproved: true }),
      unanswered: await Question.countDocuments({ isApproved: true, answers: { $size: 0 } }),
      answered: await Question.countDocuments({ isApproved: true, bestAnswer: { $exists: true } })
    };
    
    res.render('qa/index', {
      questions,
      stats,
      currentPage: parseInt(page),
      totalPages,
      category: category || '',
      sort: sort || 'recent'
    });
  } catch (error) {
    console.error('Soru listesi hatası:', error);
    res.status(500).send('Sunucu hatası');
  }
});

// Yeni soru formu
router.get('/new', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.render('qa/new');
});

// Yeni soru oluştur
router.post('/new', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Giriş yapmanız gerekiyor' });
  }
  
  try {
    const { title, content, category, tags } = req.body;
    
    const question = new Question({
      title,
      content,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      author: req.session.user._id,
      isApproved: true // Otomatik onay (admin moderasyonu için false yapılabilir)
    });
    
    await question.save();
    res.redirect(`/qa/${question._id}`);
  } catch (error) {
    console.error('Soru oluşturma hatası:', error);
    res.status(500).send('Soru oluşturulamadı');
  }
});

// Soru detay
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username avatar createdAt')
      .populate('bestAnswer');
    
    if (!question) {
      return res.status(404).send('Soru bulunamadı');
    }
    
    // Görüntülenme sayısını artır
    question.views += 1;
    await question.save();
    
    // Cevapları getir (en çok upvote alana göre sırala)
    const answers = await Answer.find({ question: question._id, isApproved: true })
      .populate('author', 'username avatar')
      .sort({ upvotes: -1, createdAt: 1 });
    
    // En iyi cevabı başa al
    if (question.bestAnswer) {
      const bestAnswerIndex = answers.findIndex(a => a._id.equals(question.bestAnswer._id));
      if (bestAnswerIndex > 0) {
        const bestAnswer = answers.splice(bestAnswerIndex, 1)[0];
        answers.unshift(bestAnswer);
      }
    }
    
    res.render('qa/detail', {
      question,
      answers,
      userVote: req.session.user ? {
        questionUpvoted: question.upvotes.includes(req.session.user._id),
        questionDownvoted: question.downvotes.includes(req.session.user._id)
      } : null
    });
  } catch (error) {
    console.error('Soru detay hatası:', error);
    res.status(500).send('Sunucu hatası');
  }
});

// Soru oylarına
router.post('/:id/vote', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Giriş yapmanız gerekiyor' });
  }
  
  try {
    const { type } = req.body; // 'up' or 'down'
    const question = await Question.findById(req.params.id);
    const userId = req.session.user._id;
    
    // Mevcut oyları kaldır
    question.upvotes = question.upvotes.filter(id => !id.equals(userId));
    question.downvotes = question.downvotes.filter(id => !id.equals(userId));
    
    // Yeni oy ekle
    if (type === 'up') {
      question.upvotes.push(userId);
    } else if (type === 'down') {
      question.downvotes.push(userId);
    }
    
    await question.save();
    
    res.json({
      upvotes: question.upvotes.length,
      downvotes: question.downvotes.length,
      score: question.upvotes.length - question.downvotes.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Oylama başarısız' });
  }
});

// Cevap ekle
router.post('/:id/answer', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Giriş yapmanız gerekiyor' });
  }
  
  try {
    const { content, sources } = req.body;
    
    const answer = new Answer({
      content,
      question: req.params.id,
      author: req.session.user._id,
      sources: sources || [],
      isApproved: true
    });
    
    await answer.save();
    
    // Soruya cevap ID'sini ekle
    await Question.findByIdAndUpdate(req.params.id, {
      $push: { answers: answer._id }
    });
    
    res.redirect(`/qa/${req.params.id}`);
  } catch (error) {
    console.error('Cevap ekleme hatası:', error);
    res.status(500).send('Cevap eklenemedi');
  }
});

// Cevap oylarına
router.post('/answer/:id/vote', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Giriş yapmanız gerekiyor' });
  }
  
  try {
    const { type } = req.body;
    const answer = await Answer.findById(req.params.id);
    const userId = req.session.user._id;
    
    answer.upvotes = answer.upvotes.filter(id => !id.equals(userId));
    answer.downvotes = answer.downvotes.filter(id => !id.equals(userId));
    
    if (type === 'up') {
      answer.upvotes.push(userId);
    } else if (type === 'down') {
      answer.downvotes.push(userId);
    }
    
    await answer.save();
    
    res.json({
      upvotes: answer.upvotes.length,
      downvotes: answer.downvotes.length,
      score: answer.upvotes.length - answer.downvotes.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Oylama başarısız' });
  }
});

// En iyi cevap seç (sadece soru sahibi)
router.post('/:questionId/best-answer/:answerId', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Giriş yapmanız gerekiyor' });
  }
  
  try {
    const question = await Question.findById(req.params.questionId);
    
    // Sadece soru sahibi seçebilir
    if (!question.author.equals(req.session.user._id)) {
      return res.status(403).json({ error: 'Yetkiniz yok' });
    }
    
    // Eski en iyi cevabı kaldır
    if (question.bestAnswer) {
      await Answer.findByIdAndUpdate(question.bestAnswer, { isBestAnswer: false });
    }
    
    // Yeni en iyi cevabı işaretle
    question.bestAnswer = req.params.answerId;
    await question.save();
    
    await Answer.findByIdAndUpdate(req.params.answerId, { isBestAnswer: true });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'İşlem başarısız' });
  }
});

module.exports = router;
