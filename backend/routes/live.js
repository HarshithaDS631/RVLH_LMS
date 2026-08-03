const express = require('express');
const router = express.Router();
const { liveClasses, genId } = require('../data/store');
const { protect } = require('../middleware/auth');
const { getMongoStatus } = require('../config/db');
const LiveClass = require('../models/LiveClass');

router.get('/', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const classes = await LiveClass.find().sort({ createdAt: -1 });
      return res.json(classes);
    }
    res.json(liveClasses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const { topic, sub, time, date } = req.body;
  const newLive = {
    _id: genId(),
    time: time || '12:00 PM',
    date: date || 'Today',
    sub: sub || req.user.subject || 'General',
    topic,
    fac: req.user.name,
    online: 0,
    status: 'upcoming'
  };
  liveClasses.push(newLive);
  res.status(201).json(newLive);
});

router.post('/:id/heartbeat', async (req, res) => {
  try {
    const { id } = req.params;
    if (getMongoStatus() && id !== 'live1' && id !== 'live2') {
      const cls = await LiveClass.findById(id);
      if (cls) {
        cls.onlineViewers = (cls.onlineViewers || 0) + 1;
        await cls.save();
        return res.json({ message: 'Heartbeat recorded', onlineViewers: cls.onlineViewers });
      }
    }
    res.json({ message: 'Heartbeat recorded (mock)', onlineViewers: 145 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/chat', async (req, res) => {
  try {
    const { id } = req.params;
    const { sender, role, text } = req.body;

    const msg = {
      sender: sender || 'Student',
      role: role || 'student',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (getMongoStatus() && id !== 'live1' && id !== 'live2') {
      const cls = await LiveClass.findById(id);
      if (cls) {
        cls.chatMessages.push(msg);
        await cls.save();
        return res.status(201).json({ message: 'Chat message sent', data: msg });
      }
    }

    res.status(201).json({ message: 'Chat message sent (mock)', data: msg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
