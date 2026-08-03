const express = require('express');
const router = express.Router();
const { getMongoStatus } = require('../config/db');
const UpGradFeature = require('../models/UpGradFeature');

router.get('/', async (req, res) => {
  try {
    if (getMongoStatus()) {
      let data = await UpGradFeature.findOne({ studentId: 's1' });
      if (!data) {
        data = await UpGradFeature.create({
          studentId: 's1', studentName: 'Arjun Sharma', studentProgressPct: 15.8, batchAvgProgressPct: 8.2, dailyGoalMins: 30, dailyGoalCompletedMins: 12, moduleProgressPct: 41.9, timeRemainingFormatted: '7h 5m left'
        });
      }
      return res.json(data);
    }
    res.json({
      studentId: 's1',
      studentName: 'Arjun Sharma',
      studentProgressPct: 15.8,
      batchAvgProgressPct: 8.2,
      dailyGoalMins: 30,
      dailyGoalCompletedMins: 12,
      moduleProgressPct: 41.9,
      timeRemainingFormatted: '7h 5m left'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/log-time', async (req, res) => {
  try {
    const { minutes } = req.body;
    const added = Number(minutes) || 5;

    if (getMongoStatus()) {
      let data = await UpGradFeature.findOne({ studentId: 's1' });
      if (data) {
        data.dailyGoalCompletedMins = (data.dailyGoalCompletedMins || 0) + added;
        await data.save();
        return res.json({ message: `Logged ${added} mins of learning!`, data });
      }
    }
    res.json({ message: `Logged ${added} mins of learning (mock)!`, dailyGoalCompletedMins: 17 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
