const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String },
  role: { type: String, enum: ['student', 'faculty'], required: true },
  action: { type: String, required: true },
  module: { type: String }, // e.g. Video, Quiz, Doubt, Material, Attendance
  details: { type: String },
  ip: { type: String, default: '127.0.0.1' }
}, { timestamps: true });

module.exports = mongoose.model('UserActivity', userActivitySchema, 'user_activities');
