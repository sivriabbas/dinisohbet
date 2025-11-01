const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true // Font Awesome icon class
  },
  category: {
    type: String,
    enum: ['quran', 'hadith', 'dua', 'prayer', 'streak', 'general'],
    required: true
  },
  requirement: {
    type: Number,
    required: true // Gerekli sayı (örn: 7 gün streak, 100 ayet)
  },
  requirementType: {
    type: String,
    enum: ['streak', 'total_ayahs', 'total_hadiths', 'total_duas', 'goals_completed', 'days_active'],
    required: true
  },
  color: {
    type: String,
    default: '#FFD700' // Altın rengi
  },
  points: {
    type: Number,
    default: 10
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);
