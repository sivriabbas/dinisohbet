const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'quran_read',      // Kuran okuma
      'ayah_view',       // Ayet görüntüleme
      'hadith_read',     // Hadis okuma
      'dua_read',        // Dua okuma
      'prayer_check',    // Namaz vakti kontrolü
      'dhikr_count',     // Tesbih sayımı
      'goal_complete',   // Hedef tamamlama
      'post_create',     // Paylaşım oluşturma
      'comment_create',  // Yorum yapma
      'note_create',     // Not oluşturma
      'esma_listen'      // Esma dinleme
    ],
    required: true
  },
  metadata: {
    surahNumber: Number,
    ayahNumber: Number,
    hadithId: mongoose.Schema.Types.ObjectId,
    duaId: mongoose.Schema.Types.ObjectId,
    dhikrCount: Number,
    goalId: mongoose.Schema.Types.ObjectId,
    postId: mongoose.Schema.Types.ObjectId,
    value: Number
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for user and date queries
userActivitySchema.index({ user: 1, date: -1 });
userActivitySchema.index({ user: 1, type: 1, date: -1 });

module.exports = mongoose.model('UserActivity', userActivitySchema);
