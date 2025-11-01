const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware - Kullanıcı giriş kontrolü
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

// Kayıt sayfası
router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('auth/register', { error: null });
});

// Kayıt işlemi
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validasyon
    if (!username || !email || !password || !confirmPassword) {
      return res.render('auth/register', { error: 'Tüm alanları doldurunuz' });
    }

    if (password !== confirmPassword) {
      return res.render('auth/register', { error: 'Şifreler eşleşmiyor' });
    }

    if (password.length < 6) {
      return res.render('auth/register', { error: 'Şifre en az 6 karakter olmalı' });
    }

    // Kullanıcı kontrolü
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render('auth/register', { error: 'Bu email veya kullanıcı adı zaten kullanılıyor' });
    }

    // Yeni kullanıcı oluştur
    const user = new User({ username, email, password });
    await user.save();

    // Session oluştur
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.render('auth/register', { error: 'Kayıt sırasında bir hata oluştu' });
  }
});

// Giriş sayfası
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('auth/login', { error: null });
});

// Giriş işlemi
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('auth/login', { error: 'Email ve şifre gerekli' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render('auth/login', { error: 'Email veya şifre hatalı' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Email veya şifre hatalı' });
    }

    if (!user.isActive) {
      return res.render('auth/login', { error: 'Hesabınız aktif değil' });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.render('auth/login', { error: 'Giriş sırasında bir hata oluştu' });
  }
});

// Çıkış
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
module.exports.isAuthenticated = isAuthenticated;
