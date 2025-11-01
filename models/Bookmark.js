const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['quran', 'hadith', 'dua'],
    required: true
  },
  // Kuran için
  surahNumber: Number,
  ayahNumber: Number,
  surahName: String,
  ayahText: String,
  
  // Hadis için
  hadithId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hadith'
  },
  hadithTitle: String,
  
  // Dua için
  duaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dua'
  },
  duaTitle: String,
  
  // İşaret kategorisi
  category: {
    type: String,
    enum: ['reading', 'favorite', 'study', 'memorize', 'other'],
    default: 'reading'
  },
  
  // Kısa not
  note: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index'ler
bookmarkSchema.index({ user: 1, type: 1 });
bookmarkSchema.index({ user: 1, category: 1 });
bookmarkSchema.index({ user: 1, surahNumber: 1 });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
