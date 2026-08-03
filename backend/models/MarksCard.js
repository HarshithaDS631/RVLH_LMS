const mongoose = require('mongoose');

const marksCardSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  roll: { type: String, required: true },
  term: { type: String, required: true }, // e.g. "Mid-Term Examination 2024-25"
  subjects: [{
    name: String,
    marksObtained: Number,
    maxMarks: Number,
    grade: String,
    teacherName: String,
    remark: String
  }],
  totalObtained: Number,
  totalMax: Number,
  percentile: Number,
  classRank: String,
  overallGrade: String,
  principalSignature: { type: Boolean, default: true },
  issueDate: String
}, { timestamps: true });

module.exports = mongoose.model('MarksCard', marksCardSchema);
