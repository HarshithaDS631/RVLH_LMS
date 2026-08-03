const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  target: { type: String, default: 'All Students & Faculty' },
  author: { type: String, default: 'Administration' },
  date: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
