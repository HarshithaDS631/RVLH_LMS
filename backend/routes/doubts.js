const express = require('express');
const router = express.Router();
const { doubts, genId } = require('../data/store');
const { protect } = require('../middleware/auth');

router.get('/', protect, (req, res) => {
  res.json(doubts);
});

router.post('/', protect, (req, res) => {
  const { q, sub } = req.body;
  const newDoubt = {
    _id: genId(),
    q,
    s: 'pending',
    t: 'Just now',
    sub: sub || 'General',
    student: req.user.name,
    replies: [
      { sender: req.user.name, text: q, time: 'Just now' }
    ],
    ai: false
  };
  doubts.unshift(newDoubt);
  res.status(201).json(newDoubt);
});

router.post('/:id/reply', protect, (req, res) => {
  const doubt = doubts.find(d => d._id === req.params.id);
  if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
  
  const reply = {
    sender: req.user.name,
    text: req.body.text,
    time: 'Just now'
  };
  doubt.replies.push(reply);
  
  if (req.user.role === 'faculty') {
    doubt.s = 'resolved';
  }
  
  res.status(201).json(doubt);
});

router.put('/:id/resolve', protect, (req, res) => {
  const doubt = doubts.find(d => d._id === req.params.id);
  if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
  doubt.s = 'resolved';
  res.json(doubt);
});

module.exports = router;
