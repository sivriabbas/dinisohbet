const mongoose = require('mongoose');

const esmaSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  arabic: {
    type: String,
    required: true
  },
  turkish: {
    type: String,
    required: true
  },
  transliteration: {
    type: String,
    required: true
  },
  meaning: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  benefit: {
    type: String
  },
  audioUrl: {
    type: String
  },
  viewCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Esma', esmaSchema);
