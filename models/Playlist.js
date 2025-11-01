const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  thumbnailUrl: {
    type: String,
    default: '/images/default-playlist-thumb.jpg'
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  category: {
    type: String,
    enum: ['ders', 'hutbe', 'kuran', 'ezan', 'ilahi', 'sohbet', 'diger'],
    default: 'diger'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Playlist', playlistSchema);
