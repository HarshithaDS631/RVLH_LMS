const express = require('express');
const router = express.Router();
const { getMongoStatus } = require('../config/db');
const InVideoQuiz = require('../models/InVideoQuiz');

router.get('/', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const quizzes = await InVideoQuiz.find().sort({ timestampSeconds: 1 });
      return res.json(quizzes);
    }
    res.json([
      {
        videoTitle: 'Electrostatics & Gauss Law',
        timestampSeconds: 135,
        timestampFormatted: '02:15',
        stepIndex: '1/7',
        title: 'Course overview',
        description: 'Switch between courses & get course information with progress',
        questionText: 'In-Video Checkpoint (1/7): Does electric flux depend on Gaussian sphere radius?',
        options: ['A) Yes, directly proportional', 'B) No, depends only on enclosed charge', 'C) Inversely proportional'],
        correctOption: 'B) No, depends only on enclosed charge',
        type: 'Checkpoint'
      },
      {
        videoTitle: 'Electrostatics & Gauss Law',
        timestampSeconds: 330,
        timestampFormatted: '05:30',
        stepIndex: '2/7',
        title: 'Module overview',
        description: 'See the list of all modules with due date & progress statuses like completed, pending, etc.',
        questionText: 'In-Video Checkpoint (2/7): What is electric field inside a charged hollow conductor?',
        options: ['A) Zero', 'B) kQ/r^2', 'C) Infinite'],
        correctOption: 'A) Zero',
        type: 'Checkpoint'
      }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/submit', (req, res) => {
  const { questionId, selectedOption, correctOption } = req.body;
  const isCorrect = selectedOption === correctOption;
  res.json({
    isCorrect,
    feedback: isCorrect ? '🎉 Correct! Video resuming...' : `❌ Incorrect! Correct answer was: ${correctOption}. Video resuming in 3s.`
  });
});

module.exports = router;
