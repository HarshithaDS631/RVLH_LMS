const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  badgeId: { type: String, required: true },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  category: { type: String, enum: ['Academic', 'Streak', 'Quiz', 'Community'], default: 'Academic' },
  description: { type: String, required: true },
  isUnlocked: { type: Boolean, default: false },
  unlockedAt: { type: String },
  progressPct: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);
