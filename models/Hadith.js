const mongoose = require('mongoose');

const hadithSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  arabicText: {
    type: String,
    required: true
  },
  turkishText: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true,
    enum: ['Buhari', 'Müslim', 'Ebu Davud', 'Tirmizi', 'Nesai', 'İbn Mace', 'Muvatta']
  },
  category: {
    type: String,
    required: true,
    enum: ['iman', 'ibadet', 'ahlak', 'muamelat', 'edeb', 'ilim', 'cihad', 'diğer']
  },
  bookNumber: String,
  hadithNumber: String,
  viewCount: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hadith', hadithSchema);
