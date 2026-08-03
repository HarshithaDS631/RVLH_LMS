const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['JEE', 'NEET', 'Commerce', 'General'], default: 'JEE' },
  duration: { type: String, default: '1 Year' },
  fee: { type: Number, default: 30000 },
  maxCapacity: { type: Number, default: 150 },
  enrolledCount: { type: Number, default: 0 },
  faculty: { type: String, default: 'Dr. Priya Mehta' },
  description: { type: String },
  subjects: [{ type: String }],
  curriculum: { type: String, default: 'Standard Curriculum' },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
