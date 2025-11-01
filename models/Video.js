const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: '/images/default-video-thumb.jpg'
  },
  duration: {
    type: Number, // seconds
    default: 0
  },
  category: {
    type: String,
    enum: ['ders', 'hutbe', 'kuran', 'ezan', 'ilahi', 'sohbet', 'diger'],
    default: 'diger'
  },
  type: {
    type: String,
    enum: ['video', 'audio'],
    default: 'video'
  },
  speaker: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }
}, {
  timestamps: true
});

// İndeksler
videoSchema.index({ category: 1, createdAt: -1 });
videoSchema.index({ speaker: 1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ views: -1 });

module.exports = mongoose.model('Video', videoSchema);
