const mongoose = require('mongoose');

const upGradFeatureSchema = new mongoose.Schema({
  studentId: { type: String, default: 's1' },
  studentName: { type: String, default: 'Arjun Sharma' },
  studentProgressPct: { type: Number, default: 15.8 },
  batchAvgProgressPct: { type: Number, default: 8.2 },
  dailyGoalMins: { type: Number, default: 30 },
  dailyGoalCompletedMins: { type: Number, default: 0 },
  moduleProgressPct: { type: Number, default: 41.9 },
  timeRemainingFormatted: { type: String, default: '7h 5m left' }
}, { timestamps: true });

module.exports = mongoose.model('UpGradFeature', upGradFeatureSchema, 'upgrad_features');
