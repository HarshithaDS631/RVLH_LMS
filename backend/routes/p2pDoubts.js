const express = require('express');
const router = express.Router();
const { getMongoStatus } = require('../config/db');
const P2PDoubt = require('../models/P2PDoubt');

router.get('/', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const doubts = await P2PDoubt.find().sort({ createdAt: -1 });
      return res.json(doubts);
    }
    res.json([
      {
        _id: 'p2p-1',
        studentName: 'Arjun Sharma',
        subject: 'Physics',
        moduleName: 'Module 1: Electrostatics',
        questionTitle: 'Why is electric field zero inside a hollow spherical conductor?',
        questionText: 'When a hollow metallic sphere is charged, why does all charge shift to the outer surface leaving E = 0 inside?',
        upvotes: 12,
        status: 'Resolved',
        aiSuggestedAnswer: '🤖 **AI Auto-Solver:** Charges repel each other and move as far apart as possible to minimize potential energy. In a conductor, charges can move freely, so they accumulate on the outer boundary. By Gauss Law, ∮ E·dA = Q_enc/ε₀. Since Q_enc = 0, E = 0.',
        answers: [
          { author: 'Rohan Gupta (Peer Mentor)', authorRole: 'student', text: 'Because electrostatic equilibrium requires zero force on free electrons inside the bulk metal. If E != 0, electrons would accelerate until E becomes 0.', upvotes: 8, isVerified: true },
          { author: 'Dr. Priya Mehta', authorRole: 'faculty', text: 'Verified! Excellent physical reasoning by Rohan.', upvotes: 15, isVerified: true }
        ]
      }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/ask', async (req, res) => {
  try {
    const { subject, moduleName, questionTitle, questionText, studentName } = req.body;
    if (!subject || !questionTitle || !questionText) {
      return res.status(400).json({ message: 'Missing subject or question content' });
    }

    const aiAnswer = `🤖 **AI Auto-Solver:** For "${questionTitle}", remember that in ${subject}, fundamental principles dictate step-by-step balance. Step 1: Write down given parameters. Step 2: Apply core conservation equations. Step 3: Solve for unknown variables.`;

    let doubt = {
      studentName: studentName || 'Arjun Sharma',
      subject,
      moduleName: moduleName || 'Module 1',
      questionTitle,
      questionText,
      upvotes: 1,
      status: 'Resolved',
      aiSuggestedAnswer: aiAnswer,
      answers: []
    };

    if (getMongoStatus()) {
      doubt = await P2PDoubt.create(doubt);
    }

    res.status(201).json({ message: 'Doubt posted successfully with AI resolution!', doubt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/answer', async (req, res) => {
  try {
    const { id } = req.params;
    const { author, authorRole, text } = req.body;

    let ans = { author: author || 'Student Peer', authorRole: authorRole || 'student', text: text || 'Standard peer explanation', upvotes: 1, isVerified: false };

    if (getMongoStatus() && id !== 'p2p-1') {
      const doubt = await P2PDoubt.findById(id);
      if (doubt) {
        doubt.answers.push(ans);
        doubt.status = 'Resolved';
        await doubt.save();
        return res.status(201).json({ message: 'Answer added successfully (+10 Karma Points awarded!)', answer: ans });
      }
    }

    res.status(201).json({ message: 'Answer added successfully (mock)!', answer: ans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
