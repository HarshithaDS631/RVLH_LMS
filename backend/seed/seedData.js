const bcrypt = require('bcryptjs');
const { getMongoStatus } = require('../config/db');
const {
  genId, users, courses, videos, liveClasses, doubts, materials,
  announcements, quizResults, payments
} = require('../data/store');

const AdminActivity = require('../models/AdminActivity');
const SuperAdminActivity = require('../models/SuperAdminActivity');
const UserActivity = require('../models/UserActivity');
const LeaveRequest = require('../models/LeaveRequest');
const SiblingAdmission = require('../models/SiblingAdmission');
const MarksCard = require('../models/MarksCard');
const CalendarEvent = require('../models/CalendarEvent');
const Badge = require('../models/Badge');
const LiveClass = require('../models/LiveClass');
const QuestionBank = require('../models/QuestionBank');
const VideoChatLog = require('../models/VideoChatLog');
const InVideoQuiz = require('../models/InVideoQuiz');
const UpGradFeature = require('../models/UpGradFeature');
const FeeAutomation = require('../models/FeeAutomation');
const P2PDoubt = require('../models/P2PDoubt');
const SaaSTenant = require('../models/SaaSTenant');
const SelfHostedConfig = require('../models/SelfHostedConfig');

async function seedData() {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('student123', salt);
  const facHash = await bcrypt.hash('faculty123', salt);
  const admHash = await bcrypt.hash('admin123', salt);

  // Clear array references if re-run
  users.length = 0;
  courses.length = 0;
  videos.length = 0;
  liveClasses.length = 0;
  doubts.length = 0;
  materials.length = 0;
  announcements.length = 0;
  quizResults.length = 0;
  payments.length = 0;

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
    courses.push({ _id: genId(), ...c });
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

  videoSeeds.forEach(v => { videos.push({ _id: genId(), ...v }); });

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

  materialSeeds.forEach(m => { materials.push({ _id: genId(), ...m }); });

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

  quizSeeds.forEach(q => { quizResults.push({ _id: genId(), ...q }); });

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

  paymentSeeds.forEach(p => { payments.push({ _id: genId(), ...p }); });

  // 10. Seed Mongo models if connected
  try {
    if (getMongoStatus()) {
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
            studentId: 's1', studentName: 'Arjun Sharma', roll: 'RV2024001', term: 'Mid-Term Examination 2024-25',
            subjects: [
              { name: 'Physics', marksObtained: 92, maxMarks: 100, grade: 'A+', teacherName: 'Dr. Priya Mehta', remark: 'Excellent understanding of Mechanics & Gauss Law.' },
              { name: 'Chemistry', marksObtained: 84, maxMarks: 100, grade: 'A', teacherName: 'Prof. Amit Singh', remark: 'Good performance in Organic Reactions.' },
              { name: 'Mathematics', marksObtained: 88, maxMarks: 100, grade: 'A+', teacherName: 'Mr. Raj Sharma', remark: 'Strong analytical skills in Calculus.' }
            ],
            totalObtained: 264, totalMax: 300, percentile: 96.8, classRank: '3rd in Batch', overallGrade: 'Distinction (A+)', issueDate: 'Mar 15, 2025'
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
            topic: 'Electrostatics: Gauss Law & Spherical Shells', subject: 'Physics', faculty: 'Dr. Priya Mehta', status: 'ongoing', onlineViewers: 142, scheduledTime: 'LIVE NOW', scheduledDate: 'Today', streamUrl: 'https://www.youtube.com/embed/3JIpN8nnPoM',
            chatMessages: [
              { sender: 'Dr. Priya Mehta', role: 'faculty', text: 'Welcome everyone! Today we are deriving Gauss Law for non-uniform charge distributions.', time: '10:00 AM' },
              { sender: 'Arjun Sharma', role: 'student', text: 'Dr. Priya, does electric flux depend on the radius of the gaussian sphere?', time: '10:05 AM' },
              { sender: 'Dr. Priya Mehta', role: 'faculty', text: 'No Arjun, flux depends strictly on total enclosed charge divided by epsilon_0!', time: '10:06 AM' }
            ]
          },
          { topic: 'Aldehydes & Ketones: Reaction Mechanisms', subject: 'Chemistry', faculty: 'Prof. Amit Singh', status: 'upcoming', onlineViewers: 0, scheduledTime: '11:30 AM', scheduledDate: 'Today', streamUrl: 'https://www.youtube.com/embed/3JIpN8nnPoM', chatMessages: [] },
          { topic: 'Integration by Parts: Advanced Shortcuts', subject: 'Mathematics', faculty: 'Mr. Raj Sharma', status: 'upcoming', onlineViewers: 0, scheduledTime: '02:00 PM', scheduledDate: 'Today', streamUrl: 'https://www.youtube.com/embed/3JIpN8nnPoM', chatMessages: [] }
        ]);
      }

      const qbCount = await QuestionBank.countDocuments();
      if (qbCount === 0) {
        await QuestionBank.insertMany([
          { subject: 'Physics', moduleName: 'Module 1: Electrostatics & Gauss Law', questionText: 'Electric flux through a closed Gaussian surface enclosing a dipole of charges +q and -q is:', options: ['Zero', 'q / epsilon_0', '2q / epsilon_0', 'Infinity'], correctOption: 'Zero', difficulty: 'Easy', type: 'MCQ', solutionExplanation: 'Net charge enclosed by the Gaussian surface is (+q) + (-q) = 0. By Gauss Law, total electric flux = Q_enclosed / epsilon_0 = 0.', createdBy: 'Dr. Priya Mehta' },
          { subject: 'Physics', moduleName: 'Module 1: Electrostatics & Gauss Law', questionText: 'A thin conducting spherical shell of radius R carries charge Q. The electric field at distance r (r < R) from center is:', options: ['Zero', 'kQ / r^2', 'kQ / R^2', 'kQ / r'], correctOption: 'Zero', difficulty: 'Medium', type: 'MCQ', solutionExplanation: 'Inside a conducting spherical shell, all charge resides on the outer surface. Hence, enclosed charge Q_enc = 0 for r < R, making E = 0.', createdBy: 'Dr. Priya Mehta' },
          { subject: 'Physics', moduleName: 'Module 2: Current Electricity & Kirchhoff Laws', questionText: 'In a Wheatstone bridge, if the galvanometer shows zero deflection, the condition satisfied is:', options: ['P/Q = R/S', 'P*Q = R*S', 'P + Q = R + S', 'P - Q = R - S'], correctOption: 'P/Q = R/S', difficulty: 'Easy', type: 'MCQ', solutionExplanation: 'A Wheatstone bridge is balanced when opposite ratio of resistances are equal: P/Q = R/S.', createdBy: 'Dr. Priya Mehta' },
          { subject: 'Chemistry', moduleName: 'Module 1: Organic Reaction Mechanisms', questionText: 'Which of the following carbocations is most stable due to resonance and hyperconjugation?', options: ['Tertiary butyl carbocation (CH3)3C+', 'Secondary propyl carbocation (CH3)2CH+', 'Primary ethyl carbocation CH3CH2+', 'Methyl carbocation CH3+'], correctOption: 'Tertiary butyl carbocation (CH3)3C+', difficulty: 'Medium', type: 'MCQ', solutionExplanation: 'Tertiary butyl carbocation has 9 hyperconjugative alpha-hydrogens, making it the most stable alkyl carbocation.', createdBy: 'Prof. Amit Singh' },
          { subject: 'Mathematics', moduleName: 'Module 1: Differential Calculus & Limits', questionText: 'Evaluate the limit: lim (x -> 0) [sin(5x) / x]:', options: ['5', '1', '0', '1/5'], correctOption: '5', difficulty: 'Easy', type: 'MCQ', solutionExplanation: 'Using standard limit formula lim(u->0) sin(u)/u = 1: lim (5 * sin(5x)/(5x)) = 5 * 1 = 5.', createdBy: 'Mr. Raj Sharma' }
        ]);
      }

      const vcCount = await VideoChatLog.countDocuments();
      if (vcCount === 0) {
        await VideoChatLog.insertMany([
          { videoTitle: 'Electrostatics & Gauss Law', studentName: 'Arjun Sharma', userQuery: 'Summarize Gauss Law proof for spherical shell', aiResponse: '🤖 **AI Video Assistant:** At [⏱️ 12:45], Dr. Priya Mehta proves Gauss Law for a conducting spherical shell of radius R. Since all charge resides on the outer surface, enclosed charge Q_enc = 0 for r < R. Therefore, the electric field E = 0 inside the shell.', timestampMark: '12:45', subject: 'Physics' }
        ]);
      }

      const ivCount = await InVideoQuiz.countDocuments();
      if (ivCount === 0) {
        await InVideoQuiz.insertMany([
          { videoTitle: 'Electrostatics & Gauss Law', timestampSeconds: 135, timestampFormatted: '02:15', stepIndex: '1/7', title: 'Course overview', description: 'Switch between courses & get course information with progress', questionText: 'In-Video Checkpoint (1/7): Does electric flux depend on Gaussian sphere radius?', options: ['A) Yes, directly proportional', 'B) No, depends only on enclosed charge', 'C) Inversely proportional'], correctOption: 'B) No, depends only on enclosed charge', type: 'Checkpoint' },
          { videoTitle: 'Electrostatics & Gauss Law', timestampSeconds: 330, timestampFormatted: '05:30', stepIndex: '2/7', title: 'Module overview', description: 'See the list of all modules with due date & progress statuses like completed, pending, etc.', questionText: 'In-Video Checkpoint (2/7): What is electric field inside a charged hollow conductor?', options: ['A) Zero', 'B) kQ/r^2', 'C) Infinite'], correctOption: 'A) Zero', type: 'Checkpoint' }
        ]);
      }

      const ugCount = await UpGradFeature.countDocuments();
      if (ugCount === 0) {
        await UpGradFeature.create({
          studentId: 's1', studentName: 'Arjun Sharma', studentProgressPct: 15.8, batchAvgProgressPct: 8.2, dailyGoalMins: 30, dailyGoalCompletedMins: 0, moduleProgressPct: 41.9, timeRemainingFormatted: '7h 5m left'
        });
      }

      const faCount = await FeeAutomation.countDocuments();
      if (faCount === 0) {
        await FeeAutomation.insertMany([
          { studentId: 's1', studentName: 'Arjun Sharma', rollNo: 'RVLH-2026-042', termName: 'Term 1 — Academic Year 2025-26', totalFee: 50000, paidFee: 25000, dueFee: 0, paymentMode: 'Online', receiptNo: 'REC-2026-8801', transactionId: 'TXN-99042817' },
          { studentId: 's1', studentName: 'Arjun Sharma', rollNo: 'RVLH-2026-042', termName: 'Term 2 — Academic Year 2025-26', totalFee: 50000, paidFee: 0, dueFee: 25000, paymentMode: 'ChequeDropBox', receiptNo: 'REC-2026-9042', transactionId: 'CHQ-409218', chequeDetails: { chequeNo: '409218', bankName: 'HDFC Bank Jayanagar', dropboxLocation: 'Drop Box DB-04 (Main Gate)', clearanceStatus: 'Pending Clearance' } }
        ]);
      }

      const p2pCount = await P2PDoubt.countDocuments();
      if (p2pCount === 0) {
        await P2PDoubt.insertMany([
          {
            studentName: 'Arjun Sharma', subject: 'Physics', moduleName: 'Module 1: Electrostatics', questionTitle: 'Why is electric field zero inside a hollow spherical conductor?', questionText: 'When a hollow metallic sphere is charged, why does all charge shift to the outer surface leaving E = 0 inside?', upvotes: 12, status: 'Resolved', aiSuggestedAnswer: '🤖 **AI Auto-Solver:** Charges repel each other and move as far apart as possible to minimize potential energy. In a conductor, charges can move freely, so they accumulate on the outer boundary. By Gauss Law, ∮ E·dA = Q_enc/ε₀. Since Q_enc = 0, E = 0.',
            answers: [
              { author: 'Rohan Gupta (Peer Mentor)', authorRole: 'student', text: 'Because electrostatic equilibrium requires zero force on free electrons inside the bulk metal. If E != 0, electrons would accelerate until E becomes 0.', upvotes: 8, isVerified: true },
              { author: 'Dr. Priya Mehta', authorRole: 'faculty', text: 'Verified! Excellent physical reasoning by Rohan.', upvotes: 15, isVerified: true }
            ]
          }
        ]);
      }

      const stCount = await SaaSTenant.countDocuments();
      if (stCount === 0) {
        await SaaSTenant.insertMany([
          { tenantName: 'RV College of Engineering', domain: 'rvce.edu.in', subdomain: 'rvce', plan: 'Enterprise', maxUsers: 5000, usedUsers: 4200, mrrAmount: 150000, status: 'Active', adminEmail: 'admin@rvce.edu.in' },
          { tenantName: 'MediaCell Institute of Tech', domain: 'mediacell.edu.in', subdomain: 'mediacell', plan: 'Professional', maxUsers: 2500, usedUsers: 1850, mrrAmount: 95000, status: 'Active', adminEmail: 'principal@mediacell.edu.in' },
          { tenantName: 'Delhi Public School Bangalore', domain: 'dpsbangalore.edu.in', subdomain: 'dpsb', plan: 'Starter', maxUsers: 1000, usedUsers: 890, mrrAmount: 45000, status: 'Active', adminEmail: 'principal@dpsb.edu.in' }
        ]);
      }

      const shCount = await SelfHostedConfig.countDocuments();
      if (shCount === 0) {
        await SelfHostedConfig.create({
          deploymentType: 'SelfHosted', serverStatus: 'Online', cpuUsagePct: 24, ramUsagePct: 28, diskUsagePct: 35, securityPatchVersion: 'v4.8.2-LMS-SECURE',
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

module.exports = { seedData };
