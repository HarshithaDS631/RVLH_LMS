const express = require('express');
const router = express.Router();
const { materials, genId } = require('../data/store');
const { protect } = require('../middleware/auth');

router.get('/', protect, (req, res) => {
  res.json(materials);
});

router.post('/', protect, (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const { name, type, sub } = req.body;
  const newMat = {
    _id: genId(),
    name,
    type: type || 'pdf',
    sub,
    fac: req.user.name,
    size: '1.5 MB',
    date: 'Just now'
  };
  materials.unshift(newMat);
  res.status(201).json(newMat);
});

router.put('/:id', protect, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'faculty') return res.status(403).json({ message: 'Unauthorized' });
  const material = materials.find(m => m._id === req.params.id);
  if (!material) return res.status(404).json({ message: 'Material not found' });
  const { title, name, type, sub, size, batch } = req.body;
  if (name !== undefined) material.name = name;
  else if (title !== undefined) material.name = title;
  if (type !== undefined) material.type = type;
  if (sub !== undefined) material.sub = sub;
  if (size !== undefined) material.size = size;
  if (batch !== undefined) material.batch = batch;
  res.json(material);
});

router.delete('/:id', protect, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'faculty') return res.status(403).json({ message: 'Unauthorized' });
  const idx = materials.findIndex(m => m._id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Material not found' });
  materials.splice(idx, 1);
  res.json({ message: 'Material deleted' });
});

module.exports = router;
