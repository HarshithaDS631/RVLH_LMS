const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Exam', 'Holiday', 'PTM', 'Sports/Cultural', 'Notice'], default: 'Notice' },
  date: { type: String, required: true },
  time: { type: String, default: 'All Day' },
  venue: { type: String, default: 'School Campus' },
  description: { type: String },
  targetAudience: { type: String, default: 'All Parents & Students' }
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
