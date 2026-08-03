/**
 * ═══════════════════════════════════════════════════
 * RV Learning Hub LMS — Automated Integration Tests
 * ═══════════════════════════════════════════════════
 *
 * Tests the full frontend-to-backend request flow:
 * 1. Server boot & health check
 * 2. Authentication (login → JWT token)
 * 3. Protected API endpoints (with Bearer token)
 * 4. Public API endpoints (no auth needed)
 *
 * Usage:  npm test  (from backend/)
 */

const http = require('http');

console.log('🧪 RV Learning Hub LMS — Automated Integration Test Suite\n');
console.log('━'.repeat(55));

const PORT = 5099;
const BASE = `http://localhost:${PORT}`;

let passed = 0;
let failed = 0;
let authToken = null;

// ─── HTTP Helpers ────────────────────────────────────

function httpRequest(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const opts = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({ status: res.statusCode, body: parsed });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function GET(path, authenticated = false) {
  const headers = authenticated && authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};
  return httpRequest('GET', path, null, headers);
}

function POST(path, body, authenticated = false) {
  const headers = authenticated && authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};
  return httpRequest('POST', path, body, headers);
}

// ─── Test Runner ─────────────────────────────────────

async function assert(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✅ [PASS] ${name}`);
  } catch (err) {
    failed++;
    console.log(`  ❌ [FAIL] ${name} — ${err.message}`);
  }
}

function expectStatus(res, expected) {
  if (res.status !== expected)
    throw new Error(`Expected ${expected}, got ${res.status}`);
}

// ─── Test Suites ─────────────────────────────────────

async function runAllTests() {
  // Wait for seeder + MongoDB connection to settle
  await new Promise((r) => setTimeout(r, 2500));

  // ── 1. Health ──────────────────────────────────────
  console.log('\n📋 Suite 1: Server Health');
  await assert('GET / returns 200', async () => {
    const res = await GET('/');
    expectStatus(res, 200);
  });

  // ── 2. Authentication ──────────────────────────────
  console.log('\n🔐 Suite 2: Authentication Flow');
  await assert('POST /api/auth/login with valid credentials', async () => {
    const res = await POST('/api/auth/login', {
      email: 'arjun@rvhub.com',
      password: 'student123',
    });
    expectStatus(res, 200);
    if (!res.body.token) throw new Error('No JWT token returned');
    authToken = res.body.token;
  });

  await assert('POST /api/auth/login with wrong password → 400', async () => {
    const res = await POST('/api/auth/login', {
      email: 'arjun@rvhub.com',
      password: 'wrong_password',
    });
    expectStatus(res, 400);
  });

  await assert('GET /api/auth/profile with Bearer token', async () => {
    const res = await GET('/api/auth/profile', true);
    expectStatus(res, 200);
  });

  // ── 3. Protected Endpoints (require JWT) ───────────
  console.log('\n🔒 Suite 3: Protected API Endpoints (JWT Required)');

  const protectedGets = [
    ['/api/courses', 'Courses'],
    ['/api/videos', 'Videos'],
    ['/api/doubts', 'Doubts'],
    ['/api/materials', 'Materials'],
    ['/api/announcements', 'Announcements'],
    ['/api/fees', 'Fees'],
    ['/api/attendance', 'Attendance'],
    ['/api/leaderboard', 'Leaderboard'],
  ];

  for (const [path, label] of protectedGets) {
    await assert(`GET ${path} → ${label}`, async () => {
      const res = await GET(path, true);
      expectStatus(res, 200);
    });
  }

  // Admin-only endpoint: login as admin first
  await assert('GET /api/auth/users → User Management (admin)', async () => {
    const adminLogin = await POST('/api/auth/login', {
      email: 'admin@rvhub.com',
      password: 'admin123',
    });
    const adminToken = adminLogin.body.token;
    const res = await httpRequest('GET', '/api/auth/users', null, {
      Authorization: `Bearer ${adminToken}`,
    });
    expectStatus(res, 200);
  });

  // Verify protected endpoints REJECT requests without token
  await assert('GET /api/courses without token → 401', async () => {
    const res = await GET('/api/courses', false);
    expectStatus(res, 401);
  });

  // ── 4. Public Endpoints (no auth) ──────────────────
  console.log('\n🌐 Suite 4: Public API Endpoints');

  const publicGets = [
    ['/api/badges', 'Badges & Gamification'],
    ['/api/question-bank', 'AI Question Bank'],
    ['/api/in-video-quizzes', 'In-Video Quizzes'],
    ['/api/upgrad-analytics', 'upGrad Analytics'],
    ['/api/fee-automation', 'Fee Automation'],
    ['/api/p2p-doubts', 'P2P Doubts Forum'],
    ['/api/saas/tenants', 'SaaS Multi-Tenant'],
    ['/api/saas/metrics', 'SaaS MRR Metrics'],
    ['/api/in-house/status', 'In-House Telemetry'],
  ];

  for (const [path, label] of publicGets) {
    await assert(`GET ${path} → ${label}`, async () => {
      const res = await GET(path, false);
      expectStatus(res, 200);
    });
  }

  // ── 5. Write Operations (POST) ─────────────────────
  console.log('\n✏️  Suite 5: Write Operations');

  // Login as admin to create a course (requires admin role)
  await assert('POST /api/courses → Create Course (admin auth)', async () => {
    const adminLogin = await POST('/api/auth/login', {
      email: 'admin@rvhub.com',
      password: 'admin123',
    });
    const adminToken = adminLogin.body.token;
    const res = await httpRequest('POST', '/api/courses', {
      title: 'CI/CD Test Course',
      desc: 'Automated test course',
      instructor: 'Test Bot',
      thumb: '📘',
      batch: 'Test Batch',
      campus: 'Test Campus',
    }, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    });
    expectStatus(res, 201);
  });

  await assert('POST /api/p2p-doubts/ask → Ask a P2P Doubt', async () => {
    const res = await POST('/api/p2p-doubts/ask', {
      studentName: 'CI Bot',
      subject: 'Testing',
      questionTitle: 'CI/CD Pipeline Test',
      questionText: 'Does CI/CD pipeline work?',
    });
    expectStatus(res, 201);
  });

  // ── Summary ────────────────────────────────────────
  console.log('\n' + '━'.repeat(55));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);

  if (failed > 0) {
    console.log('\n❌ SOME TESTS FAILED — CI/CD pipeline should BLOCK merge.\n');
    process.exit(1);
  } else {
    console.log('\n🎉 ALL TESTS PASSED — CI/CD pipeline GREEN!\n');
    process.exit(0);
  }
}

// ─── Boot Test Server ────────────────────────────────

// Prevent the main server from listening on PORT 5000
process.env.NODE_ENV = 'production';
process.env.VERCEL = '1';

const app = require('../index.js');

const server = app.listen(PORT, () => {
  console.log(`📡 Test server started on port ${PORT}`);
  runAllTests().finally(() => server.close());
});

server.on('error', (err) => {
  console.error('❌ Test server failed to start:', err.message);
  process.exit(1);
});
