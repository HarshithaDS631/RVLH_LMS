const express = require('express');
const router = express.Router();
const { genId } = require('../data/store');
const { getMongoStatus } = require('../config/db');
const LeaveRequest = require('../models/LeaveRequest');
const SiblingAdmission = require('../models/SiblingAdmission');
const MarksCard = require('../models/MarksCard');
const CalendarEvent = require('../models/CalendarEvent');
const MessageLog = require('../models/MessageLog');

// Leaves
router.get('/leaves', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const leaves = await LeaveRequest.find().sort({ createdAt: -1 });
      return res.json(leaves);
    }
    res.json([
      { _id: 'l1', studentName: 'Arjun Sharma', parentName: 'Suresh Sharma', startDate: '2026-03-20', endDate: '2026-03-22', reason: 'Family Medical Emergency', status: 'Approved' }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/leaves', async (req, res) => {
  try {
    const { studentId, studentName, parentName, startDate, endDate, reason } = req.body;
    if (getMongoStatus()) {
      const newLeave = await LeaveRequest.create({
        studentId: studentId || 's1',
        studentName: studentName || 'Arjun Sharma',
        parentName: parentName || 'Suresh Sharma',
        startDate,
        endDate,
        reason,
        status: 'Pending'
      });
      return res.status(201).json(newLeave);
    }
    res.status(201).json({ _id: genId(), studentName, parentName, startDate, endDate, reason, status: 'Pending' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sibling Admissions
router.get('/sibling-admissions', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const apps = await SiblingAdmission.find().sort({ createdAt: -1 });
      return res.json(apps);
    }
    res.json([
      { _id: 'sib1', parentName: 'Suresh Sharma', siblingName: 'Rohan Sharma', gradeApplying: 'Grade 9 - Foundation Batch', status: 'Document Verification', applicationNo: 'SIB-2026-008' }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/sibling-admissions', async (req, res) => {
  try {
    const { parentName, parentEmail, parentPhone, siblingName, dob, gradeApplying, previousSchool } = req.body;
    const applicationNo = 'SIB-2026-' + String(Math.floor(100 + Math.random() * 900));
    if (getMongoStatus()) {
      const appRecord = await SiblingAdmission.create({
        parentName,
        parentEmail,
        parentPhone,
        siblingName,
        dob,
        gradeApplying,
        previousSchool,
        status: 'Form Submitted',
        applicationNo
      });
      return res.status(201).json(appRecord);
    }
    res.status(201).json({ _id: genId(), siblingName, gradeApplying, status: 'Form Submitted', applicationNo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Marks Cards
router.get('/marks-cards', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const cards = await MarksCard.find();
      return res.json(cards);
    }
    res.json([
      {
        studentName: 'Arjun Sharma',
        roll: 'RV2024001',
        term: 'Mid-Term Examination 2024-25',
        subjects: [
          { name: 'Physics', marksObtained: 92, maxMarks: 100, grade: 'A+', teacherName: 'Dr. Priya Mehta', remark: 'Excellent understanding of Mechanics & Gauss Law.' },
          { name: 'Chemistry', marksObtained: 84, maxMarks: 100, grade: 'A', teacherName: 'Prof. Amit Singh', remark: 'Good performance in Organic Reactions.' },
          { name: 'Mathematics', marksObtained: 88, maxMarks: 100, grade: 'A+', teacherName: 'Mr. Raj Sharma', remark: 'Strong analytical skills in Calculus.' }
        ],
        totalObtained: 264,
        totalMax: 300,
        percentile: 96.8,
        classRank: '3rd in Batch',
        overallGrade: 'Distinction (A+)'
      }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Calendar Events
router.get('/calendar-events', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const events = await CalendarEvent.find().sort({ date: 1 });
      return res.json(events);
    }
    res.json([
      { title: 'JEE Advanced Full Mock Test 1', category: 'Exam', date: '2026-03-25', time: '09:00 AM - 12:00 PM', venue: 'Main Auditorium' },
      { title: 'Parent-Teacher Meeting (PTM 2025)', category: 'PTM', date: '2026-03-28', time: '10:00 AM - 02:00 PM', venue: 'RV Jayanagar Campus' },
      { title: 'Ugadi / Festivity Holiday', category: 'Holiday', date: '2026-03-30', time: 'All Day', venue: 'Holiday' }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Notify Parent
router.post('/notify-parent', async (req, res) => {
  try {
    const { studentName, parentPhone, channel, type, messageText } = req.body;
    if (!studentName || !parentPhone || !messageText) {
      return res.status(400).json({ message: 'Missing required notification details' });
    }
    let logRecord = { studentName, parentPhone, channel: channel || 'WhatsApp', type: type || 'Attendance', messageText, status: 'Sent' };
    if (getMongoStatus()) {
      logRecord = await MessageLog.create(logRecord);
    }
    res.status(201).json({ message: `${channel || 'WhatsApp'} message dispatched to parent!`, data: logRecord });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/notify-parent/logs', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const logs = await MessageLog.find().sort({ createdAt: -1 }).limit(50);
      return res.json(logs);
    }
    res.json([
      { studentName: 'Arjun Sharma', parentPhone: '9876500000', channel: 'WhatsApp', type: 'Attendance', messageText: 'Arjun Sharma marked PRESENT today.', status: 'Sent', createdAt: new Date() }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
