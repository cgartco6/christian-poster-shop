const mongoose = require('mongoose');

const scheduledPostSchema = new mongoose.Schema({
  platform: { type: String, enum: ['facebook', 'instagram', 'tiktok'], required: true },
  message: String,
  imageUrl: String,
  scheduledFor: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  error: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScheduledPost', scheduledPostSchema);
