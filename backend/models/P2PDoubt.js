const mongoose = require('mongoose');

const p2pDoubtSchema = new mongoose.Schema({
  studentName: { type: String, default: 'Arjun Sharma' },
  subject: { type: String, required: true },
  moduleName: { type: String, default: 'Module 1' },
  questionTitle: { type: String, required: true },
  questionText: { type: String, required: true },
  upvotes: { type: Number, default: 5 },
  status: { type: String, enum: ['Resolved', 'Unresolved'], default: 'Resolved' },
  aiSuggestedAnswer: { type: String },
  answers: [
    {
      author: { type: String, required: true },
      authorRole: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
      text: { type: String, required: true },
      upvotes: { type: Number, default: 2 },
      isVerified: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('P2PDoubt', p2pDoubtSchema, 'p2p_doubts');
