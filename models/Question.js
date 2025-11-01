const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['ibadet', 'inanc', 'ahlak', 'muamelat', 'siyer', 'tefsir', 'hadis', 'fıkıh', 'diger'],
    default: 'diger'
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  bestAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isClosed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// İndeksler
questionSchema.index({ category: 1, createdAt: -1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ author: 1 });
questionSchema.index({ views: -1 });

// Virtual - vote score
questionSchema.virtual('voteScore').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

module.exports = mongoose.model('Question', questionSchema);
