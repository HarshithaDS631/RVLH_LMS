const mongoose = require('mongoose');

const inVideoQuizSchema = new mongoose.Schema({
  videoId: { type: String, default: 'v1' },
  videoTitle: { type: String, required: true },
  timestampSeconds: { type: Number, default: 135 },
  timestampFormatted: { type: String, default: '02:15' },
  stepIndex: { type: String, default: '1/7' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  questionText: { type: String },
  options: [{ type: String }],
  correctOption: { type: String },
  type: { type: String, enum: ['Quiz', 'Survey', 'Checkpoint', 'Tour'], default: 'Checkpoint' }
}, { timestamps: true });

module.exports = mongoose.model('InVideoQuiz', inVideoQuizSchema, 'in_video_quizzes');
