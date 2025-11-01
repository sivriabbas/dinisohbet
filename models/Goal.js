const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  category: {
    type: String,
    enum: ['quran', 'hadith', 'dua', 'prayer', 'general'],
    required: true
  },
  target: {
    type: Number,
    required: true // Hedef sayı (örn: 5 sayfa, 3 hadis)
  },
  unit: {
    type: String,
    enum: ['ayah', 'page', 'surah', 'hadith', 'dua', 'prayer'],
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  streak: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hedef tamamlanma yüzdesi hesapla
goalSchema.virtual('completionPercentage').get(function() {
  return Math.min(Math.round((this.progress / this.target) * 100), 100);
});

// Hedef durumunu kontrol et
goalSchema.methods.checkCompletion = function() {
  if (this.progress >= this.target && !this.completed) {
    this.completed = true;
    this.completedAt = new Date();
    this.streak += 1;
  }
  return this.completed;
};

// Hedefi sıfırla (yeni gün/hafta için)
goalSchema.methods.reset = function() {
  this.progress = 0;
  this.completed = false;
  this.completedAt = null;
  this.startDate = new Date();
  
  if (this.type === 'daily') {
    this.endDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  } else if (this.type === 'weekly') {
    this.endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  } else if (this.type === 'monthly') {
    this.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
};

module.exports = mongoose.model('Goal', goalSchema);
