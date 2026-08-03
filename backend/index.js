const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_lms_key_123';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rv_lms';


app.use(cors());
app.use(express.json());

// ═══════════════════════════════════════════════════
// MONGOOSE MODELS & DATABASE CONNECTION
// ═══════════════════════════════════════════════════
const User = require('./models/User');
const Course = require('./models/Course');
const Video = require('./models/Video');
const Doubt = require('./models/Doubt');
const Material = require('./models/Material');
const Announcement = require('./models/Announcement');
const Payment = require('./models/Payment');
const AdminActivity = require('./models/AdminActivity');
const SuperAdminActivity = require('./models/SuperAdminActivity');
const UserActivity = require('./models/UserActivity');
const LeaveRequest = require('./models/LeaveRequest');
const SiblingAdmission = require('./models/SiblingAdmission');
const MarksCard = require('./models/MarksCard');
const CalendarEvent = require('./models/CalendarEvent');
const MessageLog = require('./models/MessageLog');
const Badge = require('./models/Badge');
const LiveClass = require('./models/LiveClass');
const QuestionBank = require('./models/QuestionBank');
const VideoChatLog = require('./models/VideoChatLog');
const InVideoQuiz = require('./models/InVideoQuiz');
const UpGradFeature = require('./models/UpGradFeature');
const FeeAutomation = require('./models/FeeAutomation');
const P2PDoubt = require('./models/P2PDoubt');
const SaaSTenant = require('./models/SaaSTenant');
const SelfHostedConfig = require('./models/SelfHostedConfig');













let isMongoConnected = false;

mongoose.connect(MONGO_URI)
  .then(() => {
    isMongoConnected = true;
    console.log('🍃 Connected to MongoDB successfully at:', MONGO_URI);
  })
  .catch((err) => {
    isMongoConnected = false;
    console.warn('⚠️ MongoDB connection error (using in-memory fallback):', err.message);
  });

// Central Log Activity Dispatcher Helper
async function logActivity(user, action, opts = {}) {
  if (!user) return;
  try {
    if (user.role === 'superadmin') {
      await SuperAdminActivity.create({
        superAdminId: user._id || 'sa_1',
        superAdminName: user.name || 'SaaS Director',
        email: user.email,
        action: action,
        tenantId: opts.tenantId,
        tenantName: opts.tenantName,
        details: opts.details || action
      });
    } else if (user.role === 'admin') {
      await AdminActivity.create({
        adminId: user._id || 'a_1',
        adminName: user.name || 'System Admin',
        email: user.email,
        action: action,
        targetType: opts.targetType || 'System',
        targetName: opts.targetName || 'LMS Platform',
        details: opts.details || action
      });
    } else {
      await UserActivity.create({
        userId: user._id || 'u_1',
        userName: user.name || 'User',
        email: user.email,
        role: user.role || 'student',
        action: action,
        module: opts.module || 'LMS',
        details: opts.details || action
      });
    }
  } catch (err) {
    console.error('Error recording activity log:', err.message);
  }
}


// ═══════════════════════════════════════════════════
// IN-MEMORY DATA STORE (replaces MongoDB if offline)
// ═══════════════════════════════════════════════════
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

// Seed Data helper
async function seedData() {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('student123', salt);
  const facHash = await bcrypt.hash('faculty123', salt);
  const admHash = await bcrypt.hash('admin123', salt);


  // 1. Seed Users
  const studentSeeds = [
    { name: 'Arjun Sharma', email: 'arjun@rvhub.com', phone: '9876543210', batch: 'JEE Advanced (Main + KCET Decoded)', roll: 'RV2024001', streak: 7, avgScore: 85, feeStatus: 'Paid', feeAmount: 45000, feePaid: 22500, feePending: 22500, feeDueDate: 'Mar 31', feeMethod: '—', feeDate: '—', campus: 'RV Jayanagar', gender: 'Male' },
    { name: 'Sneha Patel', email: 'sneha.patel@student.rvhub.com', phone: '9800100002', batch: 'JEE Advanced (Main + KCET Decoded)', roll: 'RV2024002', streak: 1, avgScore: 88, feeStatus: 'Paid', feeAmount: 45000, feePaid: 45000, feePending: 0, feeDueDate: 'Mar 1', feeMethod: 'UPI', feeDate: 'Mar 12', campus: 'RV Rajajinagar', gender: 'Female' },
    { name: 'Rohan Gupta', email: 'rohan.gupta@student.rvhub.com', phone: '9800100003', batch: 'JEE (Main + KCET Decoded)', roll: 'RV2024003', streak: 2, avgScore: 68, feeStatus: 'Due', feeAmount: 30000, feePaid: 15000, feePending: 15000, feeDueDate: 'Mar 20', feeMethod: '—', feeDate: '—', campus: 'RV Jayanagar', gender: 'Male' },
    { name: 'Kavya Reddy', email: 'kavya.reddy@student.rvhub.com', phone: '9800100015', batch: 'NEET UG Decoded', roll: 'RV2024015', streak: 5, avgScore: 88, feeStatus: 'Paid', feeAmount: 38000, feePaid: 38000, feePending: 0, feeDueDate: 'Mar 1', feeMethod: 'Card', feeDate: 'Mar 12', campus: 'RV Electronic City', gender: 'Female' },
    { name: 'Dev Verma', email: 'dev.verma@student.rvhub.com', phone: '9800100020', batch: 'Commerce Decoded Programme', roll: 'RV2024020', streak: 0, avgScore: 58, feeStatus: 'Overdue', feeAmount: 28000, feePaid: 0, feePending: 28000, feeDueDate: 'Mar 1', feeMethod: '—', feeDate: '—', campus: 'RV Rajajinagar', gender: 'Male' },
    { name: 'Ravi Kumar', email: 'ravi.kumar@student.rvhub.com', phone: '9800100012', batch: 'NEET UG Decoded', roll: 'RV2024012', streak: 3, avgScore: 70, feeStatus: 'Overdue', feeAmount: 38000, feePaid: 19000, feePending: 19000, feeDueDate: 'Mar 15', feeMethod: '—', feeDate: '—', campus: 'RV Electronic City', gender: 'Male' },
    { name: 'Meera Shah', email: 'meera.shah@student.rvhub.com', phone: '9800100008', batch: 'JEE Advanced (Main + KCET Decoded)', roll: 'RV2024008', streak: 4, avgScore: 78, feeStatus: 'Overdue', feeAmount: 45000, feePaid: 30000, feePending: 15000, feeDueDate: 'Mar 10', feeMethod: '—', feeDate: '—', campus: 'RV Rajajinagar', gender: 'Female' },
    { name: 'Aman Joshi', email: 'aman.joshi@student.rvhub.com', phone: '9800100010', batch: 'Commerce Decoded Programme', roll: 'RV2024010', streak: 1, avgScore: 75, feeStatus: 'Paid', feeAmount: 28000, feePaid: 28000, feePending: 0, feeDueDate: 'Mar 1', feeMethod: 'Cash', feeDate: 'Mar 11', campus: 'RV Jayanagar', gender: 'Male' }
  ];

  const facultySeeds = [
    { name: 'Dr. Priya Mehta', email: 'priya@rvhub.com', phone: '9876543211', subject: 'Physics', emp: 'RVF001', campus: 'RV Jayanagar', batch: 'JEE Advanced (Main + KCET Decoded)' },
    { name: 'Prof. Amit Singh', email: 'amit.singh@rvhub.com', phone: '9876543213', subject: 'Chemistry', emp: 'RVF002', campus: 'RV Rajajinagar', batch: 'JEE (Main + KCET Decoded)' },
    { name: 'Mr. Raj Sharma', email: 'raj.sharma@rvhub.com', phone: '9876543214', subject: 'Mathematics', emp: 'RVF003', campus: 'RV Electronic City', batch: 'JEE Advanced (Main + KCET Decoded)' },
    { name: 'Dr. Kavya R.', email: 'kavya.r@rvhub.com', phone: '9876543215', subject: 'Biology', emp: 'RVF004', campus: 'RV Jayanagar', batch: 'NEET UG Decoded' },
    { name: 'Prof. Neha K.', email: 'neha.k@rvhub.com', phone: '9876543216', subject: 'Accountancy', emp: 'RVF005', campus: 'RV Rajajinagar', batch: 'Commerce Decoded Programme' }
  ];

  users.push({
    _id: '3',
    name: 'Rahul Verma',
    email: 'admin@rvhub.com',
    phone: '9876543212',
    password: admHash,
    role: 'admin',
    ava: 'A',
    dept: 'Administration',
    emp: 'ADM-001',
    designation: 'System Administrator',
    campus: 'RV Learning Hub HQ',
    st: 'active'
  });

  const parentHash = await bcrypt.hash('parent123', salt);
  users.push({
    _id: 'p1',
    name: 'Suresh Sharma',
    email: 'parent@rvhub.com',
    phone: '9876500000',
    password: parentHash,
    role: 'parent',
    ava: 'P',
    children: [
      { name: 'Arjun Sharma', roll: 'RV2024001', batch: 'JEE Advanced (Main + KCET Decoded)', campus: 'RV Jayanagar' },
      { name: 'Sneha Patel', roll: 'RV2024002', batch: 'JEE Advanced (Main + KCET Decoded)', campus: 'RV Rajajinagar' }
    ],
    campus: 'RV Jayanagar',
    st: 'active'
  });


  studentSeeds.forEach((s, i) => {
    users.push({
      _id: 's' + (i + 1),
      name: s.name,
      email: s.email,
      phone: s.phone,
      password: hash,
      role: 'student',
      ava: s.name.charAt(0),
      batch: s.batch,
      roll: s.roll,
      streak: s.streak,
      avgScore: s.avgScore,
      feeStatus: s.feeStatus,
      feeAmount: s.feeAmount,
      feePaid: s.feePaid,
      feePending: s.feePending,
      feeDueDate: s.feeDueDate,
      feeMethod: s.feeMethod,
      feeDate: s.feeDate,
      campus: s.campus,
      gender: s.gender,
      st: 'active'
    });
  });

  facultySeeds.forEach((f, i) => {
    users.push({
      _id: 'f' + (i + 1),
      name: f.name,
      email: f.email,
      phone: f.phone,
      password: facHash,
      role: 'faculty',
      ava: f.name.charAt(0),
      subject: f.subject,
      emp: f.emp,
      campus: f.campus,
      batch: f.batch,
      st: 'active'
    });
  });

  // 2. Seed Courses
  const courseSeeds = [
    { title: 'JEE Advanced (Main + KCET Decoded)', e: '⚛️', cat: 'JEE', dur: '2 Years', fee: 45000, maxSt: 150, enrolledCount: 142, enrolled: false, pub: true, col: '#ff2d6b', fac: 'Dr. Priya Mehta', desc: 'Comprehensive 2-year program covering full JEE Advanced + Mains syllabus with KCET integration.', subjects: ['Physics', 'Chemistry', 'Mathematics'], curriculum: 'Chapter-wise DPPs, weekly tests, mock series, dedicated doubt sessions.' },
    { title: 'JEE (Main + KCET Decoded)', e: '⚛️', cat: 'JEE', dur: '1 Year', fee: 30000, maxSt: 150, enrolledCount: 98, enrolled: false, pub: true, col: '#6c47ff', fac: 'Prof. Amit Singh', desc: 'Focused 1-year JEE Mains preparation with KCET decoded strategy.', subjects: ['Physics', 'Chemistry', 'Mathematics'], curriculum: 'Subject-wise modules, weekly mocks, previous year papers.' },
    { title: 'NEET UG Decoded', e: '🔬', cat: 'NEET', dur: '1 Year', fee: 38000, maxSt: 120, enrolledCount: 72, enrolled: false, pub: true, col: '#4ade80', fac: 'Dr. Kavya R.', desc: 'Complete NEET UG preparation covering Biology, Physics & Chemistry.', subjects: ['Biology', 'Physics', 'Chemistry'], curriculum: 'NCERT-based modules, MCQ practice, full mock tests.' },
    { title: 'Commerce Decoded Programme', e: '💼', cat: 'Commerce', dur: '1 Year', fee: 28000, maxSt: 100, enrolledCount: 56, enrolled: false, pub: true, col: '#fbbf24', fac: 'Prof. Neha K.', desc: 'XI & XII Commerce covering Accountancy, Economics, Business Studies.', subjects: ['Accountancy', 'Economics', 'Business Studies', 'Mathematics'], curriculum: 'Board + competitive exam focus, case studies.' },
    { title: 'NEET Biology Special', e: '🧬', cat: 'NEET', dur: '6 Months', fee: 12000, maxSt: 80, enrolledCount: 0, enrolled: false, pub: false, col: '#00d4c8', fac: 'Dr. Kavya R.', desc: 'Intensive Biology revision for NEET aspirants.', subjects: ['Biology'], curriculum: 'Topic-wise revision, high-yield MCQs, previous year analysis.' }
  ];

  courseSeeds.forEach(c => {
    courses.push({
      _id: genId(),
      ...c
    });
  });

  // 3. Seed Videos
  const videoSeeds = [
    { title: 'Electrostatics — Coulomb\'s Law & Electric Field', dur: '48 min', views: 1240, date: 'Mar 10', fac: 'Dr. Priya Mehta', thumb: '⚡', sub: 'Physics', course: 'JEE Advanced (Main + KCET Decoded)' },
    { title: 'Gauss Law — Full Derivation with Problems', dur: '55 min', views: 980, date: 'Mar 8', fac: 'Dr. Priya Mehta', thumb: '🔋', sub: 'Physics', course: 'JEE Advanced (Main + KCET Decoded)' },
    { title: 'Capacitors — Energy & Combinations', dur: '42 min', views: 760, date: 'Mar 5', fac: 'Dr. Priya Mehta', thumb: '💡', sub: 'Physics', course: 'JEE Advanced (Main + KCET Decoded)' },
    { title: 'Current Electricity — Ohm\'s Law & Kirchhoff', dur: '50 min', views: 890, date: 'Mar 3', fac: 'Dr. Priya Mehta', thumb: '⚡', sub: 'Physics', course: 'JEE Advanced (Main + KCET Decoded)' },
    { title: 'Organic Chemistry — IUPAC Naming', dur: '44 min', views: 1100, date: 'Mar 9', fac: 'Prof. Amit Singh', thumb: '🧪', sub: 'Chemistry', course: 'JEE Advanced (Main + KCET Decoded)' },
    { title: 'Reaction Mechanisms — SN1 vs SN2', dur: '58 min', views: 870, date: 'Mar 7', fac: 'Prof. Amit Singh', thumb: '⚗️', sub: 'Chemistry', course: 'JEE Advanced (Main + KCET Decoded)' },
    { title: 'Coordination Compounds — Complete', dur: '60 min', views: 640, date: 'Mar 4', fac: 'Prof. Amit Singh', thumb: '🧬', sub: 'Chemistry', course: 'JEE Advanced (Main + KCET Decoded)' },
    { title: 'Calculus — Limits & Continuity', dur: '52 min', views: 1320, date: 'Mar 11', fac: 'Mr. Raj Sharma', thumb: '📐', sub: 'Mathematics', course: 'JEE Advanced (Main + KCET Decoded)' },
    { title: 'Integration — All Methods Covered', dur: '65 min', views: 1050, date: 'Mar 9', fac: 'Mr. Raj Sharma', thumb: '∫', sub: 'Mathematics', course: 'JEE Advanced (Main + KCET Decoded)' },
    { title: 'Vectors & 3D Geometry', dur: '48 min', views: 780, date: 'Mar 6', fac: 'Mr. Raj Sharma', thumb: '📊', sub: 'Mathematics', course: 'JEE Advanced (Main + KCET Decoded)' },
    { title: 'Cell Structure — Complete Revision', dur: '55 min', views: 890, date: 'Mar 10', fac: 'Dr. Kavya R.', thumb: '🔬', sub: 'Biology', course: 'NEET UG Decoded' },
    { title: 'Human Physiology — Nervous System', dur: '48 min', views: 720, date: 'Mar 8', fac: 'Dr. Kavya R.', thumb: '🧠', sub: 'Biology', course: 'NEET UG Decoded' },
    { title: 'Plant Kingdom — Classification', dur: '42 min', views: 630, date: 'Mar 5', fac: 'Dr. Kavya R.', thumb: '🌿', sub: 'Biology', course: 'NEET UG Decoded' },
    { title: 'Optics — Ray & Wave Optics', dur: '50 min', views: 560, date: 'Mar 9', fac: 'Prof. Amit Singh', thumb: '🔭', sub: 'Physics', course: 'NEET UG Decoded' },
    { title: 'Modern Physics — Atomic Models', dur: '44 min', views: 480, date: 'Mar 7', fac: 'Prof. Amit Singh', thumb: '⚛️', sub: 'Physics', course: 'NEET UG Decoded' },
    { title: 'Biomolecules — Carbohydrates & Proteins', dur: '46 min', views: 720, date: 'Mar 8', fac: 'Prof. Amit Singh', thumb: '🧬', sub: 'Chemistry', course: 'NEET UG Decoded' },
    { title: 'Electrochemistry for NEET', dur: '40 min', views: 540, date: 'Mar 5', fac: 'Prof. Amit Singh', thumb: '🔋', sub: 'Chemistry', course: 'NEET UG Decoded' },
    { title: 'Partnership Accounts — Introduction', dur: '45 min', views: 420, date: 'Mar 9', fac: 'Prof. Neha K.', thumb: '📊', sub: 'Accountancy', course: 'Commerce Decoded Programme' },
    { title: 'Ratio Analysis — Complete Guide', dur: '38 min', views: 360, date: 'Mar 7', fac: 'Prof. Neha K.', thumb: '📈', sub: 'Accountancy', course: 'Commerce Decoded Programme' },
    { title: 'Macro Economics — National Income', dur: '42 min', views: 380, date: 'Mar 8', fac: 'Prof. Neha K.', thumb: '💹', sub: 'Economics', course: 'Commerce Decoded Programme' },
    { title: 'Micro Economics — Supply & Demand', dur: '35 min', views: 310, date: 'Mar 6', fac: 'Prof. Neha K.', thumb: '📉', sub: 'Economics', course: 'Commerce Decoded Programme' },
    { title: 'Business Finance — Sources of Funds', dur: '40 min', views: 290, date: 'Mar 7', fac: 'Prof. Neha K.', thumb: '💼', sub: 'Business Studies', course: 'Commerce Decoded Programme' }
  ];

  videoSeeds.forEach(v => {
    videos.push({
      _id: genId(),
      ...v
    });
  });

  // 4. Seed Materials
  const materialSeeds = [
    { name: 'Chapter 1 — Electrostatics Notes', type: 'PDF', size: '2.4 MB', date: 'Mar 10', pg: 28, sub: 'Physics', course: 'JEE Advanced (Main + KCET Decoded)', category: 'Course Materials' },
    { name: 'Chapter 2 — Current Electricity', type: 'PDF', size: '1.8 MB', date: 'Mar 8', pg: 22, sub: 'Physics', course: 'JEE Advanced (Main + KCET Decoded)', category: 'Course Materials' },
    { name: 'DPP Set 1-5 with Solutions', type: 'PDF', size: '3.2 MB', date: 'Mar 6', pg: 45, sub: 'Physics', course: 'JEE Advanced (Main + KCET Decoded)', category: 'Course Materials' },
    { name: 'Organic Reactions Quick Sheet', type: 'PDF', size: '1.2 MB', date: 'Mar 9', pg: 12, sub: 'Chemistry', course: 'JEE Advanced (Main + KCET Decoded)', category: 'Course Materials' },
    { name: 'Inorganic Chemistry Notes', type: 'PDF', size: '2.8 MB', date: 'Mar 5', pg: 35, sub: 'Chemistry', course: 'JEE Advanced (Main + KCET Decoded)', category: 'Course Materials' },
    { name: 'Calculus Formula Sheet', type: 'PDF', size: '0.8 MB', date: 'Mar 11', pg: 8, sub: 'Mathematics', course: 'JEE Advanced (Main + KCET Decoded)', category: 'Course Materials' },
    { name: 'Algebra Problem Bank', type: 'PDF', size: '4.1 MB', date: 'Mar 7', pg: 60, sub: 'Mathematics', course: 'JEE Advanced (Main + KCET Decoded)', category: 'Course Materials' },
    { name: 'Biology NCERT Key Points', type: 'PDF', size: '3.6 MB', date: 'Mar 10', pg: 48, sub: 'Biology', course: 'NEET UG Decoded', category: 'Course Materials' },
    { name: 'Previous Year MCQs Biology', type: 'PDF', size: '2.1 MB', date: 'Mar 6', pg: 32, sub: 'Biology', course: 'NEET UG Decoded', category: 'Course Materials' },
    { name: 'Physics Formula Sheet NEET', type: 'PDF', size: '1.4 MB', date: 'Mar 9', pg: 16, sub: 'Physics', course: 'NEET UG Decoded', category: 'Course Materials' },
    { name: 'Chemistry Quick Revision', type: 'PDF', size: '1.9 MB', date: 'Mar 8', pg: 24, sub: 'Chemistry', course: 'NEET UG Decoded', category: 'Course Materials' },
    { name: 'Accountancy Formula Sheet', type: 'PDF', size: '1.1 MB', date: 'Mar 9', pg: 10, sub: 'Accountancy', course: 'Commerce Decoded Programme', category: 'Course Materials' },
    { name: 'Economics Notes XI & XII', type: 'PDF', size: '2.4 MB', date: 'Mar 8', pg: 36, sub: 'Economics', course: 'Commerce Decoded Programme', category: 'Course Materials' },
    { name: 'Business Studies Summary', type: 'PDF', size: '1.5 MB', date: 'Mar 7', pg: 20, sub: 'Business Studies', course: 'Commerce Decoded Programme', category: 'Course Materials' },

    // Question Papers
    { name: 'JEE Advanced 2024 Paper 1 + Solutions', type: 'Question Papers', size: '2.5 MB', date: 'Mar 12, 2025', pg: 18, sub: 'All', course: 'JEE Advanced (Main + KCET Decoded)', category: 'Question Papers', year: 2024 },
    { name: 'JEE Advanced 2024 Paper 2 + Solutions', type: 'Question Papers', size: '2.7 MB', date: 'Mar 12, 2025', pg: 20, sub: 'All', course: 'JEE Advanced (Main + KCET Decoded)', category: 'Question Papers', year: 2024 },
    { name: 'JEE Mains Jan 2024 All Sets', type: 'Question Papers', size: '5.2 MB', date: 'Mar 12, 2025', pg: 64, sub: 'All', course: 'JEE Advanced (Main + KCET Decoded)', category: 'Question Papers', year: 2024 },
    { name: 'JEE Advanced 2023 Paper 1 + Solutions', type: 'Question Papers', size: '2.4 MB', date: 'Mar 10, 2024', pg: 18, sub: 'All', course: 'JEE Advanced (Main + KCET Decoded)', category: 'Question Papers', year: 2023 },
    { name: 'JEE Advanced 2023 Paper 2 + Solutions', type: 'Question Papers', size: '2.6 MB', date: 'Mar 10, 2024', pg: 20, sub: 'All', course: 'JEE Advanced (Main + KCET Decoded)', category: 'Question Papers', year: 2023 },
    { name: 'KCET 2023 Question Paper', type: 'Question Papers', size: '1.8 MB', date: 'May 20, 2023', pg: 16, sub: 'All', course: 'JEE Advanced (Main + KCET Decoded)', category: 'Question Papers', year: 2023 },
    { name: 'JEE Advanced 2022 Complete Papers', type: 'Question Papers', size: '4.8 MB', date: 'Mar 8, 2023', pg: 36, sub: 'All', course: 'JEE Advanced (Main + KCET Decoded)', category: 'Question Papers', year: 2022 },
    { name: 'JEE Mains 2022 All Sessions', type: 'Question Papers', size: '8.4 MB', date: 'Mar 8, 2023', pg: 120, sub: 'All', course: 'JEE Advanced (Main + KCET Decoded)', category: 'Question Papers', year: 2022 },
    { name: 'NEET UG 2024 Official Paper + Key', type: 'Question Papers', size: '3.1 MB', date: 'May 5, 2024', pg: 24, sub: 'All', course: 'NEET UG Decoded', category: 'Question Papers', year: 2024 },
    { name: 'NEET UG 2024 Re-exam Paper', type: 'Question Papers', size: '3.0 MB', date: 'Jun 23, 2024', pg: 24, sub: 'All', course: 'NEET UG Decoded', category: 'Question Papers', year: 2024 },
    { name: 'NEET UG 2023 Official Paper + Key', type: 'Question Papers', size: '2.9 MB', date: 'May 7, 2023', pg: 24, sub: 'All', course: 'NEET UG Decoded', category: 'Question Papers', year: 2023 },
    { name: 'NEET UG 2022 Official Paper + Key', type: 'Question Papers', size: '2.8 MB', date: 'May 8, 2022', pg: 24, sub: 'All', course: 'NEET UG Decoded', category: 'Question Papers', year: 2022 },
    { name: 'CBSE Commerce XII 2024 Paper', type: 'Question Papers', size: '1.2 MB', date: 'Mar 15, 2024', pg: 12, sub: 'All', course: 'Commerce Decoded Programme', category: 'Question Papers', year: 2024 },
    { name: 'CBSE Commerce XI 2024 Paper', type: 'Question Papers', size: '1.1 MB', date: 'Mar 12, 2024', pg: 10, sub: 'All', course: 'Commerce Decoded Programme', category: 'Question Papers', year: 2024 },
    { name: 'CBSE Commerce XII 2023 Paper', type: 'Question Papers', size: '1.2 MB', date: 'Mar 14, 2023', pg: 12, sub: 'All', course: 'Commerce Decoded Programme', category: 'Question Papers', year: 2023 }
  ];

  materialSeeds.forEach(m => {
    materials.push({
      _id: genId(),
      ...m
    });
  });

  // 5. Seed Live Classes
  liveClasses.push(
    { _id: genId(), time: 'LIVE', date: 'NOW', sub: 'Physics', topic: 'Electrostatics: Gauss Law', fac: 'Dr. Priya Mehta', online: 142, status: 'ongoing' },
    { _id: genId(), time: '11:00 AM', date: 'Today', sub: 'Chemistry', topic: 'Aldehydes & Ketones', fac: 'Prof. Amit Singh', online: 0, status: 'upcoming' },
    { _id: genId(), time: '02:00 PM', date: 'Today', sub: 'Maths', topic: 'Integration by Parts', fac: 'Mr. Raj Sharma', online: 0, status: 'upcoming' }
  );

  // 6. Seed Doubts
  doubts.push(
    { _id: genId(), q: 'What is Gauss Law for non-uniform fields?', s: 'resolved', t: '2 hours ago', sub: 'Physics', student: 'Arjun Sharma', replies: [
      { sender: 'Arjun Sharma', text: 'What is Gauss Law for non-uniform fields?', time: '2 hours ago' },
      { sender: 'Dr. Priya Mehta', text: 'Here is the detailed solution: to compute the Gauss Law for this field, integrate the flux over the closed spherical shell. The flux equals Q_enclosed divided by epsilon_0. I hope this clarifies your doubt!', time: '1 hour ago' }
    ], ai: true },
    { _id: genId(), q: 'Integration by parts — when to apply?', s: 'pending', t: '5 hours ago', sub: 'Maths', student: 'Arjun Sharma', replies: [
      { sender: 'Arjun Sharma', text: 'Integration by parts — when to apply?', time: '5 hours ago' }
    ], ai: false }
  );

  // 7. Seed Announcements
  announcements.push(
    { _id: genId(), title: 'JEE Advanced Mock Test schedule released', body: 'The mock test series starts on March 25. Attendance is mandatory for all enrolled students.', cat: 'Important', date: 'Today, 10:00 AM', urgent: true, target: 'student' },
    { _id: genId(), title: 'Weekly doubt resolution sessions schedule', body: 'Doubt sessions will happen every Wednesday and Friday from 4 PM to 6 PM online.', cat: 'Academic', date: 'Yesterday', urgent: false, target: 'faculty' }
  );

  // 8. Seed Quiz Results
  const quizSeeds = [
    { student: 'Arjun Sharma', roll: 'RV2024001', course: 'JEE Advanced (Main + KCET Decoded)', subject: 'Physics', video: 'Electrostatics — Coulomb\'s Law', score: 85, total: 100, date: 'Mar 13' },
    { student: 'Arjun Sharma', roll: 'RV2024001', course: 'JEE Advanced (Main + KCET Decoded)', subject: 'Mathematics', video: 'Calculus — Limits & Continuity', score: 72, total: 100, date: 'Mar 12' },
    { student: 'Arjun Sharma', roll: 'RV2024001', course: 'JEE Advanced (Main + KCET Decoded)', subject: 'Chemistry', video: 'Organic — IUPAC Naming', score: 91, total: 100, date: 'Mar 11' },
    { student: 'Sneha Patel', roll: 'RV2024002', course: 'JEE Advanced (Main + KCET Decoded)', subject: 'Physics', video: 'Gauss Law — Full Derivation', score: 78, total: 100, date: 'Mar 13' },
    { student: 'Sneha Patel', roll: 'RV2024002', course: 'JEE Advanced (Main + KCET Decoded)', subject: 'Chemistry', video: 'Reaction Mechanisms SN1 vs SN2', score: 88, total: 100, date: 'Mar 12' },
    { student: 'Rohan Gupta', roll: 'RV2024003', course: 'JEE (Main + KCET Decoded)', subject: 'Mathematics', video: 'Integration — All Methods', score: 65, total: 100, date: 'Mar 13' },
    { student: 'Rohan Gupta', roll: 'RV2024003', course: 'JEE (Main + KCET Decoded)', subject: 'Physics', video: 'Optics — Ray & Wave Optics', score: 70, total: 100, date: 'Mar 11' },
    { student: 'Kavya Reddy', roll: 'RV2024015', course: 'NEET UG Decoded', subject: 'Biology', video: 'Cell Structure — Complete', score: 94, total: 100, date: 'Mar 13' },
    { student: 'Kavya Reddy', roll: 'RV2024015', course: 'NEET UG Decoded', subject: 'Chemistry', video: 'Biomolecules — Carbohydrates', score: 82, total: 100, date: 'Mar 12' },
    { student: 'Dev Verma', roll: 'RV2024020', course: 'Commerce Decoded Programme', subject: 'Accountancy', video: 'Partnership Accounts Intro', score: 55, total: 100, date: 'Mar 10' },
    { student: 'Dev Verma', roll: 'RV2024020', course: 'Commerce Decoded Programme', subject: 'Economics', video: 'Macro Economics — National Income', score: 62, total: 100, date: 'Mar 9' }
  ];

  quizSeeds.forEach(q => {
    quizResults.push({
      _id: genId(),
      ...q
    });
  });

  // 9. Seed Payments
  const paymentSeeds = [
    { id: 'TXN001', student: 'Sneha Patel', material: 'JEE Advanced Full Course', amount: 45000, date: 'Mar 12, 2025', method: 'UPI', status: 'success', type: 'course' },
    { id: 'TXN002', student: 'Kavya Reddy', material: 'NEET UG Decoded', amount: 38000, date: 'Mar 12, 2025', method: 'Credit Card', status: 'success', type: 'course' },
    { id: 'TXN003', student: 'Aman Joshi', material: 'Commerce Decoded', amount: 28000, date: 'Mar 11, 2025', method: 'Cash', status: 'success', type: 'course' },
    { id: 'TXN004', student: 'Rohan Gupta', material: 'Physics DPP Pack', amount: 499, date: 'Mar 10, 2025', method: 'UPI', status: 'success', type: 'material' },
    { id: 'TXN005', student: 'Kavya Reddy', material: 'NEET Biology DPP Pack', amount: 299, date: 'Mar 10, 2025', method: 'UPI', status: 'success', type: 'material' },
    { id: 'TXN006', student: 'Dev Verma', material: 'Commerce Decoded', amount: 14000, date: 'Mar 9, 2025', method: 'Net Banking', status: 'pending', type: 'course' },
    { id: 'TXN007', student: 'Arjun Sharma', material: 'JEE Advanced Full Course', amount: 22500, date: 'Mar 8, 2025', method: 'UPI', status: 'success', type: 'course' },
    { id: 'TXN008', student: 'Meera Shah', material: 'JEE Advanced Full Course', amount: 15000, date: 'Mar 7, 2025', method: 'Cheque', status: 'failed', type: 'course' },
    { id: 'TXN009', student: 'Ravi Kumar', material: 'NEET Full Course', amount: 19000, date: 'Mar 6, 2025', method: 'Debit Card', status: 'success', type: 'course' },
    { id: 'TXN010', student: 'Priya Joshi', material: 'Calculus Formula Sheet', amount: 99, date: 'Mar 5, 2025', method: 'UPI', status: 'success', type: 'material' }
  ];

  paymentSeeds.forEach(p => {
    payments.push({
      _id: genId(),
      ...p
    });
  });

  // 10. Seed Role-Separated Activity Logs
  try {
    if (isMongoConnected) {
      const adminCount = await AdminActivity.countDocuments();
      if (adminCount === 0) {
        await AdminActivity.insertMany([
          { adminId: '3', adminName: 'Rahul Verma', email: 'admin@rvhub.com', action: 'Course Created', targetType: 'Course', targetName: 'JEE Advanced (Main + KCET Decoded)', details: 'Created new batch & assigned Dr. Priya Mehta', ip: '127.0.0.1' },
          { adminId: '3', adminName: 'Rahul Verma', email: 'admin@rvhub.com', action: 'Fee Status Updated', targetType: 'User', targetName: 'Sneha Patel', details: 'Updated fee status to Paid (₹45,000)', ip: '127.0.0.1' },
          { adminId: '3', adminName: 'Rahul Verma', email: 'admin@rvhub.com', action: 'Announcement Published', targetType: 'Announcement', targetName: 'JEE Advanced Mock Test schedule', details: 'Broadcast notice sent to all students', ip: '127.0.0.1' }
        ]);
      }

      const superCount = await SuperAdminActivity.countDocuments();
      if (superCount === 0) {
        await SuperAdminActivity.insertMany([
          { superAdminId: 'saas_1', superAdminName: 'Edchemy SaaS Director', email: 'superadmin@saas.com', action: 'Tenant Onboarded', tenantId: 't1', tenantName: 'RV Educational Institutions', details: 'Onboarded Enterprise plan with 5,000 max capacity', ip: '127.0.0.1' },
          { superAdminId: 'saas_1', superAdminName: 'Edchemy SaaS Director', email: 'superadmin@saas.com', action: 'Subscription Upgraded', tenantId: 't3', tenantName: 'Sri Kumaran Group', details: 'Upgraded plan from Growth to Enterprise ($599/mo)', ip: '127.0.0.1' }
        ]);
      }

      const userCount = await UserActivity.countDocuments();
      if (userCount === 0) {
        await UserActivity.insertMany([
          { userId: 's1', userName: 'Arjun Sharma', email: 'arjun@rvhub.com', role: 'student', action: 'Video Lecture Watched', module: 'Video', details: 'Watched Laws of Motion (75% completed)', ip: '127.0.0.1' },
          { userId: 's1', userName: 'Arjun Sharma', email: 'arjun@rvhub.com', role: 'student', action: 'Quiz Attempted', module: 'Quiz', details: 'Scored 85/100 in Physics Electrostatics Quiz', ip: '127.0.0.1' },
          { userId: 's2', userName: 'Sneha Patel', email: 'sneha.patel@student.rvhub.com', role: 'student', action: 'Fee Payment Completed', module: 'Fee', details: 'Paid tuition fee ₹45,000 via UPI', ip: '127.0.0.1' },
          { userId: 'f1', userName: 'Dr. Priya Mehta', email: 'priya@rvhub.com', role: 'faculty', action: 'Doubt Answered', module: 'Doubt', details: 'Resolved doubt on Gauss Law for Arjun Sharma', ip: '127.0.0.1' }
        ]);
      }

      // Edchemy Models Seeding
      const leaveCount = await LeaveRequest.countDocuments();
      if (leaveCount === 0) {
        await LeaveRequest.insertMany([
          { studentId: 's1', studentName: 'Arjun Sharma', parentName: 'Suresh Sharma', startDate: '2026-03-20', endDate: '2026-03-22', reason: 'Family Medical Emergency', status: 'Approved', appliedOn: '2026-03-18' },
          { studentId: 's2', studentName: 'Sneha Patel', parentName: 'Rajesh Patel', startDate: '2026-03-25', endDate: '2026-03-26', reason: 'Attending State Level Quiz Contest', status: 'Pending', appliedOn: '2026-03-21' }
        ]);
      }

      const siblingCount = await SiblingAdmission.countDocuments();
      if (siblingCount === 0) {
        await SiblingAdmission.insertMany([
          { parentName: 'Suresh Sharma', parentEmail: 'parent@rvhub.com', parentPhone: '9876500000', siblingName: 'Rohan Sharma', dob: '2012-05-14', gradeApplying: 'Grade 9 - Foundation Batch', previousSchool: 'Delhi Public School', status: 'Document Verification', applicationNo: 'SIB-2026-008' }
        ]);
      }

      const marksCount = await MarksCard.countDocuments();
      if (marksCount === 0) {
        await MarksCard.insertMany([
          {
            studentId: 's1',
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
            overallGrade: 'Distinction (A+)',
            issueDate: 'Mar 15, 2025'
          }
        ]);
      }

      const eventCount = await CalendarEvent.countDocuments();
      if (eventCount === 0) {
        await CalendarEvent.insertMany([
          { title: 'JEE Advanced Full Mock Test 1', category: 'Exam', date: '2026-03-25', time: '09:00 AM - 12:00 PM', venue: 'Main Auditorium / Online Portal', description: 'Mandatory full-syllabus mock exam.' },
          { title: 'Parent-Teacher Meeting (PTM 2025)', category: 'PTM', date: '2026-03-28', time: '10:00 AM - 02:00 PM', venue: 'RV Jayanagar Campus', description: 'Discussion on Mid-Term marks card and attendance.' },
          { title: 'Ugadi / Festivity Holiday', category: 'Holiday', date: '2026-03-30', time: 'All Day', venue: 'Holiday', description: 'Institution will remain closed.' }
        ]);
      }

      const badgeCount = await Badge.countDocuments();
      if (badgeCount === 0) {
        await Badge.insertMany([
          { studentId: 's1', badgeId: 'b1', title: '7-Day Streak Master', icon: '🔥', category: 'Streak', description: 'Maintained a 7-day active learning streak without missing a day.', isUnlocked: true, unlockedAt: 'Mar 10, 2026', progressPct: 100 },
          { studentId: 's1', badgeId: 'b2', title: 'Speed Quizzer', icon: '⚡', category: 'Quiz', description: 'Scored 85%+ in Physics Electrostatics DPP.', isUnlocked: true, unlockedAt: 'Mar 12, 2026', progressPct: 100 },
          { studentId: 's1', badgeId: 'b3', title: 'Top 5 Ranker', icon: '🏆', category: 'Academic', description: 'Achieved 3rd Rank in JEE Advanced Batch A.', isUnlocked: true, unlockedAt: 'Mar 15, 2026', progressPct: 100 },
          { studentId: 's1', badgeId: 'b4', title: 'Distinction Scholar', icon: '📜', category: 'Academic', description: 'Scored Distinction (A+) in Mid-Term Examinations.', isUnlocked: true, unlockedAt: 'Mar 15, 2026', progressPct: 100 },
          { studentId: 's1', badgeId: 'b5', title: 'Doubt Explorer', icon: '💬', category: 'Community', description: 'Submitted and resolved 5 academic doubts with faculty.', isUnlocked: true, unlockedAt: 'Mar 14, 2026', progressPct: 100 },
          { studentId: 's1', badgeId: 'b6', title: 'Library Scholar', icon: '📚', category: 'Academic', description: 'Downloaded 10+ Question Papers & DPP Study Guides.', isUnlocked: false, unlockedAt: '', progressPct: 70 },
          { studentId: 's1', badgeId: 'b7', title: 'Mock Exam Titan', icon: '🚀', category: 'Academic', description: 'Clear all 5 JEE Advanced Full Mock Exams.', isUnlocked: false, unlockedAt: '', progressPct: 20 }
        ]);
      }

      const liveCount = await LiveClass.countDocuments();

      if (liveCount === 0) {
        await LiveClass.insertMany([
          {
            topic: 'Electrostatics: Gauss Law & Spherical Shells',
            subject: 'Physics',
            faculty: 'Dr. Priya Mehta',
            status: 'ongoing',
            onlineViewers: 142,
            scheduledTime: 'LIVE NOW',
            scheduledDate: 'Today',
            streamUrl: 'https://www.youtube.com/embed/3JIpN8nnPoM',
            chatMessages: [
              { sender: 'Dr. Priya Mehta', role: 'faculty', text: 'Welcome everyone! Today we are deriving Gauss Law for non-uniform charge distributions.', time: '10:00 AM' },
              { sender: 'Arjun Sharma', role: 'student', text: 'Dr. Priya, does electric flux depend on the radius of the gaussian sphere?', time: '10:05 AM' },
              { sender: 'Dr. Priya Mehta', role: 'faculty', text: 'No Arjun, flux depends strictly on total enclosed charge divided by epsilon_0!', time: '10:06 AM' }
            ]
          },
          {
            topic: 'Aldehydes & Ketones: Reaction Mechanisms',
            subject: 'Chemistry',
            faculty: 'Prof. Amit Singh',
            status: 'upcoming',
            onlineViewers: 0,
            scheduledTime: '11:30 AM',
            scheduledDate: 'Today',
            streamUrl: 'https://www.youtube.com/embed/3JIpN8nnPoM',
            chatMessages: []
          },
          {
            topic: 'Integration by Parts: Advanced Shortcuts',
            subject: 'Mathematics',
            faculty: 'Mr. Raj Sharma',
            status: 'upcoming',
            onlineViewers: 0,
            scheduledTime: '02:00 PM',
            scheduledDate: 'Today',
            streamUrl: 'https://www.youtube.com/embed/3JIpN8nnPoM',
            chatMessages: []
          }
        ]);
      }

      const qbCount = await QuestionBank.countDocuments();
      if (qbCount === 0) {
        await QuestionBank.insertMany([
          {
            subject: 'Physics',
            moduleName: 'Module 1: Electrostatics & Gauss Law',
            questionText: 'Electric flux through a closed Gaussian surface enclosing a dipole of charges +q and -q is:',
            options: ['Zero', 'q / epsilon_0', '2q / epsilon_0', 'Infinity'],
            correctOption: 'Zero',
            difficulty: 'Easy',
            type: 'MCQ',
            solutionExplanation: 'Net charge enclosed by the Gaussian surface is (+q) + (-q) = 0. By Gauss Law, total electric flux = Q_enclosed / epsilon_0 = 0.',
            createdBy: 'Dr. Priya Mehta'
          },
          {
            subject: 'Physics',
            moduleName: 'Module 1: Electrostatics & Gauss Law',
            questionText: 'A thin conducting spherical shell of radius R carries charge Q. The electric field at distance r (r < R) from center is:',
            options: ['Zero', 'kQ / r^2', 'kQ / R^2', 'kQ / r'],
            correctOption: 'Zero',
            difficulty: 'Medium',
            type: 'MCQ',
            solutionExplanation: 'Inside a conducting spherical shell, all charge resides on the outer surface. Hence, enclosed charge Q_enc = 0 for r < R, making E = 0.',
            createdBy: 'Dr. Priya Mehta'
          },
          {
            subject: 'Physics',
            moduleName: 'Module 2: Current Electricity & Kirchhoff Laws',
            questionText: 'In a Wheatstone bridge, if the galvanometer shows zero deflection, the condition satisfied is:',
            options: ['P/Q = R/S', 'P*Q = R*S', 'P + Q = R + S', 'P - Q = R - S'],
            correctOption: 'P/Q = R/S',
            difficulty: 'Easy',
            type: 'MCQ',
            solutionExplanation: 'A Wheatstone bridge is balanced when opposite ratio of resistances are equal: P/Q = R/S.',
            createdBy: 'Dr. Priya Mehta'
          },
          {
            subject: 'Chemistry',
            moduleName: 'Module 1: Organic Reaction Mechanisms',
            questionText: 'Which of the following carbocations is most stable due to resonance and hyperconjugation?',
            options: ['Tertiary butyl carbocation (CH3)3C+', 'Secondary propyl carbocation (CH3)2CH+', 'Primary ethyl carbocation CH3CH2+', 'Methyl carbocation CH3+'],
            correctOption: 'Tertiary butyl carbocation (CH3)3C+',
            difficulty: 'Medium',
            type: 'MCQ',
            solutionExplanation: 'Tertiary butyl carbocation has 9 hyperconjugative alpha-hydrogens, making it the most stable alkyl carbocation.',
            createdBy: 'Prof. Amit Singh'
          },
          {
            subject: 'Mathematics',
            moduleName: 'Module 1: Differential Calculus & Limits',
            questionText: 'Evaluate the limit: lim (x -> 0) [sin(5x) / x]:',
            options: ['5', '1', '0', '1/5'],
            correctOption: '5',
            difficulty: 'Easy',
            type: 'MCQ',
            solutionExplanation: 'Using standard limit formula lim(u->0) sin(u)/u = 1: lim (5 * sin(5x)/(5x)) = 5 * 1 = 5.',
            createdBy: 'Mr. Raj Sharma'
          }
        ]);
      }

      const vcCount = await VideoChatLog.countDocuments();

      if (vcCount === 0) {
        await VideoChatLog.insertMany([
          {
            videoTitle: 'Electrostatics & Gauss Law',
            studentName: 'Arjun Sharma',
            userQuery: 'Summarize Gauss Law proof for spherical shell',
            aiResponse: '🤖 **AI Video Assistant:** At [⏱️ 12:45], Dr. Priya Mehta proves Gauss Law for a conducting spherical shell of radius R. Since all charge resides on the outer surface, enclosed charge Q_enc = 0 for r < R. Therefore, the electric field E = 0 inside the shell.',
            timestampMark: '12:45',
            subject: 'Physics'
          }
        ]);
      }

      const ivCount = await InVideoQuiz.countDocuments();

      if (ivCount === 0) {
        await InVideoQuiz.insertMany([
          {
            videoTitle: 'Electrostatics & Gauss Law',
            timestampSeconds: 135,
            timestampFormatted: '02:15',
            stepIndex: '1/7',
            title: 'Course overview',
            description: 'Switch between courses & get course information with progress',
            questionText: 'In-Video Checkpoint (1/7): Does electric flux depend on Gaussian sphere radius?',
            options: ['A) Yes, directly proportional', 'B) No, depends only on enclosed charge', 'C) Inversely proportional'],
            correctOption: 'B) No, depends only on enclosed charge',
            type: 'Checkpoint'
          },
          {
            videoTitle: 'Electrostatics & Gauss Law',
            timestampSeconds: 330,
            timestampFormatted: '05:30',
            stepIndex: '2/7',
            title: 'Module overview',
            description: 'See the list of all modules with due date & progress statuses like completed, pending, etc.',
            questionText: 'In-Video Checkpoint (2/7): What is electric field inside a charged hollow conductor?',
            options: ['A) Zero', 'B) kQ/r^2', 'C) Infinite'],
            correctOption: 'A) Zero',
            type: 'Checkpoint'
          }
        ]);
      }

      const ugCount = await UpGradFeature.countDocuments();

      if (ugCount === 0) {
        await UpGradFeature.create({
          studentId: 's1',
          studentName: 'Arjun Sharma',
          studentProgressPct: 15.8,
          batchAvgProgressPct: 8.2,
          dailyGoalMins: 30,
          dailyGoalCompletedMins: 0,
          moduleProgressPct: 41.9,
          timeRemainingFormatted: '7h 5m left'
        });
      }

      const faCount = await FeeAutomation.countDocuments();

      if (faCount === 0) {
        await FeeAutomation.insertMany([
          {
            studentId: 's1',
            studentName: 'Arjun Sharma',
            rollNo: 'RVLH-2026-042',
            termName: 'Term 1 — Academic Year 2025-26',
            totalFee: 50000,
            paidFee: 25000,
            dueFee: 0,
            paymentMode: 'Online',
            receiptNo: 'REC-2026-8801',
            transactionId: 'TXN-99042817'
          },
          {
            studentId: 's1',
            studentName: 'Arjun Sharma',
            rollNo: 'RVLH-2026-042',
            termName: 'Term 2 — Academic Year 2025-26',
            totalFee: 50000,
            paidFee: 0,
            dueFee: 25000,
            paymentMode: 'ChequeDropBox',
            receiptNo: 'REC-2026-9042',
            transactionId: 'CHQ-409218',
            chequeDetails: {
              chequeNo: '409218',
              bankName: 'HDFC Bank Jayanagar',
              dropboxLocation: 'Drop Box DB-04 (Main Gate)',
              clearanceStatus: 'Pending Clearance'
            }
          }
        ]);
      }

      const p2pCount = await P2PDoubt.countDocuments();

      if (p2pCount === 0) {
        await P2PDoubt.insertMany([
          {
            studentName: 'Arjun Sharma',
            subject: 'Physics',
            moduleName: 'Module 1: Electrostatics',
            questionTitle: 'Why is electric field zero inside a hollow spherical conductor?',
            questionText: 'When a hollow metallic sphere is charged, why does all charge shift to the outer surface leaving E = 0 inside?',
            upvotes: 12,
            status: 'Resolved',
            aiSuggestedAnswer: '🤖 **AI Auto-Solver:** Charges repel each other and move as far apart as possible to minimize potential energy. In a conductor, charges can move freely, so they accumulate on the outer boundary. By Gauss Law, ∮ E·dA = Q_enc/ε₀. Since Q_enc = 0, E = 0.',
            answers: [
              {
                author: 'Rohan Gupta (Peer Mentor)',
                authorRole: 'student',
                text: 'Because electrostatic equilibrium requires zero force on free electrons inside the bulk metal. If E != 0, electrons would accelerate until E becomes 0.',
                upvotes: 8,
                isVerified: true
              },
              {
                author: 'Dr. Priya Mehta',
                authorRole: 'faculty',
                text: 'Verified! Excellent physical reasoning by Rohan.',
                upvotes: 15,
                isVerified: true
              }
            ]
          }
        ]);
      }

      const stCount = await SaaSTenant.countDocuments();

      if (stCount === 0) {
        await SaaSTenant.insertMany([
          {
            tenantName: 'RV College of Engineering',
            domain: 'rvce.edu.in',
            subdomain: 'rvce',
            plan: 'Enterprise',
            maxUsers: 5000,
            usedUsers: 4200,
            mrrAmount: 150000,
            status: 'Active',
            adminEmail: 'admin@rvce.edu.in'
          },
          {
            tenantName: 'MediaCell Institute of Tech',
            domain: 'mediacell.edu.in',
            subdomain: 'mediacell',
            plan: 'Professional',
            maxUsers: 2500,
            usedUsers: 1850,
            mrrAmount: 95000,
            status: 'Active',
            adminEmail: 'principal@mediacell.edu.in'
          },
          {
            tenantName: 'Delhi Public School Bangalore',
            domain: 'dpsbangalore.edu.in',
            subdomain: 'dpsb',
            plan: 'Starter',
            maxUsers: 1000,
            usedUsers: 890,
            mrrAmount: 45000,
            status: 'Active',
            adminEmail: 'principal@dpsb.edu.in'
          }
        ]);
      }

      const shCount = await SelfHostedConfig.countDocuments();

      if (shCount === 0) {
        await SelfHostedConfig.create({
          deploymentType: 'SelfHosted',
          serverStatus: 'Online',
          cpuUsagePct: 24,
          ramUsagePct: 28,
          diskUsagePct: 35,
          securityPatchVersion: 'v4.8.2-LMS-SECURE',
          backupLogs: [
            { backupId: 'DUMP-20260803-01', sizeMb: 42.5, timestamp: new Date() },
            { backupId: 'DUMP-20260802-01', sizeMb: 41.8, timestamp: new Date(Date.now() - 86400000) }
          ]
        });
      }

      console.log('✅ Activity Audit Logs, Badges, Live Classes, Question Bank, Video Chat AI, In-Video Quizzes, upGrad Analytics, Fee Automation, P2P Doubts, SaaS Tenants & Self-Hosted Infrastructure Seeded!');

    }
  } catch (err) {
    console.error('Error seeding activity logs:', err.message);
  }












  console.log(`✅ Seeded LMS: ${users.length} users, ${courses.length} courses, ${videos.length} videos, ${materials.length} materials.`);
}

seedData();


// ═══════════════════════════════════════════════════
// AUTH MIDDLEWARE
// ═══════════════════════════════════════════════════
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = users.find(u => u._id === decoded.id);
      if (!user) return res.status(401).json({ message: 'User not found' });
      req.user = { ...user };
      delete req.user.password;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

// ═══════════════════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════════════════
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let emailOrPhone = email.trim().toLowerCase();
    
    // Support shorthand credentials
    if (emailOrPhone === 'arjun' || emailOrPhone === 'student') {
      emailOrPhone = 'arjun@rvhub.com';
    } else if (emailOrPhone === 'priya' || emailOrPhone === 'faculty') {
      emailOrPhone = 'priya@rvhub.com';
    } else if (emailOrPhone === 'admin') {
      emailOrPhone = 'admin@rvhub.com';
    }

    const user = users.find(u => u.email.toLowerCase() === emailOrPhone || u.phone === emailOrPhone);
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    const token = generateToken(user._id);
    const profile = { ...user };
    delete profile.password;
    res.json({ token, user: profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  try {
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = {
      _id: genId(),
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'student',
      ava: name.charAt(0).toUpperCase()
    };
    
    if (newUser.role === 'student') {
      newUser.batch = req.body.batch || 'JEE Advanced (Main + KCET Decoded)';
      newUser.roll = req.body.roll || ('RV2024' + String(users.length).padStart(3, '0'));
      newUser.streak = req.body.streak || 1;
      newUser.avgScore = req.body.avgScore || 0;
      newUser.campus = req.body.campus || 'RV Jayanagar';
      newUser.gender = req.body.gender || 'Male';
      newUser.feeStatus = req.body.feeStatus || 'Paid';
      newUser.feeAmount = req.body.feeAmount || 45000;
      newUser.feePaid = req.body.feePaid || 0;
      newUser.feePending = req.body.feePending || 45000;
      newUser.feeDueDate = req.body.feeDueDate || 'Mar 31';
      newUser.feeMethod = req.body.feeMethod || '—';
      newUser.feeDate = req.body.feeDate || '—';
      newUser.st = 'active';
    } else if (newUser.role === 'faculty') {
      newUser.subject = req.body.subject || 'Physics';
      newUser.emp = req.body.emp || ('RVF' + String(users.length).padStart(3, '0'));
      newUser.campus = req.body.campus || 'RV Jayanagar';
      newUser.batch = req.body.batch || 'JEE Advanced (Main + KCET Decoded)';
      newUser.st = 'active';
    } else {
      newUser.dept = req.body.dept || 'Administration';
      newUser.emp = req.body.emp || ('RVADM' + String(users.length).padStart(3, '0'));
      newUser.campus = req.body.campus || 'RV Learning Hub HQ';
      newUser.st = 'active';
    }

    users.push(newUser);

    const token = generateToken(newUser._id);
    const profile = { ...newUser };
    delete profile.password;
    res.status(201).json({ token, user: profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/auth/profile', protect, (req, res) => {
  res.json(req.user);
});

app.put('/api/auth/profile', protect, async (req, res) => {
  const user = users.find(u => u._id === req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.email !== undefined) user.email = req.body.email;
  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.gender !== undefined) user.gender = req.body.gender;
  if (req.body.dob !== undefined) user.dob = req.body.dob;
  if (req.body.designation !== undefined) user.designation = req.body.designation;
  if (req.body.dept !== undefined) user.dept = req.body.dept;
  if (req.body.subject !== undefined) user.subject = req.body.subject;
  if (req.body.campus !== undefined) user.campus = req.body.campus;
  if (req.body.joinDate !== undefined) user.joinDate = req.body.joinDate;
  if (req.body.roll !== undefined) user.roll = req.body.roll;
  if (req.body.batch !== undefined) user.batch = req.body.batch;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  const profile = { ...user };
  delete profile.password;
  res.json(profile);
});

app.get('/api/auth/users', protect, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin only' });
  }
  const profiles = users.map(u => {
    const p = { ...u };
    delete p.password;
    return p;
  });
  res.json(profiles);
});

// ═══════════════════════════════════════════════════
// COURSES API
// ═══════════════════════════════════════════════════
app.get('/api/courses', protect, (req, res) => {
  res.json(courses);
});

app.post('/api/courses', protect, (req, res) => {
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

app.post('/api/courses/:id/enroll', protect, (req, res) => {
  const course = courses.find(c => c._id === req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  course.enrolled = true;
  res.json(course);
});

// ═══════════════════════════════════════════════════
// VIDEOS API
// ═══════════════════════════════════════════════════
app.get('/api/videos', protect, (req, res) => {
  res.json(videos);
});

app.post('/api/videos', protect, (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const { title, sub, dur, thumb } = req.body;
  const newVideo = {
    _id: genId(),
    thumb: thumb || '🎥',
    title,
    sub,
    batch: req.body.batch || 'General',
    dur: dur || '30:00',
    fac: req.user.name,
    col: '#ff6b35',
    views: 0,
    bookmarked: false,
    trending: false
  };
  videos.push(newVideo);
  res.status(201).json(newVideo);
});

app.put('/api/videos/:id/bookmark', protect, (req, res) => {
  const video = videos.find(v => v._id === req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });
  video.bookmarked = !video.bookmarked;
  res.json(video);
});

// ═══════════════════════════════════════════════════
// LIVE CLASSES API
// ═══════════════════════════════════════════════════
app.get('/api/live', protect, (req, res) => {
  res.json(liveClasses);
});

app.post('/api/live', protect, (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const { topic, sub, time, date } = req.body;
  const newLive = {
    _id: genId(),
    time: time || '12:00 PM',
    date: date || 'Today',
    sub: sub || req.user.subject || 'General',
    topic,
    fac: req.user.name,
    online: 0,
    status: 'upcoming'
  };
  liveClasses.push(newLive);
  res.status(201).json(newLive);
});

// ═══════════════════════════════════════════════════
// DOUBTS API
// ═══════════════════════════════════════════════════
app.get('/api/doubts', protect, (req, res) => {
  res.json(doubts);
});

app.post('/api/doubts', protect, (req, res) => {
  const { q, sub } = req.body;
  const newDoubt = {
    _id: genId(),
    q,
    s: 'pending',
    t: 'Just now',
    sub: sub || 'General',
    student: req.user.name,
    replies: [
      { sender: req.user.name, text: q, time: 'Just now' }
    ],
    ai: false
  };
  doubts.unshift(newDoubt);
  res.status(201).json(newDoubt);
});

app.post('/api/doubts/:id/reply', protect, (req, res) => {
  const doubt = doubts.find(d => d._id === req.params.id);
  if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
  
  const reply = {
    sender: req.user.name,
    text: req.body.text,
    time: 'Just now'
  };
  doubt.replies.push(reply);
  
  if (req.user.role === 'faculty') {
    doubt.s = 'resolved';
  }
  
  res.status(201).json(doubt);
});

app.put('/api/doubts/:id/resolve', protect, (req, res) => {
  const doubt = doubts.find(d => d._id === req.params.id);
  if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
  doubt.s = 'resolved';
  res.json(doubt);
});

// ═══════════════════════════════════════════════════
// MATERIALS API
// ═══════════════════════════════════════════════════
app.get('/api/materials', protect, (req, res) => {
  res.json(materials);
});

app.post('/api/materials', protect, (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const { name, type, sub } = req.body;
  const newMat = {
    _id: genId(),
    name,
    type: type || 'pdf',
    sub,
    fac: req.user.name,
    size: '1.5 MB',
    date: 'Just now'
  };
  materials.unshift(newMat);
  res.status(201).json(newMat);
});

// ═══════════════════════════════════════════════════
// ANNOUNCEMENTS API
// ═══════════════════════════════════════════════════
app.get('/api/announcements', protect, (req, res) => {
  res.json(announcements);
});

app.post('/api/announcements', protect, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  const { title, body, cat, urgent, target, draft } = req.body;
  const newAnn = {
    _id: genId(),
    title,
    body,
    cat: cat || 'Notice',
    date: 'Just now',
    urgent: !!urgent,
    target: target || 'all',
    draft: !!draft
  };
  announcements.unshift(newAnn);
  res.status(201).json(newAnn);
});

app.put('/api/announcements/:id', protect, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  const ann = announcements.find(a => a._id === req.params.id);
  if (!ann) return res.status(404).json({ message: 'Announcement not found' });
  
  const { title, body, cat, urgent, target, draft } = req.body;
  if (title !== undefined) ann.title = title;
  if (body !== undefined) ann.body = body;
  if (cat !== undefined) ann.cat = cat;
  if (urgent !== undefined) ann.urgent = !!urgent;
  if (target !== undefined) ann.target = target;
  if (draft !== undefined) ann.draft = !!draft;
  
  res.json(ann);
});

// ═══════════════════════════════════════════════════
// FEES API
// ═══════════════════════════════════════════════════
app.get('/api/fees', protect, (req, res) => {
  res.json(fees);
});

app.put('/api/fees/:id', protect, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  const fee = fees.find(f => f._id === req.params.id);
  if (!fee) return res.status(404).json({ message: 'Fee record not found' });
  fee.status = req.body.status || 'Paid';
  res.json(fee);
});

// ═══════════════════════════════════════════════════
// ATTENDANCE API
// ═══════════════════════════════════════════════════
app.get('/api/attendance', protect, (req, res) => {
  res.json(attendance);
});

app.post('/api/attendance', protect, (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const { date, status, sub, topic } = req.body;
  const newAtt = {
    _id: genId(),
    date: date || '2026-06-24',
    status: status || 'Present',
    sub: sub || 'Physics',
    topic: topic || 'General'
  };
  attendance.unshift(newAtt);
  res.status(201).json(newAtt);
});

// ═══════════════════════════════════════════════════
// LEADERBOARD API
// ═══════════════════════════════════════════════════
app.get('/api/leaderboard', protect, (req, res) => {
  res.json(leaderboard);
});

// ═══════════════════════════════════════════════════
// NEW CRUD APIs (User Management, Courses, Media, Quiz, Payments)
// ═══════════════════════════════════════════════════

// User CRUD
app.put('/api/auth/users/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const user = users.find(u => u._id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.email !== undefined) user.email = req.body.email;
  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.gender !== undefined) user.gender = req.body.gender;
  if (req.body.dob !== undefined) user.dob = req.body.dob;
  if (req.body.designation !== undefined) user.designation = req.body.designation;
  if (req.body.dept !== undefined) user.dept = req.body.dept;
  if (req.body.subject !== undefined) user.subject = req.body.subject;
  if (req.body.campus !== undefined) user.campus = req.body.campus;
  if (req.body.joinDate !== undefined) user.joinDate = req.body.joinDate;
  if (req.body.roll !== undefined) user.roll = req.body.roll;
  if (req.body.batch !== undefined) user.batch = req.body.batch;
  if (req.body.feeStatus !== undefined) user.feeStatus = req.body.feeStatus;
  if (req.body.feeAmount !== undefined) user.feeAmount = Number(req.body.feeAmount);
  if (req.body.feePaid !== undefined) user.feePaid = Number(req.body.feePaid);
  if (req.body.feePending !== undefined) user.feePending = Number(req.body.feePending);

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  const profile = { ...user };
  delete profile.password;
  res.json(profile);
});

app.put('/api/auth/users/:id/status', protect, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const user = users.find(u => u._id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (req.body.st !== undefined) {
    user.st = req.body.st;
  } else {
    user.st = user.st === 'active' ? 'warning' : 'active';
  }
  res.json(user);
});

app.delete('/api/auth/users/:id', protect, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const idx = users.findIndex(u => u._id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'User not found' });
  users.splice(idx, 1);
  res.json({ message: 'User deleted successfully' });
});

// Course CRUD Updates
app.put('/api/courses/:id', protect, (req, res) => {
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

app.put('/api/courses/:id/status', protect, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const course = courses.find(c => c._id === req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  course.pub = !course.pub;
  res.json(course);
});

app.delete('/api/courses/:id', protect, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const idx = courses.findIndex(c => c._id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Course not found' });
  courses.splice(idx, 1);
  res.json({ message: 'Course deleted successfully' });
});

// Media Edit / Update
app.put('/api/videos/:id', protect, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'faculty') return res.status(403).json({ message: 'Unauthorized' });
  const video = videos.find(v => v._id === req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });
  const { title, sub, dur, batch } = req.body;
  if (title !== undefined) video.title = title;
  if (sub !== undefined) video.sub = sub;
  if (dur !== undefined) video.dur = dur;
  if (batch !== undefined) video.batch = batch;
  res.json(video);
});

app.put('/api/materials/:id', protect, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'faculty') return res.status(403).json({ message: 'Unauthorized' });
  const material = materials.find(m => m._id === req.params.id);
  if (!material) return res.status(404).json({ message: 'Material not found' });
  const { title, name, type, sub, size, batch } = req.body;
  if (name !== undefined) material.name = name;
  else if (title !== undefined) material.name = title;
  if (type !== undefined) material.type = type;
  if (sub !== undefined) material.sub = sub;
  if (size !== undefined) material.size = size;
  if (batch !== undefined) material.batch = batch;
  res.json(material);
});

// Media Deletion
app.delete('/api/videos/:id', protect, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'faculty') return res.status(403).json({ message: 'Unauthorized' });
  const idx = videos.findIndex(v => v._id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Video not found' });
  videos.splice(idx, 1);
  res.json({ message: 'Video deleted' });
});

app.delete('/api/materials/:id', protect, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'faculty') return res.status(403).json({ message: 'Unauthorized' });
  const idx = materials.findIndex(m => m._id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Material not found' });
  materials.splice(idx, 1);
  res.json({ message: 'Material deleted' });
});

// Quiz Results
app.get('/api/quiz-results', protect, (req, res) => {
  res.json(quizResults);
});

app.post('/api/quiz-results', protect, (req, res) => {
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
app.get('/api/payments', protect, (req, res) => {
  res.json(payments);
});

app.post('/api/payments', protect, (req, res) => {
  const { roll, amount, method, type, date, item, notes } = req.body;
  
  // Find student to update their fee balances
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

// ═══════════════════════════════════════════════════
// ROLE-SEPARATED ACTIVITY AUDIT LOG ENDPOINTS
// ═══════════════════════════════════════════════════
app.get('/api/activities/admin', async (req, res) => {
  try {
    if (isMongoConnected) {
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

app.get('/api/activities/superadmin', async (req, res) => {
  try {
    if (isMongoConnected) {
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

app.get('/api/activities/users', async (req, res) => {
  try {
    if (isMongoConnected) {
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

// ═══════════════════════════════════════════════════
// EDCHEMY PARENT & ACADEMIC PORTAL ENDPOINTS
// ═══════════════════════════════════════════════════
app.get('/api/leaves', async (req, res) => {
  try {
    if (isMongoConnected) {
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

app.post('/api/leaves', async (req, res) => {
  try {
    const { studentId, studentName, parentName, startDate, endDate, reason } = req.body;
    if (isMongoConnected) {
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

app.get('/api/sibling-admissions', async (req, res) => {
  try {
    if (isMongoConnected) {
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

app.post('/api/sibling-admissions', async (req, res) => {
  try {
    const { parentName, parentEmail, parentPhone, siblingName, dob, gradeApplying, previousSchool } = req.body;
    const applicationNo = 'SIB-2026-' + String(Math.floor(100 + Math.random() * 900));
    if (isMongoConnected) {
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

app.get('/api/marks-cards', async (req, res) => {
  try {
    if (isMongoConnected) {
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

app.get('/api/calendar-events', async (req, res) => {
  try {
    if (isMongoConnected) {
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

// ═══════════════════════════════════════════════════
// PARENT SMS & WHATSAPP DISPATCHER ENDPOINTS
// ═══════════════════════════════════════════════════
app.post('/api/notify-parent', async (req, res) => {
  try {
    const { studentName, parentPhone, channel, type, messageText } = req.body;
    if (!studentName || !parentPhone || !messageText) {
      return res.status(400).json({ message: 'Missing required notification details' });
    }
    let logRecord = { studentName, parentPhone, channel: channel || 'WhatsApp', type: type || 'Attendance', messageText, status: 'Sent' };
    if (isMongoConnected) {
      logRecord = await MessageLog.create(logRecord);
    }
    res.status(201).json({ message: `${channel || 'WhatsApp'} message dispatched to parent!`, data: logRecord });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/notify-parent/logs', async (req, res) => {
  try {
    if (isMongoConnected) {
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

// ═══════════════════════════════════════════════════
// BADGES & STUDENT JOURNEY ENDPOINTS
// ═══════════════════════════════════════════════════
app.get('/api/badges', async (req, res) => {
  try {
    if (isMongoConnected) {
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

app.get('/api/student-journey', (req, res) => {
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

// ═══════════════════════════════════════════════════
// REAL-TIME LIVE CLASSES & WATCHING NOW ENDPOINTS
// ═══════════════════════════════════════════════════
app.get('/api/live', async (req, res) => {
  try {
    if (isMongoConnected) {
      const classes = await LiveClass.find().sort({ createdAt: -1 });
      return res.json(classes);
    }
    res.json([
      {
        _id: 'live1',
        topic: 'Electrostatics: Gauss Law & Spherical Shells',
        subject: 'Physics',
        faculty: 'Dr. Priya Mehta',
        status: 'ongoing',
        onlineViewers: 142,
        scheduledTime: 'LIVE NOW',
        chatMessages: [
          { sender: 'Dr. Priya Mehta', role: 'faculty', text: 'Welcome everyone! Today we are deriving Gauss Law.', time: '10:00 AM' },
          { sender: 'Arjun Sharma', role: 'student', text: 'Does flux depend on Gaussian sphere radius?', time: '10:05 AM' }
        ]
      },
      {
        _id: 'live2',
        topic: 'Aldehydes & Ketones: Reaction Mechanisms',
        subject: 'Chemistry',
        faculty: 'Prof. Amit Singh',
        status: 'upcoming',
        onlineViewers: 0,
        scheduledTime: '11:30 AM',
        chatMessages: []
      }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/live/:id/heartbeat', async (req, res) => {
  try {
    const { action } = req.body; // 'join', 'leave', or 'ping'
    if (isMongoConnected) {
      const liveSession = await LiveClass.findById(req.params.id);
      if (liveSession) {
        if (action === 'join') liveSession.onlineViewers += 1;
        else if (action === 'leave' && liveSession.onlineViewers > 0) liveSession.onlineViewers -= 1;
        else liveSession.onlineViewers += Math.floor(Math.random() * 3) - 1; // minor pulse fluctuation
        if (liveSession.onlineViewers < 1) liveSession.onlineViewers = 1;
        await liveSession.save();
        return res.json({ onlineViewers: liveSession.onlineViewers });
      }
    }
    res.json({ onlineViewers: 145 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/live/:id/chat', async (req, res) => {
  try {
    const { sender, role, text } = req.body;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { sender: sender || 'Arjun Sharma', role: role || 'student', text, time: now, timestamp: new Date() };

    if (isMongoConnected) {
      const liveSession = await LiveClass.findById(req.params.id);
      if (liveSession) {
        liveSession.chatMessages.push(newMsg);
        await liveSession.save();
        return res.status(201).json(newMsg);
      }
    }
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ═══════════════════════════════════════════════════
// MODULE-BASED QUESTION BANK GENERATOR ENDPOINTS
// ═══════════════════════════════════════════════════
app.get('/api/question-bank', async (req, res) => {
  try {
    const { subject, moduleName, difficulty } = req.query;
    let query = {};
    if (subject && subject !== 'All Subjects') query.subject = subject;
    if (moduleName && moduleName !== 'All Modules') query.moduleName = moduleName;
    if (difficulty && difficulty !== 'All Difficulties') query.difficulty = difficulty;

    if (isMongoConnected) {
      const questions = await QuestionBank.find(query).sort({ createdAt: -1 });
      return res.json(questions);
    }
    res.json([
      {
        _id: 'qb1',
        subject: 'Physics',
        moduleName: 'Module 1: Electrostatics & Gauss Law',
        questionText: 'Electric flux through a closed Gaussian surface enclosing a dipole of charges +q and -q is:',
        options: ['Zero', 'q / epsilon_0', '2q / epsilon_0', 'Infinity'],
        correctOption: 'Zero',
        difficulty: 'Easy',
        type: 'MCQ',
        solutionExplanation: 'Net charge enclosed by Gaussian surface is (+q) + (-q) = 0. By Gauss Law, total electric flux = Q_enclosed / epsilon_0 = 0.',
        createdBy: 'Dr. Priya Mehta'
      },
      {
        _id: 'qb2',
        subject: 'Physics',
        moduleName: 'Module 1: Electrostatics & Gauss Law',
        questionText: 'A thin conducting spherical shell of radius R carries charge Q. The electric field at distance r (r < R) from center is:',
        options: ['Zero', 'kQ / r^2', 'kQ / R^2', 'kQ / r'],
        correctOption: 'Zero',
        difficulty: 'Medium',
        type: 'MCQ',
        solutionExplanation: 'Inside a conducting spherical shell, charge resides on outer surface. Thus, enclosed charge = 0, making E = 0.',
        createdBy: 'Dr. Priya Mehta'
      }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/question-bank/generate', async (req, res) => {
  try {
    const { subject, moduleName, difficulty, count } = req.body;
    let query = {};
    if (subject && subject !== 'All Subjects') query.subject = subject;
    if (moduleName && moduleName !== 'All Modules') query.moduleName = moduleName;
    if (difficulty && difficulty !== 'All Difficulties') query.difficulty = difficulty;

    const limit = parseInt(count) || 5;

    if (isMongoConnected) {
      const questions = await QuestionBank.find(query).limit(limit);
      return res.json({ title: `${subject || 'Custom'} ${moduleName || 'Question Paper'}`, questions });
    }

    res.json({
      title: `${subject || 'Physics'} Question Paper`,
      questions: [
        {
          _id: 'qb1',
          subject: subject || 'Physics',
          moduleName: moduleName || 'Module 1: Electrostatics & Gauss Law',
          questionText: 'Electric flux through a closed Gaussian surface enclosing a dipole of charges +q and -q is:',
          options: ['Zero', 'q / epsilon_0', '2q / epsilon_0', 'Infinity'],
          correctOption: 'Zero',
          difficulty: difficulty || 'Easy',
          type: 'MCQ',
          solutionExplanation: 'Net charge enclosed by Gaussian surface is (+q) + (-q) = 0. By Gauss Law, flux = 0.',
          createdBy: 'Dr. Priya Mehta'
        }
      ]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/question-bank/add', async (req, res) => {
  try {
    const { subject, moduleName, questionText, options, correctOption, difficulty, type, solutionExplanation, createdBy } = req.body;
    if (!subject || !moduleName || !questionText || !correctOption) {
      return res.status(400).json({ message: 'Missing required question fields' });
    }
    let newQ = { subject, moduleName, questionText, options: options || [], correctOption, difficulty: difficulty || 'Medium', type: type || 'MCQ', solutionExplanation: solutionExplanation || 'Refer standard textbook', createdBy: createdBy || 'Faculty' };
    if (isMongoConnected) {
      newQ = await QuestionBank.create(newQ);
    }
    res.status(201).json({ message: 'Question added to module bank!', question: newQ });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ═══════════════════════════════════════════════════
// CHAT WITH VIDEO AI ASSISTANT ENDPOINTS
// ═══════════════════════════════════════════════════
app.post('/api/video-chat', async (req, res) => {
  try {
    const { videoTitle, userQuery, currentTimeMark, studentName } = req.body;
    if (!videoTitle || !userQuery) {
      return res.status(400).json({ message: 'Missing videoTitle or userQuery' });
    }

    let aiResponse = '';
    const qLower = userQuery.toLowerCase();
    const timeMark = currentTimeMark || '12:45';

    if (qLower.includes('summarize') || qLower.includes('summary')) {
      aiResponse = `🤖 **AI Video Assistant:** Here is the key summary for **"${videoTitle}"**:\n\n• **[⏱️ 00:00 - 05:15]** Introduction & Fundamental Definitions.\n• **[⏱️ 12:45 - 28:30]** Derivation of Gauss Law for conducting spherical shells.\n• **[⏱️ 34:10 - 48:00]** Solved JEE Advanced numerical examples on electric flux & charge density.`;
    } else if (qLower.includes('quiz') || qLower.includes('question')) {
      aiResponse = `🤖 **AI Video Practice Quiz for "${videoTitle}":**\n\n1. What is the electric field inside a charged spherical conductor of radius R at distance r < R?\n   *(Hint: Check timestamp [⏱️ 12:45])*`;
    } else {
      aiResponse = `🤖 **AI Video Assistant:** At timestamp **[⏱️ ${timeMark}]** in *"${videoTitle}"*, the instructor explains that the enclosed charge determines the net flux. For your question *"${userQuery}"*, remember that electric flux is independent of the radius of the Gaussian surface.`;
    }

    let record = { videoTitle, studentName: studentName || 'Arjun Sharma', userQuery, aiResponse, timestampMark: timeMark, subject: 'Physics' };
    if (isMongoConnected) {
      record = await VideoChatLog.create(record);
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/video-chat/history', async (req, res) => {
  try {
    const { videoTitle } = req.query;
    let query = {};
    if (videoTitle) query.videoTitle = videoTitle;

    if (isMongoConnected) {
      const logs = await VideoChatLog.find(query).sort({ createdAt: 1 });
      return res.json(logs);
    }
    res.json([
      {
        videoTitle: videoTitle || 'Electrostatics & Gauss Law',
        studentName: 'Arjun Sharma',
        userQuery: 'Summarize Gauss Law proof for spherical shell',
        aiResponse: '🤖 **AI Video Assistant:** At [⏱️ 12:45], Dr. Priya Mehta proves Gauss Law for a conducting spherical shell of radius R. Since all charge resides on outer surface, enclosed charge Q_enc = 0 for r < R, making E = 0.',
        timestampMark: '12:45'
      }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ═══════════════════════════════════════════════════
// IN-VIDEO CHECKPOINT QUIZZES & SURVEYS ENDPOINTS
// ═══════════════════════════════════════════════════
app.get('/api/in-video-quizzes', async (req, res) => {
  try {
    const { videoTitle } = req.query;
    let query = {};
    if (videoTitle) query.videoTitle = videoTitle;

    if (isMongoConnected) {
      const quizzes = await InVideoQuiz.find(query).sort({ timestampSeconds: 1 });
      return res.json(quizzes);
    }

    res.json([
      {
        videoTitle: videoTitle || 'Electrostatics & Gauss Law',
        timestampSeconds: 135,
        timestampFormatted: '02:15',
        stepIndex: '1/7',
        title: 'Course overview',
        description: 'Switch between courses & get course information with progress',
        questionText: 'In-Video Checkpoint (1/7): Does electric flux depend on Gaussian sphere radius?',
        options: ['A) Yes, directly proportional', 'B) No, depends only on enclosed charge', 'C) Inversely proportional'],
        correctOption: 'B) No, depends only on enclosed charge',
        type: 'Checkpoint'
      },
      {
        videoTitle: videoTitle || 'Electrostatics & Gauss Law',
        timestampSeconds: 330,
        timestampFormatted: '05:30',
        stepIndex: '2/7',
        title: 'Module overview',
        description: 'See the list of all modules with due date & progress statuses like completed, pending, etc.',
        questionText: 'In-Video Checkpoint (2/7): What is electric field inside a charged hollow conductor?',
        options: ['A) Zero', 'B) kQ/r^2', 'C) Infinite'],
        correctOption: 'A) Zero',
        type: 'Checkpoint'
      }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/in-video-quizzes/submit', (req, res) => {
  const { selectedOption, stepIndex } = req.body;
  res.json({ message: `Response for step ${stepIndex || '1/7'} submitted!`, success: true });
});

// ═══════════════════════════════════════════════════
// UPGRAD ANALYTICS BENCHMARK & DAILY GOAL ENDPOINTS
// ═══════════════════════════════════════════════════
app.get('/api/upgrad-analytics', async (req, res) => {
  try {
    if (isMongoConnected) {
      const data = await UpGradFeature.findOne({ studentId: 's1' });
      if (data) return res.json(data);
    }
    res.json({
      studentName: 'Arjun Sharma',
      studentProgressPct: 15.8,
      batchAvgProgressPct: 8.2,
      dailyGoalMins: 30,
      dailyGoalCompletedMins: 15,
      moduleProgressPct: 41.9,
      timeRemainingFormatted: '7h 5m left'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/upgrad-analytics/log-time', async (req, res) => {
  try {
    const { mins } = req.body;
    const addedMins = parseInt(mins) || 15;

    if (isMongoConnected) {
      let record = await UpGradFeature.findOne({ studentId: 's1' });
      if (!record) {
        record = new UpGradFeature({ studentId: 's1' });
      }
      record.dailyGoalCompletedMins += addedMins;
      if (record.dailyGoalCompletedMins > record.dailyGoalMins) {
        record.dailyGoalCompletedMins = record.dailyGoalMins;
      }
      await record.save();
      return res.json(record);
    }

    res.json({
      studentName: 'Arjun Sharma',
      studentProgressPct: 15.8,
      batchAvgProgressPct: 8.2,
      dailyGoalMins: 30,
      dailyGoalCompletedMins: 15,
      moduleProgressPct: 41.9,
      timeRemainingFormatted: '7h 5m left'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ═══════════════════════════════════════════════════
// FEE AUTOMATION (ONLINE, OTC, CHEQUE DROP BOX) ENDPOINTS
// ═══════════════════════════════════════════════════
app.get('/api/fee-automation', async (req, res) => {
  try {
    if (isMongoConnected) {
      const fees = await FeeAutomation.find({ studentId: 's1' }).sort({ createdAt: -1 });
      if (fees && fees.length) return res.json(fees);
    }

    res.json([
      {
        studentId: 's1',
        studentName: 'Arjun Sharma',
        rollNo: 'RVLH-2026-042',
        termName: 'Term 1 — Academic Year 2025-26',
        totalFee: 50000,
        paidFee: 25000,
        dueFee: 0,
        paymentMode: 'Online',
        receiptNo: 'REC-2026-8801',
        transactionId: 'TXN-99042817'
      },
      {
        studentId: 's1',
        studentName: 'Arjun Sharma',
        rollNo: 'RVLH-2026-042',
        termName: 'Term 2 — Academic Year 2025-26',
        totalFee: 50000,
        paidFee: 0,
        dueFee: 25000,
        paymentMode: 'ChequeDropBox',
        receiptNo: 'REC-2026-9042',
        transactionId: 'CHQ-409218',
        chequeDetails: {
          chequeNo: '409218',
          bankName: 'HDFC Bank Jayanagar',
          dropboxLocation: 'Drop Box DB-04 (Main Gate)',
          clearanceStatus: 'Pending Clearance'
        }
      }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/fee-automation/pay-online', async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const paidAmt = parseInt(amount) || 25000;
    const recNo = 'REC-2026-' + Math.floor(1000 + Math.random() * 9000);
    const txnId = 'RAZORPAY-' + Math.floor(10000000 + Math.random() * 90000000);

    let newRec = {
      studentId: 's1',
      studentName: 'Arjun Sharma',
      rollNo: 'RVLH-2026-042',
      termName: 'Term 2 — Academic Year 2025-26',
      totalFee: 50000,
      paidFee: paidAmt,
      dueFee: 0,
      paymentMode: 'Online',
      receiptNo: recNo,
      transactionId: txnId
    };

    if (isMongoConnected) {
      newRec = await FeeAutomation.create(newRec);
    }

    res.status(201).json({ message: 'Online Fee Payment Successful!', receipt: newRec });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/fee-automation/record-otc', async (req, res) => {
  try {
    const { amount, accountantName } = req.body;
    const paidAmt = parseInt(amount) || 25000;
    const recNo = 'OTC-2026-' + Math.floor(1000 + Math.random() * 9000);
    const txnId = 'CASH-' + Math.floor(100000 + Math.random() * 900000);

    let newRec = {
      studentId: 's1',
      studentName: 'Arjun Sharma',
      rollNo: 'RVLH-2026-042',
      termName: 'Term 2 — Academic Year 2025-26',
      totalFee: 50000,
      paidFee: paidAmt,
      dueFee: 0,
      paymentMode: 'OverTheCounter',
      receiptNo: recNo,
      transactionId: txnId
    };

    if (isMongoConnected) {
      newRec = await FeeAutomation.create(newRec);
    }

    res.status(201).json({ message: 'Over-the-Counter Payment Recorded!', receipt: newRec });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/fee-automation/cheque-drop', async (req, res) => {
  try {
    const { chequeNo, bankName, dropboxLocation } = req.body;
    const recNo = 'CHQ-REC-' + Math.floor(1000 + Math.random() * 9000);

    let newRec = {
      studentId: 's1',
      studentName: 'Arjun Sharma',
      rollNo: 'RVLH-2026-042',
      termName: 'Term 2 — Academic Year 2025-26',
      totalFee: 50000,
      paidFee: 0,
      dueFee: 25000,
      paymentMode: 'ChequeDropBox',
      receiptNo: recNo,
      transactionId: 'CHQ-' + (chequeNo || '409218'),
      chequeDetails: {
        chequeNo: chequeNo || '409218',
        bankName: bankName || 'HDFC Bank',
        dropboxLocation: dropboxLocation || 'Drop Box DB-04',
        clearanceStatus: 'Pending Clearance'
      }
    };

    if (isMongoConnected) {
      newRec = await FeeAutomation.create(newRec);
    }

    res.status(201).json({ message: 'Cheque Deposit Recorded into Drop Box!', receipt: newRec });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ═══════════════════════════════════════════════════
// DOUBTS & PEER-TO-PEER (P2P) FORUM ENDPOINTS
// ═══════════════════════════════════════════════════
app.get('/api/p2p-doubts', async (req, res) => {
  try {
    const { subject, status } = req.query;
    let query = {};
    if (subject && subject !== 'All Subjects') query.subject = subject;
    if (status && status !== 'All Status') query.status = status;

    if (isMongoConnected) {
      const doubts = await P2PDoubt.find(query).sort({ createdAt: -1 });
      if (doubts && doubts.length) return res.json(doubts);
    }

    res.json([
      {
        _id: 'p2p-1',
        studentName: 'Arjun Sharma',
        subject: 'Physics',
        moduleName: 'Module 1: Electrostatics',
        questionTitle: 'Why is electric field zero inside a hollow spherical conductor?',
        questionText: 'When a hollow metallic sphere is charged, why does all charge shift to the outer surface leaving E = 0 inside?',
        upvotes: 12,
        status: 'Resolved',
        aiSuggestedAnswer: '🤖 **AI Auto-Solver:** Charges repel each other and move as far apart as possible to minimize potential energy. In a conductor, charges can move freely, so they accumulate on the outer boundary. By Gauss Law, ∮ E·dA = Q_enc/ε₀. Since Q_enc = 0, E = 0.',
        answers: [
          {
            author: 'Rohan Gupta (Peer Mentor)',
            authorRole: 'student',
            text: 'Because electrostatic equilibrium requires zero force on free electrons inside the bulk metal. If E != 0, electrons would accelerate until E becomes 0.',
            upvotes: 8,
            isVerified: true
          },
          {
            author: 'Dr. Priya Mehta',
            authorRole: 'faculty',
            text: 'Verified! Excellent physical reasoning by Rohan.',
            upvotes: 15,
            isVerified: true
          }
        ]
      }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/p2p-doubts/ask', async (req, res) => {
  try {
    const { subject, moduleName, questionTitle, questionText, studentName } = req.body;
    if (!subject || !questionTitle || !questionText) {
      return res.status(400).json({ message: 'Missing subject or question content' });
    }

    const aiAnswer = `🤖 **AI Auto-Solver:** For "${questionTitle}", remember that in ${subject}, fundamental principles dictate step-by-step balance. Step 1: Write down given parameters. Step 2: Apply core conservation equations. Step 3: Solve for unknown variables.`;

    let doubt = {
      studentName: studentName || 'Arjun Sharma',
      subject,
      moduleName: moduleName || 'Module 1',
      questionTitle,
      questionText,
      upvotes: 1,
      status: 'Resolved',
      aiSuggestedAnswer: aiAnswer,
      answers: []
    };

    if (isMongoConnected) {
      doubt = await P2PDoubt.create(doubt);
    }

    res.status(201).json({ message: 'Doubt posted successfully with AI resolution!', doubt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/p2p-doubts/:id/answer', async (req, res) => {
  try {
    const { id } = req.params;
    const { author, authorRole, text } = req.body;

    let ans = { author: author || 'Student Peer', authorRole: authorRole || 'student', text: text || 'Standard peer explanation', upvotes: 1, isVerified: false };

    if (isMongoConnected && id !== 'p2p-1') {
      const d = await P2PDoubt.findById(id);
      if (d) {
        d.answers.push(ans);
        d.status = 'Resolved';
        await d.save();
      }
    }

    res.status(201).json({ message: 'Peer answer posted! +10 Peer Karma Points awarded 🏅', answer: ans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ═══════════════════════════════════════════════════
// MULTI-TENANT SAAS PLATFORM ENDPOINTS
// ═══════════════════════════════════════════════════
app.get('/api/saas/tenants', async (req, res) => {
  try {
    if (isMongoConnected) {
      const tenants = await SaaSTenant.find({}).sort({ createdAt: -1 });
      if (tenants && tenants.length) return res.json(tenants);
    }

    res.json([
      {
        _id: 't-1',
        tenantName: 'RV College of Engineering',
        domain: 'rvce.edu.in',
        subdomain: 'rvce',
        plan: 'Enterprise',
        maxUsers: 5000,
        usedUsers: 4200,
        mrrAmount: 150000,
        status: 'Active',
        adminEmail: 'admin@rvce.edu.in'
      },
      {
        _id: 't-2',
        tenantName: 'MediaCell Institute of Tech',
        domain: 'mediacell.edu.in',
        subdomain: 'mediacell',
        plan: 'Professional',
        maxUsers: 2500,
        usedUsers: 1850,
        mrrAmount: 95000,
        status: 'Active',
        adminEmail: 'principal@mediacell.edu.in'
      },
      {
        _id: 't-3',
        tenantName: 'Delhi Public School Bangalore',
        domain: 'dpsbangalore.edu.in',
        subdomain: 'dpsb',
        plan: 'Starter',
        maxUsers: 1000,
        usedUsers: 890,
        mrrAmount: 45000,
        status: 'Active',
        adminEmail: 'principal@dpsb.edu.in'
      }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/saas/tenants/onboard', async (req, res) => {
  try {
    const { tenantName, domain, subdomain, plan, maxUsers, adminEmail } = req.body;
    if (!tenantName || !domain || !subdomain || !adminEmail) {
      return res.status(400).json({ message: 'Missing required SaaS tenant parameters' });
    }

    const planTier = plan || 'Enterprise';
    const mrr = planTier === 'Enterprise' ? 150000 : planTier === 'Professional' ? 95000 : 45000;

    let tenant = {
      tenantName,
      domain,
      subdomain,
      plan: planTier,
      maxUsers: parseInt(maxUsers) || 5000,
      usedUsers: 1,
      mrrAmount: mrr,
      status: 'Active',
      adminEmail
    };

    if (isMongoConnected) {
      tenant = await SaaSTenant.create(tenant);
    }

    res.status(201).json({ message: `Tenant Institution "${tenantName}" Onboarded Successfully! 🏢`, tenant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/saas/metrics', async (req, res) => {
  try {
    res.json({
      totalMRR: '₹4,50,000 / mo',
      activeTenants: 12,
      totalActiveLicenses: '24,500 Students',
      avgRenewalRate: '98.4%'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ═══════════════════════════════════════════════════
// IN-HOUSE LMS (SELF-HOSTED) INFRASTRUCTURE ENDPOINTS
// ═══════════════════════════════════════════════════
app.get('/api/in-house/status', async (req, res) => {
  try {
    if (isMongoConnected) {
      const config = await SelfHostedConfig.findOne({});
      if (config) return res.json(config);
    }

    res.json({
      deploymentType: 'SelfHosted',
      serverStatus: 'Online',
      cpuUsagePct: 24,
      ramUsagePct: 28,
      diskUsagePct: 35,
      securityPatchVersion: 'v4.8.2-LMS-SECURE',
      backupLogs: [
        { backupId: 'DUMP-20260803-01', sizeMb: 42.5, timestamp: new Date() },
        { backupId: 'DUMP-20260802-01', sizeMb: 41.8, timestamp: new Date(Date.now() - 86400000) }
      ]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/in-house/backup', async (req, res) => {
  try {
    const backupId = 'DUMP-' + new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 12);
    const newLog = { backupId, sizeMb: 43.2, timestamp: new Date() };

    if (isMongoConnected) {
      let cfg = await SelfHostedConfig.findOne({});
      if (!cfg) cfg = new SelfHostedConfig({});
      cfg.backupLogs.unshift(newLog);
      cfg.lastBackupTimestamp = new Date();
      await cfg.save();
    }

    res.status(201).json({ message: `Automated Database Backup "${backupId}" Completed! 💾`, backup: newLog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/in-house/toggle-maintenance', async (req, res) => {
  try {
    let newStatus = 'Online';
    if (isMongoConnected) {
      let cfg = await SelfHostedConfig.findOne({});
      if (!cfg) cfg = new SelfHostedConfig({});
      cfg.serverStatus = cfg.serverStatus === 'Online' ? 'Maintenance' : 'Online';
      newStatus = cfg.serverStatus;
      await cfg.save();
    }

    res.json({ message: `In-House Server Status updated to: ${newStatus}`, status: newStatus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/in-house/switch-deployment', async (req, res) => {
  try {
    const { mode } = req.body;
    let target = mode || 'SelfHosted';

    if (isMongoConnected) {
      let cfg = await SelfHostedConfig.findOne({});
      if (!cfg) cfg = new SelfHostedConfig({});
      cfg.deploymentType = target;
      await cfg.save();
    }

    res.json({ message: `Deployment Mode switched to: ${target}`, deploymentType: target });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});













// Root Route
app.get('/', (req, res) => {
  res.send('🎓 RV Learning Hub LMS API Server Running');
});

// Start Server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🎓 LMS Server listening on port ${PORT}`);
  });
}

module.exports = app;


