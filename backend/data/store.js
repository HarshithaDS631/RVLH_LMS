// Central In-Memory Store & Data References
let nextId = 1;
const genId = () => String(nextId++);

const users = [];
const courses = [];
const videos = [];
const liveClasses = [];
const doubts = [];
const materials = [];
const announcements = [];
const fees = [];
const attendance = [];
const leaderboard = [];
const quizResults = [];
const payments = [];

module.exports = {
  genId,
  users,
  courses,
  videos,
  liveClasses,
  doubts,
  materials,
  announcements,
  fees,
  attendance,
  leaderboard,
  quizResults,
  payments
};
