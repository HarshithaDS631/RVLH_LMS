const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  avatar: { type: String },
  batch: { type: String },
  roll: { type: String },
  campus: { type: String },
  gender: { type: String },
  subject: { type: String },
  employeeId: { type: String },
  designation: { type: String },
  department: { type: String },
  streak: { type: Number, default: 0 },
  avgScore: { type: Number, default: 0 },
  feeStatus: { type: String, default: 'Due' },
  feeAmount: { type: Number, default: 45000 },
  feePaid: { type: Number, default: 0 },
  feePending: { type: Number, default: 45000 },
  feeDueDate: { type: String },
  feeMethod: { type: String, default: '—' },
  feeDate: { type: String, default: '—' },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
