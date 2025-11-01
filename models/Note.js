const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
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
  
  // Hadis için
  hadithId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hadith'
  },
  
  // Dua için
  duaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dua'
  },
  
  // Not içeriği
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  // Highlight rengi
  highlightColor: {
    type: String,
    enum: ['yellow', 'green', 'blue', 'pink', 'purple', 'orange'],
    default: 'yellow'
  },
  
  // Kategori/etiket
  tags: [String],
  
  // Favori mi?
  isFavorite: {
    type: Boolean,
    default: false
  },
  
  // Özel (sadece kullanıcı görebilir)
  isPrivate: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index'ler
noteSchema.index({ user: 1, type: 1 });
noteSchema.index({ user: 1, isFavorite: 1 });
noteSchema.index({ user: 1, surahNumber: 1, ayahNumber: 1 });

module.exports = mongoose.model('Note', noteSchema);
