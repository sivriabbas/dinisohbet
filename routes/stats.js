const express = require('express');
const router = express.Router();
const UserStats = require('../models/UserStats');
const UserActivity = require('../models/UserActivity');
const Goal = require('../models/Goal');
const requireAuth = require('../middleware/requireAuth');

// Middleware - tüm route'lar auth gerektirir
router.use(requireAuth);

// Dashboard ana sayfa
router.get('/', async (req, res) => {
  try {
    // Kullanıcı istatistiklerini al veya oluştur
    let stats = await UserStats.findOne({ user: req.session.user._id });
    
    if (!stats) {
      stats = new UserStats({ user: req.session.user._id });
      await stats.save();
    }
    
    // Son 30 günün aktivitelerini al
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivities = await UserActivity.find({
      user: req.session.user._id,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 }).limit(50);
    
    // Günlük aktivite sayıları (heatmap için)
    const activityByDay = {};
    recentActivities.forEach(activity => {
      const dateKey = activity.date.toISOString().split('T')[0];
      activityByDay[dateKey] = (activityByDay[dateKey] || 0) + 1;
    });
    
    // Aktif hedefleri al
    const activeGoals = await Goal.find({
      user: req.session.user._id,
      isCompleted: false
    }).sort({ createdAt: -1 }).limit(5);
    
    res.render('stats/dashboard', {
      stats,
      activityByDay,
      recentActivities,
      activeGoals
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Aktivite kaydetme endpoint
router.post('/activity', async (req, res) => {
  try {
    const { type, metadata } = req.body;
    
    // Aktiviteyi kaydet
    const activity = new UserActivity({
      user: req.session.user._id,
      type,
      metadata
    });
    await activity.save();
    
    // İstatistikleri güncelle
    await updateUserStats(req.session.user._id, type, metadata);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Activity save error:', error);
    res.status(500).json({ error: 'Aktivite kaydedilemedi' });
  }
});

// İstatistikleri güncelleme fonksiyonu
async function updateUserStats(userId, type, metadata) {
  let stats = await UserStats.findOne({ user: userId });
  
  if (!stats) {
    stats = new UserStats({ user: userId });
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  switch (type) {
    case 'quran_read':
      stats.quran.totalAyahsRead += 1;
      if (metadata.surahNumber) {
        if (!stats.quran.completedSurahs.includes(metadata.surahNumber)) {
          stats.quran.totalSurahsRead += 1;
          stats.quran.completedSurahs.push(metadata.surahNumber);
        }
        stats.quran.lastReadSurah = metadata.surahNumber;
        stats.quran.lastReadAyah = metadata.ayahNumber;
      }
      stats.quran.lastReadDate = new Date();
      checkAndAwardBadge(stats, 'first_quran');
      if (stats.quran.totalAyahsRead >= 100) checkAndAwardBadge(stats, 'quran_100');
      if (stats.quran.totalAyahsRead >= 1000) checkAndAwardBadge(stats, 'quran_1000');
      if (stats.quran.totalSurahsRead >= 114) checkAndAwardBadge(stats, 'quran_complete');
      break;
      
    case 'hadith_read':
      stats.hadith.totalRead += 1;
      if (metadata.source) {
        const sourceMap = {
          'Buhari': 'buhari',
          'Müslim': 'muslim',
          'Ebu Davud': 'abuDawud',
          'Tirmizi': 'tirmidhi',
          'Nesai': 'nasai',
          'İbn Mace': 'ibnMajah'
        };
        const field = sourceMap[metadata.source];
        if (field) stats.hadith[field] += 1;
      }
      checkAndAwardBadge(stats, 'first_hadith');
      if (stats.hadith.totalRead >= 100) checkAndAwardBadge(stats, 'hadith_100');
      break;
      
    case 'dua_read':
      stats.duas.totalRead += 1;
      break;
      
    case 'prayer_check':
      stats.prayer.totalChecks += 1;
      break;
      
    case 'dhikr_count':
      const count = metadata.dhikrCount || 1;
      stats.dhikr.totalCount += count;
      
      // Günlük sayımı kontrol et
      if (!stats.dhikr.lastCountDate || stats.dhikr.lastCountDate < today) {
        stats.dhikr.todayCount = count;
        stats.dhikr.weekCount = count;
        stats.dhikr.lastCountDate = new Date();
      } else {
        stats.dhikr.todayCount += count;
        stats.dhikr.weekCount += count;
      }
      
      if (stats.dhikr.totalCount >= 1000) checkAndAwardBadge(stats, 'dhikr_1000');
      if (stats.dhikr.totalCount >= 10000) checkAndAwardBadge(stats, 'dhikr_10000');
      break;
      
    case 'goal_complete':
      stats.goals.totalCompleted += 1;
      if (stats.goals.totalCreated > 0) {
        stats.goals.completionRate = (stats.goals.totalCompleted / stats.goals.totalCreated) * 100;
      }
      if (stats.goals.totalCompleted >= 50) checkAndAwardBadge(stats, 'goal_master');
      break;
      
    case 'post_create':
      stats.social.totalPosts += 1;
      if (stats.social.totalPosts >= 100) checkAndAwardBadge(stats, 'social_butterfly');
      break;
      
    case 'comment_create':
      stats.social.totalComments += 1;
      if (stats.social.totalComments >= 100) checkAndAwardBadge(stats, 'helper');
      break;
      
    case 'esma_listen':
      stats.esma.totalListened += 1;
      break;
  }
  
  // Overall streak güncelle
  updateStreak(stats);
  
  await stats.save();
}

function updateStreak(stats) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActivity = stats.overallStreak.lastActivityDate;
  
  if (!lastActivity) {
    stats.overallStreak.current = 1;
    stats.overallStreak.longest = 1;
  } else {
    const lastActivityDate = new Date(lastActivity);
    lastActivityDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today - lastActivityDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Aynı gün, streak değişmez
    } else if (diffDays === 1) {
      // Ardışık gün
      stats.overallStreak.current += 1;
      if (stats.overallStreak.current > stats.overallStreak.longest) {
        stats.overallStreak.longest = stats.overallStreak.current;
      }
    } else {
      // Streak kırıldı
      stats.overallStreak.current = 1;
    }
  }
  
  stats.overallStreak.lastActivityDate = new Date();
  
  // Streak rozetleri
  if (stats.overallStreak.current >= 7) checkAndAwardBadge(stats, 'streak_7');
  if (stats.overallStreak.current >= 30) checkAndAwardBadge(stats, 'streak_30');
  if (stats.overallStreak.current >= 100) checkAndAwardBadge(stats, 'streak_100');
}

function checkAndAwardBadge(stats, badgeType) {
  const hasBadge = stats.badges.some(b => b.type === badgeType);
  if (!hasBadge) {
    stats.badges.push({ type: badgeType });
  }
}

module.exports = router;
