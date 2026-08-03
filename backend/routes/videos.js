const express = require('express');
const router = express.Router();
const { videos, genId } = require('../data/store');
const { protect } = require('../middleware/auth');

router.get('/', protect, (req, res) => {
  res.json(videos);
});

router.post('/', protect, (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const { title, sub, dur, thumb } = req.body;
  const newVideo = {
    _id: genId(),
    thumb: thumb || '🎥',
    title,
    sub,
    batch: req.body.batch || 'General',
    dur: dur || '30:00',
    fac: req.user.name,
    col: '#ff6b35',
    views: 0,
    bookmarked: false,
    trending: false
  };
  videos.push(newVideo);
  res.status(201).json(newVideo);
});

router.put('/:id/bookmark', protect, (req, res) => {
  const video = videos.find(v => v._id === req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });
  video.bookmarked = !video.bookmarked;
  res.json(video);
});

router.put('/:id', protect, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'faculty') return res.status(403).json({ message: 'Unauthorized' });
  const video = videos.find(v => v._id === req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });
  const { title, sub, dur, batch } = req.body;
  if (title !== undefined) video.title = title;
  if (sub !== undefined) video.sub = sub;
  if (dur !== undefined) video.dur = dur;
  if (batch !== undefined) video.batch = batch;
  res.json(video);
});

router.delete('/:id', protect, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'faculty') return res.status(403).json({ message: 'Unauthorized' });
  const idx = videos.findIndex(v => v._id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Video not found' });
  videos.splice(idx, 1);
  res.json({ message: 'Video deleted' });
});

module.exports = router;
