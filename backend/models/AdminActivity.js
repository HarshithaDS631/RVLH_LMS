const mongoose = require('mongoose');

const adminActivitySchema = new mongoose.Schema({
  adminId: { type: String, required: true },
  adminName: { type: String, required: true },
  email: { type: String },
  action: { type: String, required: true },
  targetType: { type: String }, // e.g. User, Course, Fee, Announcement
  targetName: { type: String },
  details: { type: String },
  ip: { type: String, default: '127.0.0.1' }
}, { timestamps: true });

module.exports = mongoose.model('AdminActivity', adminActivitySchema, 'admin_activities');
