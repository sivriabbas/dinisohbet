const mongoose = require('mongoose');

const prayerGuideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['abdest', 'gusul', 'teyemmum', 'namaz', 'oruç', 'zekat', 'hac', 'umre', 'kurban', 'diğer']
  },
  content: {
    type: String,
    required: true
  },
  steps: [{
    stepNumber: Number,
    title: String,
    description: String,
    image: String
  }],
  conditions: [String],
  invalidators: [String],
  sunnah: [String],
  viewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PrayerGuide', prayerGuideSchema);
