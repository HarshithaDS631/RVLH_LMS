const mongoose = require('mongoose');

const videoChatLogSchema = new mongoose.Schema({
  videoTitle: { type: String, required: true },
  studentName: { type: String, default: 'Arjun Sharma' },
  userQuery: { type: String, required: true },
  aiResponse: { type: String, required: true },
  timestampMark: { type: String, default: '12:45' },
  subject: { type: String, default: 'Physics' }
}, { timestamps: true });

module.exports = mongoose.model('VideoChatLog', videoChatLogSchema, 'video_chat_logs');
