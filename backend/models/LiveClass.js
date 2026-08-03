const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  subject: { type: String, required: true },
  faculty: { type: String, required: true },
  status: { type: String, enum: ['ongoing', 'upcoming', 'ended'], default: 'upcoming' },
  onlineViewers: { type: Number, default: 0 },
  scheduledTime: { type: String, required: true },
  scheduledDate: { type: String, default: 'Today' },
  streamUrl: { type: String, default: 'https://www.youtube.com/embed/3JIpN8nnPoM' },
  chatMessages: [{
    sender: String,
    role: String,
    text: String,
    time: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('LiveClass', liveClassSchema, 'live_classes');
