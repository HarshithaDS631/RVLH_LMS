const mongoose = require('mongoose');

const questionBankSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  moduleName: { type: String, required: true },
  questionText: { type: String, required: true },
  options: [{ type: String }],
  correctOption: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'JEE Advanced'], default: 'Medium' },
  type: { type: String, enum: ['MCQ', 'MSQ', 'Numerical'], default: 'MCQ' },
  solutionExplanation: { type: String, required: true },
  createdBy: { type: String, default: 'Faculty' }
}, { timestamps: true });

module.exports = mongoose.model('QuestionBank', questionBankSchema, 'question_banks');
