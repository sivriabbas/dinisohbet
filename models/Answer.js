const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isBestAnswer: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  sources: [{
    title: String,
    url: String
  }]
}, {
  timestamps: true
});

// İndeksler
answerSchema.index({ question: 1, createdAt: 1 });
answerSchema.index({ author: 1 });

// Virtual - vote score
answerSchema.virtual('voteScore').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

module.exports = mongoose.model('Answer', answerSchema);
