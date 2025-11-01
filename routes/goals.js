const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const Achievement = require('../models/Achievement');
const User = require('../models/User');

// Middleware: Kullanıcı girişi kontrolü
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// Hedefler sayfası
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user._id;
    
    // Aktif hedefleri getir
    const goals = await Goal.find({ user: userId, isActive: true }).sort({ createdAt: -1 });
    
    // Kullanıcı istatistiklerini getir
    const user = await User.findById(userId).populate('achievements.achievement');
    
    // Tüm rozetleri getir
    const allAchievements = await Achievement.find({}).sort({ points: -1 });
    
    // Kullanıcının sahip olduğu rozet ID'leri
    const unlockedAchievementIds = user.achievements.map(a => a.achievement._id.toString());
    
    res.render('goals/index', {
      goals,
      user,
      allAchievements,
      unlockedAchievementIds
    });
  } catch (error) {
    console.error('Hedefler yükleme hatası:', error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Yeni hedef oluştur
router.post('/create', requireAuth, async (req, res) => {
  try {
    const { type, category, target, unit } = req.body;
    const userId = req.session.user._id;
    
    // Bitiş tarihini hesapla
    let endDate = new Date();
    if (type === 'daily') {
      endDate.setDate(endDate.getDate() + 1);
    } else if (type === 'weekly') {
      endDate.setDate(endDate.getDate() + 7);
    } else if (type === 'monthly') {
      endDate.setDate(endDate.getDate() + 30);
    }
    
    const goal = new Goal({
      user: userId,
      type,
      category,
      target: parseInt(target),
      unit,
      endDate
    });
    
    await goal.save();
    res.redirect('/goals');
  } catch (error) {
    console.error('Hedef oluşturma hatası:', error);
    res.status(500).send('Bir hata oluştu');
  }
});

// Hedef ilerleme güncelle
router.post('/:id/progress', requireAuth, async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ error: 'Hedef bulunamadı' });
    }
    
    // İlerlemeyi güncelle
    goal.progress += parseInt(amount);
    
    // Tamamlanma kontrolü
    const wasCompleted = goal.completed;
    goal.checkCompletion();
    
    await goal.save();
    
    // Yeni tamamlandıysa kullanıcı istatistiklerini güncelle
    if (!wasCompleted && goal.completed) {
      const user = await User.findById(req.session.user._id);
      user.stats.totalPoints += 10;
      user.stats.currentStreak = goal.streak;
      
      if (goal.streak > user.stats.longestStreak) {
        user.stats.longestStreak = goal.streak;
      }
      
      await user.save();
      
      // Rozet kontrolü
      await checkAndUnlockAchievements(user);
    }
    
    res.json({
      success: true,
      goal,
      completed: goal.completed,
      percentage: goal.completionPercentage
    });
  } catch (error) {
    console.error('İlerleme güncelleme hatası:', error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

// Hedef sil
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Hedef silme hatası:', error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

// Hedef sıfırla
router.post('/:id/reset', requireAuth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ error: 'Hedef bulunamadı' });
    }
    
    goal.reset();
    await goal.save();
    
    res.json({ success: true, goal });
  } catch (error) {
    console.error('Hedef sıfırlama hatası:', error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
});

// Rozet kontrol ve kilidi aç
async function checkAndUnlockAchievements(user) {
  try {
    const allAchievements = await Achievement.find({});
    const userAchievementIds = user.achievements.map(a => a.achievement.toString());
    
    for (const achievement of allAchievements) {
      // Zaten kazanılmış mı?
      if (userAchievementIds.includes(achievement._id.toString())) {
        continue;
      }
      
      let unlocked = false;
      
      // Gereksinim kontrolü
      switch (achievement.requirementType) {
        case 'streak':
          unlocked = user.stats.currentStreak >= achievement.requirement;
          break;
        case 'total_ayahs':
          unlocked = user.stats.totalAyahsRead >= achievement.requirement;
          break;
        case 'total_hadiths':
          unlocked = user.stats.totalHadithsRead >= achievement.requirement;
          break;
        case 'total_duas':
          unlocked = user.stats.totalDuasRead >= achievement.requirement;
          break;
        case 'goals_completed':
          const completedGoals = await Goal.countDocuments({ user: user._id, completed: true });
          unlocked = completedGoals >= achievement.requirement;
          break;
      }
      
      if (unlocked) {
        user.achievements.push({
          achievement: achievement._id,
          unlockedAt: new Date()
        });
        user.stats.totalPoints += achievement.points;
        await user.save();
        
        console.log(`🏆 Rozet kazanıldı: ${achievement.name} (+${achievement.points} puan)`);
      }
    }
  } catch (error) {
    console.error('Rozet kontrolü hatası:', error);
  }
}

module.exports = router;
