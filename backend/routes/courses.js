const express = require('express');
const router = express.Router();
const { courses, genId } = require('../data/store');
const { protect } = require('../middleware/auth');

router.get('/', protect, (req, res) => {
  res.json(courses);
});

router.post('/', protect, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  const { title, e, desc, fac, total, fee, cat, dur, subjects, curriculum } = req.body;
  const newCourse = {
    _id: genId(),
    e: e || '📚',
    title,
    desc: desc || '',
    videos: req.body.videos || 10,
    materials: req.body.materials || 8,
    quizzes: req.body.quizzes || 5,
    enrolled: false,
    col: 'linear-gradient(90deg,#6c47ff,#a855f7)',
    p: 0,
    done: 0,
    total: total || 150,
    maxSt: total || 150,
    fac: fac || 'Dr. Priya Mehta',
    fee: fee !== undefined ? Number(fee) : 30000,
    cat: cat || 'JEE',
    dur: dur || '1 Year',
    subjects: subjects || ['Physics', 'Chemistry', 'Mathematics'],
    curriculum: curriculum || 'Standard curriculum',
    rating: 5.0,
    reviews: 1,
    pub: true
  };
  courses.push(newCourse);
  res.status(201).json(newCourse);
});

router.post('/:id/enroll', protect, (req, res) => {
  const course = courses.find(c => c._id === req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  course.enrolled = true;
  res.json(course);
});

router.put('/:id', protect, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const course = courses.find(c => c._id === req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  if (req.body.title !== undefined) course.title = req.body.title;
  if (req.body.desc !== undefined) course.desc = req.body.desc;
  if (req.body.dur !== undefined) course.dur = req.body.dur;
  if (req.body.fee !== undefined) course.fee = Number(req.body.fee);
  if (req.body.maxSt !== undefined) course.maxSt = Number(req.body.maxSt);
  if (req.body.fac !== undefined) course.fac = req.body.fac;
  if (req.body.subjects !== undefined) course.subjects = req.body.subjects;
  if (req.body.curriculum !== undefined) course.curriculum = req.body.curriculum;
  if (req.body.pub !== undefined) course.pub = req.body.pub;
  if (req.body.e !== undefined) course.e = req.body.e;

  res.json(course);
});

router.put('/:id/status', protect, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const course = courses.find(c => c._id === req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  course.pub = !course.pub;
  res.json(course);
});

router.delete('/:id', protect, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const idx = courses.findIndex(c => c._id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Course not found' });
  courses.splice(idx, 1);
  res.json({ message: 'Course deleted successfully' });
});

module.exports = router;
