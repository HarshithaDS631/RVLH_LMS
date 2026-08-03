const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');
const { seedData } = require('./seed/seedData');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rv_lms';

app.use(cors());
app.use(express.json());

// Initialize Database & Seed Data
connectDB(MONGO_URI).then(() => {
  seedData();
});

// Import Route Modules
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const videosRoutes = require('./routes/videos');
const liveRoutes = require('./routes/live');
const doubtsRoutes = require('./routes/doubts');
const materialsRoutes = require('./routes/materials');
const announcementsRoutes = require('./routes/announcements');
const feesRoutes = require('./routes/fees');
const attendanceRoutes = require('./routes/attendance');
const leaderboardRoutes = require('./routes/leaderboard');
const adminRoutes = require('./routes/admin');
const parentRoutes = require('./routes/parent');
const badgesRoutes = require('./routes/badges');
const questionBankRoutes = require('./routes/questionBank');
const videoChatRoutes = require('./routes/videoChat');
const inVideoQuizRoutes = require('./routes/inVideoQuiz');
const analyticsRoutes = require('./routes/analytics');
const p2pDoubtsRoutes = require('./routes/p2pDoubts');
const saasRoutes = require('./routes/saas');
const inHouseRoutes = require('./routes/inHouse');

// Mount Route Modules
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/live', liveRoutes);
app.use('/api/doubts', doubtsRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api', adminRoutes);
app.use('/api', parentRoutes);
app.use('/api/badges', badgesRoutes);
app.use('/api/student-journey', (req, res) => res.redirect('/api/badges/student-journey'));
app.use('/api/question-bank', questionBankRoutes);
app.use('/api/video-chat', videoChatRoutes);
app.use('/api/in-video-quizzes', inVideoQuizRoutes);
app.use('/api/upgrad-analytics', analyticsRoutes);
app.use('/api/fee-automation', (req, res, next) => {
  req.url = '/automation' + req.url;
  feesRoutes(req, res, next);
});
app.use('/api/p2p-doubts', p2pDoubtsRoutes);
app.use('/api/saas', saasRoutes);
app.use('/api/in-house', inHouseRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.send('🎓 RV Learning Hub LMS API Server Running');
});

// Start Server if not imported by tests or Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🎓 LMS Server listening on port ${PORT}`);
  });
}

module.exports = app;
