const express = require('express');
const router = express.Router();
const { getMongoStatus } = require('../config/db');
const Badge = require('../models/Badge');

router.get('/', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const badges = await Badge.find();
      return res.json(badges);
    }
    res.json([
      { title: '7-Day Streak Master', icon: '🔥', category: 'Streak', description: 'Maintained 7-day study streak.', isUnlocked: true, unlockedAt: 'Mar 10, 2026', progressPct: 100 },
      { title: 'Speed Quizzer', icon: '⚡', category: 'Quiz', description: 'Scored 85%+ in Physics Electrostatics.', isUnlocked: true, unlockedAt: 'Mar 12, 2026', progressPct: 100 },
      { title: 'Top 5 Ranker', icon: '🏆', category: 'Academic', description: 'Ranked #3 in Batch A.', isUnlocked: true, unlockedAt: 'Mar 15, 2026', progressPct: 100 }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/student-journey', (req, res) => {
  res.json({
    phases: [
      { phase: 1, title: 'Onboarding & Orientation', icon: '🎓', status: 'Completed', date: 'Jan 10, 2026', desc: 'Enrolled in JEE Advanced Batch A, campus orientation completed.' },
      { phase: 2, title: 'Core Concepts & Video Lectures', icon: '⚡', status: 'Completed', date: 'Feb 15, 2026', desc: 'Watched 10+ core video lectures and completed first 5 DPPs.' },
      { phase: 3, title: 'Mid-Term Exam & Batch Rank', icon: '🧪', status: 'Active', date: 'Mar 15, 2026', desc: 'Scored 264/300 (A+ Distinction) and achieved 3rd Rank in Batch.' },
      { phase: 4, title: 'Mock Test Series & Doubt Mastery', icon: '🚀', status: 'In Progress', date: 'Apr 2026', desc: 'Targeting 5 full-syllabus mock tests and doubt resolution.' },
      { phase: 5, title: 'Final Entrance Exam & Certification', icon: '🏆', status: 'Upcoming', date: 'May 2026', desc: 'Graduation readiness and final hall ticket issuance.' }
    ]
  });
});

module.exports = router;
