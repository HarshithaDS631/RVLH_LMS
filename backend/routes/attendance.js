const express = require('express');
const router = express.Router();
const { attendance, genId } = require('../data/store');
const { protect } = require('../middleware/auth');

router.get('/', protect, (req, res) => {
  res.json(attendance);
});

router.post('/', protect, (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const { date, status, sub, topic } = req.body;
  const newAtt = {
    _id: genId(),
    date: date || '2026-06-24',
    status: status || 'Present',
    sub: sub || 'Physics',
    topic: topic || 'General'
  };
  attendance.unshift(newAtt);
  res.status(201).json(newAtt);
});

module.exports = router;
