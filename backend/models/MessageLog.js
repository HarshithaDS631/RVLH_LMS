const mongoose = require('mongoose');

const messageLogSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  parentPhone: { type: String, required: true },
  channel: { type: String, enum: ['WhatsApp', 'SMS'], required: true },
  type: { type: String, enum: ['Attendance', 'Exam Result', 'Fee Receipt', 'Leave Update'], required: true },
  messageText: { type: String, required: true },
  status: { type: String, enum: ['Sent', 'Delivered', 'Failed'], default: 'Sent' },
  sentAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MessageLog', messageLogSchema, 'message_logs');
