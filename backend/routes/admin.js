const express = require('express');
const router = express.Router();
const { quizResults, payments, users, genId } = require('../data/store');
const { protect } = require('../middleware/auth');
const { getMongoStatus } = require('../config/db');
const AdminActivity = require('../models/AdminActivity');
const SuperAdminActivity = require('../models/SuperAdminActivity');
const UserActivity = require('../models/UserActivity');

// ROLE-SEPARATED ACTIVITY AUDIT LOG ENDPOINTS
router.get('/activities/admin', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const logs = await AdminActivity.find().sort({ createdAt: -1 }).limit(100);
      return res.json(logs);
    }
    res.json([
      { adminName: 'Rahul Verma', email: 'admin@rvhub.com', action: 'Course Created', targetType: 'Course', targetName: 'JEE Advanced', createdAt: new Date() }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/activities/superadmin', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const logs = await SuperAdminActivity.find().sort({ createdAt: -1 }).limit(100);
      return res.json(logs);
    }
    res.json([
      { superAdminName: 'SaaS Director', email: 'superadmin@saas.com', action: 'Tenant Onboarded', tenantName: 'RV Institutions', createdAt: new Date() }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/activities/users', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const logs = await UserActivity.find().sort({ createdAt: -1 }).limit(100);
      return res.json(logs);
    }
    res.json([
      { userName: 'Arjun Sharma', role: 'student', action: 'Video Lecture Watched', module: 'Video', createdAt: new Date() }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Quiz Results
router.get('/quiz-results', protect, (req, res) => {
  res.json(quizResults);
});

router.post('/quiz-results', protect, (req, res) => {
  const { student, roll, course, subject, video, score, total, date } = req.body;
  const newQ = {
    _id: genId(),
    student: student || req.user.name,
    roll: roll || req.user.roll || 'RV2024001',
    course: course || req.user.batch || 'JEE Advanced (Main + KCET Decoded)',
    subject,
    video,
    score: Number(score),
    total: Number(total || 100),
    date: date || 'Just now'
  };
  quizResults.unshift(newQ);
  res.status(201).json(newQ);
});

// Payments
router.get('/payments', protect, (req, res) => {
  res.json(payments);
});

router.post('/payments', protect, (req, res) => {
  const { roll, amount, method, type, date, item, notes } = req.body;
  
  const student = users.find(u => u.roll === roll && u.role === 'student');
  if (student) {
    const payAmt = Number(amount);
    student.feePaid = (student.feePaid || 0) + payAmt;
    student.feePending = Math.max(0, (student.feeAmount || 45000) - student.feePaid);
    student.feeStatus = student.feePending === 0 ? 'Paid' : 'Due';
    student.feeMethod = method;
    student.feeDate = date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const newP = {
    _id: genId(),
    id: 'TXN' + String(payments.length + 1).padStart(3, '0'),
    student: student ? student.name : 'Unknown Student',
    material: item || 'LMS Materials',
    amount: Number(amount),
    date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    method,
    status: 'success',
    type: type || 'course',
    notes
  };

  payments.unshift(newP);
  res.status(201).json(newP);
});

module.exports = router;
