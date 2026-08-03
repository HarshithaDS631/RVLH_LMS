const express = require('express');
const router = express.Router();
const { leaderboard } = require('../data/store');
const { protect } = require('../middleware/auth');

router.get('/', protect, (req, res) => {
  res.json(leaderboard);
});

module.exports = router;
