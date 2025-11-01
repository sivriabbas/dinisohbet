const mongoose = require('mongoose');

const duaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  arabicText: {
    type: String,
    required: true,
    maxlength: 2000
  },
  turkishText: {
    type: String,
    required: true,
    maxlength: 2000
  },
  meaning: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['sabah', 'aksam', 'yemek', 'yolculuk', 'hasta', 'tesbihat', 'genel', 'diğer'],
    default: 'genel'
  },
  source: {
    type: String,
    maxlength: 500
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Dua', duaSchema);
