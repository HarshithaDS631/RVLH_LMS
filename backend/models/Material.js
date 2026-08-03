const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: String, required: true },
  subject: { type: String, required: true },
  type: { type: String, default: 'PDF' },
  category: { type: String, enum: ['Course Materials', 'Question Papers'], default: 'Course Materials' },
  size: { type: String, default: '1.2 MB' },
  year: { type: Number },
  date: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
