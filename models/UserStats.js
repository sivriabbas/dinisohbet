const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  
  // Kuran istatistikleri
  quran: {
    totalAyahsRead: { type: Number, default: 0 },
    totalSurahsRead: { type: Number, default: 0 },
    totalPages: { type: Number, default: 0 },
    totalJuz: { type: Number, default: 0 },
    lastReadSurah: Number,
    lastReadAyah: Number,
    completedSurahs: [Number],
    readingStreak: { type: Number, default: 0 },
    lastReadDate: Date
  },
  
  // Hadis istatistikleri
  hadith: {
    totalRead: { type: Number, default: 0 },
    buhari: { type: Number, default: 0 },
    muslim: { type: Number, default: 0 },
    abuDawud: { type: Number, default: 0 },
    tirmidhi: { type: Number, default: 0 },
    nasai: { type: Number, default: 0 },
    ibnMajah: { type: Number, default: 0 }
  },
  
  // Dua istatistikleri
  duas: {
    totalRead: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 }
  },
  
  // Namaz istatistikleri
  prayer: {
    totalChecks: { type: Number, default: 0 },
    notificationsEnabled: { type: Boolean, default: false }
  },
  
  // Tesbih istatistikleri
  dhikr: {
    totalCount: { type: Number, default: 0 },
    todayCount: { type: Number, default: 0 },
    weekCount: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastCountDate: Date
  },
  
  // Hedef istatistikleri
  goals: {
    totalCreated: { type: Number, default: 0 },
    totalCompleted: { type: Number, default: 0 },
    activeGoals: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }
  },
  
  // Sohbet istatistikleri
  social: {
    totalPosts: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 }
  },
  
  // Esma-ül Hüsna
  esma: {
    totalListened: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 }
  },
  
  // Genel streak
  overallStreak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActivityDate: Date
  },
  
  // Başarı rozetleri
  badges: [{
    type: {
      type: String,
      enum: [
        'first_quran',      // İlk Kuran okuma
        'first_hadith',     // İlk hadis okuma
        'streak_7',         // 7 gün streak
        'streak_30',        // 30 gün streak
        'streak_100',       // 100 gün streak
        'quran_100',        // 100 ayet okuma
        'quran_1000',       // 1000 ayet okuma
        'hadith_100',       // 100 hadis okuma
        'dhikr_1000',       // 1000 zikir
        'dhikr_10000',      // 10000 zikir
        'goal_master',      // 50 hedef tamamlama
        'social_butterfly', // 100 paylaşım
        'helper',           // 100 yorum
        'quran_complete'    // Kuran'ı hatim
      ]
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('UserStats', userStatsSchema);
