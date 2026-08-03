const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: String, required: true },
  subject: { type: String, required: true },
  duration: { type: String, default: '45:00' },
  views: { type: Number, default: 0 },
  faculty: { type: String, default: 'Dr. Priya Mehta' },
  thumbnail: { type: String, default: '⚡' },
  date: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
