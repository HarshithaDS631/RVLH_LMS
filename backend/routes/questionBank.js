const express = require('express');
const router = express.Router();
const { getMongoStatus } = require('../config/db');
const QuestionBank = require('../models/QuestionBank');

router.get('/', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const qList = await QuestionBank.find().sort({ createdAt: -1 });
      return res.json(qList);
    }
    res.json([
      {
        subject: 'Physics',
        moduleName: 'Module 1: Electrostatics & Gauss Law',
        questionText: 'Electric flux through a closed Gaussian surface enclosing a dipole of charges +q and -q is:',
        options: ['Zero', 'q / epsilon_0', '2q / epsilon_0', 'Infinity'],
        correctOption: 'Zero',
        difficulty: 'Easy',
        type: 'MCQ',
        solutionExplanation: 'Net charge enclosed by the Gaussian surface is (+q) + (-q) = 0. By Gauss Law, total electric flux = Q_enclosed / epsilon_0 = 0.',
        createdBy: 'Dr. Priya Mehta'
      }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const { subject, moduleName, questionCount, difficulty } = req.body;
    const count = Number(questionCount) || 5;

    const sampleQs = [
      {
        questionText: `Generated MCQ: What is the primary law governing ${subject} in ${moduleName || 'Module 1'}?`,
        options: ['A) Fundamental Conservation Law', 'B) Secondary Dynamic Equilibrium', 'C) Thermal Static Formula', 'D) Relativistic Shift'],
        correctOption: 'A) Fundamental Conservation Law',
        difficulty: difficulty || 'Medium',
        type: 'MCQ',
        solutionExplanation: `Standard derivation step for ${subject} ${moduleName || 'Module 1'}. Conservation principles dictate total energy and momentum remain invariant.`
      },
      {
        questionText: `Generated MCQ: Calculate the net rate of change for ${subject} under standard temperature and pressure.`,
        options: ['A) Zero rate of change', 'B) Exponential growth factor k=1.414', 'C) Linear decay to equilibrium', 'D) Periodic oscillation'],
        correctOption: 'A) Zero rate of change',
        difficulty: difficulty || 'Medium',
        type: 'MCQ',
        solutionExplanation: 'System is at equilibrium; therefore the net rate of change is zero.'
      }
    ];

    const generated = [];
    for (let i = 0; i < count; i++) {
      const template = sampleQs[i % sampleQs.length];
      const qObj = {
        subject: subject || 'Physics',
        moduleName: moduleName || 'Module 1',
        questionText: `Q${i + 1}: ${template.questionText}`,
        options: template.options,
        correctOption: template.correctOption,
        difficulty: difficulty || 'Medium',
        type: 'MCQ',
        solutionExplanation: template.solutionExplanation,
        createdBy: 'AI Question Generator'
      };
      if (getMongoStatus()) {
        const doc = await QuestionBank.create(qObj);
        generated.push(doc);
      } else {
        generated.push({ _id: 'gen-' + Date.now() + '-' + i, ...qObj });
      }
    }

    res.status(201).json({ message: `Successfully generated ${count} AI questions!`, questions: generated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { subject, moduleName, questionText, options, correctOption, difficulty, solutionExplanation, createdBy } = req.body;
    let qDoc = {
      subject: subject || 'Physics',
      moduleName: moduleName || 'General Module',
      questionText,
      options: options || ['A', 'B', 'C', 'D'],
      correctOption: correctOption || options[0],
      difficulty: difficulty || 'Medium',
      type: 'MCQ',
      solutionExplanation: solutionExplanation || 'Standard solution.',
      createdBy: createdBy || 'Faculty User'
    };
    if (getMongoStatus()) {
      qDoc = await QuestionBank.create(qDoc);
    }
    res.status(201).json({ message: 'Question added to bank!', question: qDoc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
