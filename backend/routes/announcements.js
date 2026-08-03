const express = require('express');
const router = express.Router();
const { announcements, genId } = require('../data/store');
const { protect } = require('../middleware/auth');

router.get('/', protect, (req, res) => {
  res.json(announcements);
});

router.post('/', protect, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  const { title, body, cat, urgent, target, draft } = req.body;
  const newAnn = {
    _id: genId(),
    title,
    body,
    cat: cat || 'Notice',
    date: 'Just now',
    urgent: !!urgent,
    target: target || 'all',
    draft: !!draft
  };
  announcements.unshift(newAnn);
  res.status(201).json(newAnn);
});

router.put('/:id', protect, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  const ann = announcements.find(a => a._id === req.params.id);
  if (!ann) return res.status(404).json({ message: 'Announcement not found' });
  
  const { title, body, cat, urgent, target, draft } = req.body;
  if (title !== undefined) ann.title = title;
  if (body !== undefined) ann.body = body;
  if (cat !== undefined) ann.cat = cat;
  if (urgent !== undefined) ann.urgent = !!urgent;
  if (target !== undefined) ann.target = target;
  if (draft !== undefined) ann.draft = !!draft;
  
  res.json(ann);
});

module.exports = router;
