const express = require('express');
const router = express.Router();
const { getMongoStatus } = require('../config/db');
const VideoChatLog = require('../models/VideoChatLog');

router.post('/', async (req, res) => {
  try {
    const { videoTitle, userQuery, studentName, subject } = req.body;
    if (!userQuery) return res.status(400).json({ message: 'Query cannot be empty' });

    let timestampMark = '08:30';
    let aiResponse = `🤖 **AI Video Assistant:** In "${videoTitle || 'this lecture'}", around timestamp [⏱️ ${timestampMark}], the faculty explains "${userQuery}". Key takeaway: core conservation principles apply directly to this problem step-by-step.`;

    if (userQuery.toLowerCase().includes('gauss') || userQuery.toLowerCase().includes('flux')) {
      timestampMark = '12:45';
      aiResponse = `🤖 **AI Video Assistant:** At [⏱️ 12:45], Dr. Priya Mehta derives Gauss Law for a spherical shell. Electric flux = Q_enclosed / ε₀. Inside a hollow conductor, Q_enclosed = 0, hence E = 0.`;
    } else if (userQuery.toLowerCase().includes('sn1') || userQuery.toLowerCase().includes('sn2')) {
      timestampMark = '18:20';
      aiResponse = `🤖 **AI Video Assistant:** At [⏱️ 18:20], Prof. Amit Singh contrasts SN1 (two steps via carbocation intermediate) vs SN2 (single-step backside attack with Walden inversion).`;
    }

    let chatLog = {
      videoTitle: videoTitle || 'Electrostatics & Gauss Law',
      studentName: studentName || 'Arjun Sharma',
      userQuery,
      aiResponse,
      timestampMark,
      subject: subject || 'Physics'
    };

    if (getMongoStatus()) {
      chatLog = await VideoChatLog.create(chatLog);
    }

    res.status(201).json({ message: 'Query answered by AI Assistant', data: chatLog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const logs = await VideoChatLog.find().sort({ createdAt: -1 }).limit(20);
      return res.json(logs);
    }
    res.json([
      {
        videoTitle: 'Electrostatics & Gauss Law',
        studentName: 'Arjun Sharma',
        userQuery: 'Summarize Gauss Law proof for spherical shell',
        aiResponse: '🤖 **AI Video Assistant:** At [⏱️ 12:45], Dr. Priya Mehta proves Gauss Law for a conducting spherical shell of radius R. Since all charge resides on the outer surface, enclosed charge Q_enc = 0 for r < R. Therefore, the electric field E = 0 inside the shell.',
        timestampMark: '12:45',
        subject: 'Physics'
      }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
