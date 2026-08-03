// Module: PAGES['admin_dashboard']
export function registerPage(PAGES) {
  PAGES['admin_dashboard'] = function() {
  var statsHtml = '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:20px">'
    + [
      { icon:'👨‍🎓', val:'1,248', label:'Total Students',  change:'+23 this week',     col:'var(--student)' },
      { icon:'👨‍🏫', val:'42',    label:'Active Faculty',  change:'All subjects',       col:'var(--faculty)' },
      { icon:'💰',  val:'₹8.4L', label:'Monthly Revenue', change:'↑12% vs last month', col:'var(--yellow)' },
      { icon:'📚',  val:'18',    label:'Active Courses',  change:'JEE, NEET, Commerce',col:'var(--purple)' },
      { icon:'🎬',  val:'324',   label:'Total Videos',    change:'+12 this week',      col:'var(--orange)' },
    ].map(function(s) {
      return '<div class="stat-card" style="border-color:color-mix(in srgb,' + s.col + ' 28%,var(--border))" onclick="toast(\'' + s.label + ' details\',\'📊\')">'
        + '<div class="stat-icon">' + s.icon + '</div>'
        + '<div class="stat-val" style="color:' + s.col + '">' + s.val + '</div>'
        + '<div class="stat-label">' + s.label + '</div>'
        + '<div class="stat-change" style="color:' + s.col + '">' + s.change + '</div>'
        + '</div>';
    }).join('') + '</div>';

  var enrollments = [
    { n:'Kavya Reddy', c:'JEE Advanced 2025', d:'Today',     s:'pending' },
    { n:'Aman Joshi',  c:'NEET Batch 2025',   d:'Today',     s:'approved' },
    { n:'Siya Patel',  c:'Commerce XI',        d:'Yesterday', s:'approved' },
    { n:'Ravi Kumar',  c:'JEE Mains Crash',   d:'Yesterday', s:'pending' },
  ];
  var enrHtml = enrollments.map(function(e) {
    return '<div class="list-item" onclick="openEnrollmentApproval(\'' + e.n + '\',\'' + e.c + '\',\'' + e.s + '\')">'
      + makeAv(e.n.charAt(0), 'rgba(255,45,107,.1)')
      + '<div class="li-content"><div class="li-title">' + e.n + '</div><div class="li-sub">' + e.c + ' • ' + e.d + '</div></div>'
      + '<span class="badge ' + (e.s==='approved'?'badge-green':'badge-yellow') + '">' + e.s + '</span></div>';
  }).join('');

  var fees = window.LMS_FEES || [['JEE Advanced','₹72,000',8],['NEET Batch','₹43,500',5],['Commerce','₹29,500',4]];
  var feeHtml = fees.map(function(f) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)">'
      + '<div><div style="font-size:13px;font-weight:600">' + f[0] + '</div><div style="font-size:11px;color:var(--muted)">' + f[2] + ' payments</div></div>'
      + '<span style="color:var(--yellow);font-weight:700">' + f[1] + '</span></div>';
  }).join('');

  // Enrollment by Course - interactive chart
  var courseEnrollData = [
    { m:'JEE Adv',  v:85, students:240, capacity:300, col:'#ff2d6b' },
    { m:'JEE Main', v:60, students:120, capacity:200, col:'#6c47ff' },
    { m:'NEET',     v:72, students:144, capacity:200, col:'#4ade80' },
    { m:'XI Sci',   v:45, students:90,  capacity:200, col:'#00d4c8' },
    { m:'XII Sci',  v:55, students:110, capacity:200, col:'#fbbf24' },
    { m:'Commerce', v:38, students:76,  capacity:200, col:'#ff6b35' },
  ];
  var enrollChartHtml = '<div style="margin-bottom:4px">'
    + courseEnrollData.map(function(b) {
        return '<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border)">'
          + '<div style="width:9px;height:9px;border-radius:50%;background:' + b.col + ';flex-shrink:0"></div>'
          + '<div style="flex:1;font-size:12px;font-weight:600">' + b.m + '</div>'
          + '<div style="font-family:Syne,sans-serif;font-size:18px;font-weight:800;color:' + b.col + '">' + b.students + '</div>'
          + '<div style="font-size:11px;color:var(--muted);width:44px;text-align:right">/ ' + b.capacity + '</div>'
          + '<button class="btn btn-sm" style="font-size:11px;padding:3px 8px;background:color-mix(in srgb,' + b.col + ' 12%,transparent);color:' + b.col + ';border:1px solid color-mix(in srgb,' + b.col + ' 28%,transparent)" onclick="openCourseEnrollDetail(\'' + b.m + '\',' + b.students + ',' + b.capacity + ',\'' + b.col + '\')">View</button>'
          + '</div>';
      }).join('') + '</div>';

  var actions = [
    { label:'➕ Add Student',    fn:'openAddStudentModal()' },
    { label:'👨‍🏫 Add Faculty',   fn:'openAddFacultyModal()' },
    { label:'📢 Announcement',   fn:"loadPage('announcements')" },
    { label:'📊 Generate Report',fn:'openGenerateReportModal()' },
    { label:'💳 Record Payment', fn:"loadPage('fees')" },
    { label:'🏗️ Create Course',  fn:'openCreateCourseModal()' },
  ];
  var actHtml = actions.map(function(a) {
    return '<button class="btn btn-purple" style="justify-content:flex-start" onclick="' + a.fn + '">' + a.label + '</button>';
  }).join('');

  // Recent Activities
  var activities = [
    { icon:'🎬', iconBg:'rgba(255,107,53,.12)',  title:'New video uploaded for approval',    sub:'Dr. Priya Mehta uploaded "Electrostatics Part 3"',         time:'5 min ago',  badge:'badge-orange', bLabel:'Pending Approval', action:'openActivityModal(\'video\',\'Electrostatics Part 3\',\'Dr. Priya Mehta\')' },
    { icon:'📄', iconBg:'rgba(108,71,255,.12)', title:'Study material uploaded',            sub:'Prof. Amit Singh added "Organic Chemistry Notes PDF"',      time:'22 min ago', badge:'badge-purple', bLabel:'Material',         action:'openActivityModal(\'material\',\'Organic Chemistry Notes PDF\',\'Prof. Amit Singh\')' },
    { icon:'💳', iconBg:'rgba(251,191,36,.12)',  title:'Course material purchased',          sub:'Kavya Reddy purchased JEE Advanced notes pack (₹499)',      time:'1 hr ago',   badge:'badge-yellow', bLabel:'Purchase',         action:'openActivityModal(\'purchase\',\'JEE Advanced Notes Pack\',\'Kavya Reddy\')' },
    { icon:'📢', iconBg:'rgba(74,222,128,.12)',  title:'Announcement posted',               sub:'Admin posted "JEE Mock Test 14 — Sunday" to all batches',   time:'2 hrs ago',  badge:'badge-green',  bLabel:'Announcement',     action:"loadPage('announcements')" },
    { icon:'🎬', iconBg:'rgba(255,107,53,.12)',  title:'New video uploaded for approval',    sub:'Mr. Raj Sharma uploaded "Integration by Parts — Part 2"',   time:'3 hrs ago',  badge:'badge-orange', bLabel:'Pending Approval', action:'openActivityModal(\'video\',\'Integration by Parts — Part 2\',\'Mr. Raj Sharma\')' },
    { icon:'💳', iconBg:'rgba(251,191,36,.12)',  title:'Material purchase',                 sub:'Aman Joshi purchased NEET Biology DPP pack (₹299)',          time:'4 hrs ago',  badge:'badge-yellow', bLabel:'Purchase',         action:'openActivityModal(\'purchase\',\'NEET Biology DPP Pack\',\'Aman Joshi\')' },
    { icon:'👨‍🎓',iconBg:'rgba(255,45,107,.12)',   title:'New student enrollment request',    sub:'Riya Shah applied for Commerce XI batch',                  time:'5 hrs ago',  badge:'badge-red',    bLabel:'Enrollment',       action:"openEnrollmentApproval('Riya Shah','Commerce XI','pending')" },
  ];
  var activityHtml = activities.map(function(a) {
    return '<div class="list-item" onclick="' + a.action + '">'
      + '<div class="li-icon" style="background:' + a.iconBg + '">' + a.icon + '</div>'
      + '<div class="li-content"><div class="li-title">' + a.title + '</div><div class="li-sub">' + a.sub + '</div></div>'
      + '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0">'
      + '<span class="badge ' + a.badge + '">' + a.bLabel + '</span>'
      + '<span style="font-size:10px;color:var(--muted)">' + a.time + '</span></div></div>';
  }).join('');

  return statsHtml
    + '<div class="grid-2">'
    + '<div class="card"><div class="card-header"><div class="card-title">👥 Recent Enrollments</div><button class="card-act" onclick="loadPage(\'users\')">Manage</button></div>' + enrHtml + '</div>'
    + '<div class="card"><div class="card-header"><div class="card-title">💰 Fee Collection Today</div><button class="card-act" onclick="loadPage(\'fees\')">View All</button></div>'
    + '<div style="text-align:center;padding:14px 0;border-bottom:1px solid var(--border);margin-bottom:13px">'
    + '<div style="font-family:Syne,sans-serif;font-size:30px;font-weight:800;color:var(--yellow)">₹1,45,000</div>'
    + '<div style="color:var(--muted);font-size:12px;margin-top:3px">Collected today</div></div>' + feeHtml + '</div>'
    + '</div>'
    + '<div class="grid-2">'
    + '<div class="card"><div class="card-header"><div class="card-title">📊 Enrollment by Course</div><button class="card-act" onclick="toast(\'Opening course details...\',\'📊\')">View All</button></div>' + enrollChartHtml + '</div>'
    + '<div class="card"><div class="card-title" style="margin-bottom:14px">📣 Quick Actions</div><div style="display:flex;flex-direction:column;gap:7px">' + actHtml + '</div></div>'
    + '</div>'
    + '<div class="card"><div class="card-header"><div class="card-title">⚡ Recent Activities</div><button class="card-act" onclick="toast(\'Full activity log\',\'📋\')">View All</button></div>'
    + activityHtml + '</div>';
};

function openEnrollmentApproval(name, course, status) {
  var isPending = status === 'pending';
  var body = '<div style="display:grid;gap:8px;margin-bottom:15px">'
    + [['Student',name],['Course',course],['Status',status]].map(function(e) { return makeFeeCard(e[0], e[1]); }).join('') + '</div>';
  var footer = isPending
    ? '<button class="btn btn-green" onclick="toast(\'' + name + ' approved!\',\'✅\');closeModal(\'modal-detail\')">✅ Approve</button>'
      + '<button class="btn btn-red" onclick="toast(\'' + name + ' rejected\',\'❌\');closeModal(\'modal-detail\')">❌ Reject</button>'
    : '<button class="btn btn-purple" onclick="toast(\'Viewing profile\',\'👤\');closeModal(\'modal-detail\')">👤 View Profile</button>';
  openDetail('👤 Enrollment — ' + name, body, footer);
}

function openCourseEnrollDetail(course, students, capacity, col) {
  var pct = Math.round((students / capacity) * 100);
  var remaining = capacity - students;
  var recentStudents = [
    { n:'Kavya Reddy',  d:'Today' },
    { n:'Aman Joshi',   d:'Today' },
    { n:'Siya Patel',   d:'Yesterday' },
    { n:'Ravi Kumar',   d:'Mar 11' },
    { n:'Meera Shah',   d:'Mar 10' },
  ];
  var body = '<div style="text-align:center;padding:16px;background:color-mix(in srgb,' + col + ' 8%,var(--surface2));border-radius:12px;margin-bottom:16px;border:1px solid color-mix(in srgb,' + col + ' 20%,transparent)">'
    + '<div style="font-family:Syne,sans-serif;font-size:36px;font-weight:800;color:' + col + '">' + students + '</div>'
    + '<div style="color:var(--muted);font-size:13px;margin-top:2px">Enrolled Students</div></div>'
    + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:16px">'
    + makeFeeCard('Capacity', capacity + ' seats')
    + makeFeeCard('Remaining', remaining + ' seats')
    + makeFeeCard('Fill Rate', pct + '%')
    + '</div>'
    + '<div style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px"><span>Batch Fill</span><span style="color:' + col + ';font-weight:700">' + pct + '%</span></div>'
    + '<div class="prog-bar" style="height:10px"><div class="prog-fill" style="width:' + pct + '%;background:' + col + '"></div></div></div>'
    + '<div class="card-title" style="margin-bottom:10px">Recent Enrollments</div>'
    + recentStudents.map(function(s) {
        return '<div class="list-item">'
          + makeAv(s.n.charAt(0), 'color-mix(in srgb,' + col + ' 12%,var(--surface2))')
          + '<div class="li-content"><div class="li-title">' + s.n + '</div><div class="li-sub">Enrolled ' + s.d + '</div></div>'
          + '<span class="badge badge-green">Enrolled</span></div>';
      }).join('');
  openDetail('📊 ' + course + ' — Enrollment Details', body,
    '<button class="btn btn-solid" onclick="loadPage(\'users\');closeModal(\'modal-detail\')">👥 Manage Students</button>'
    + '<button class="btn btn-purple" onclick="window.exportEnrollmentDetails(\'' + course.replace(/'/g,"\\'") + '\');closeModal(\'modal-detail\')">📊 Export</button>');
}

function openActivityModal(type, title, person) {
  var configs = {
    video: {
      icon: '🎬', badgeClass: 'badge-orange', badgeLabel: 'Pending Approval',
      desc: 'A new video has been uploaded and is awaiting admin approval before being visible to students.',
      actions: [
        { label:'✅ Approve Video',   cls:'btn-green',  fn:'toast(\'Video approved and published!\',\'✅\');closeModal(\'modal-detail\')' },
        { label:'❌ Reject',          cls:'btn-red',    fn:'toast(\'Video rejected\',\'❌\');closeModal(\'modal-detail\')' },
        { label:'▶ Preview Video',   cls:'btn-purple', fn:'toast(\'Opening preview...\',\'▶\')' },
      ]
    },
    material: {
      icon: '📄', badgeClass: 'badge-purple', badgeLabel: 'Material Uploaded',
      desc: 'New study material has been uploaded and is ready for review before publishing to students.',
      actions: [
        { label:'✅ Approve Material', cls:'btn-green',  fn:'toast(\'Material approved!\',\'✅\');closeModal(\'modal-detail\')' },
        { label:'❌ Reject',           cls:'btn-red',    fn:'toast(\'Material rejected\',\'❌\');closeModal(\'modal-detail\')' },
        { label:'📥 Download Preview',cls:'btn-purple', fn:'window.downloadMaterialFile(\''+title.replace(/'/g,"\\'")+'\')' },
      ]
    },
    purchase: {
      icon: '💳', badgeClass: 'badge-yellow', badgeLabel: 'Purchase',
      desc: 'A student has purchased course material. Payment has been received and access has been granted.',
      actions: [
        { label:'🧾 View Receipt',    cls:'btn-purple', fn:'window.downloadPurchaseActivityReceipt(\'' + person.replace(/'/g, "\\'") + '\',\'' + title.replace(/'/g, "\\'") + '\');closeModal(\'modal-detail\')' },
        { label:'👤 View Student',    cls:'btn-teal',   fn:'toast(\'Opening profile...\',\'👤\');closeModal(\'modal-detail\')' },
      ]
    }
  };
  var cfg = configs[type] || configs.video;
  var body = '<div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--surface2);border-radius:10px;margin-bottom:16px">'
    + '<div style="width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;font-size:24px">' + cfg.icon + '</div>'
    + '<div><div style="font-weight:700;font-size:14px">' + title + '</div>'
    + '<div style="font-size:12px;color:var(--muted);margin-top:3px">by ' + person + '</div>'
    + '<span class="badge ' + cfg.badgeClass + '" style="margin-top:6px">' + cfg.badgeLabel + '</span></div></div>'
    + '<div style="font-size:13px;color:var(--muted);margin-bottom:16px;line-height:1.7">' + cfg.desc + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
    + [['Faculty/Student', person], ['Time', 'Just now'], ['Status', cfg.badgeLabel], ['Type', type.charAt(0).toUpperCase()+type.slice(1)]].map(function(e) { return makeFeeCard(e[0], e[1]); }).join('')
    + '</div>';
  var footer = cfg.actions.map(function(a) {
    return '<button class="btn ' + a.cls + '" onclick="' + a.fn + '">' + a.label + '</button>';
  }).join('');
  openDetail(cfg.icon + ' Activity — ' + title, body, footer);
}

// ── ADMIN USERS DATA ──
var ADMIN_STUDENTS = [
  { n:'Arjun Sharma', roll:'RV2024001', course:'JEE Advanced (Main + KCET Decoded)', batch:'Batch A', fee:'Paid',    st:'active', email:'arjun.sharma@student.rvhub.com', campus:'RV Jayanagar', gender:'Male',   mobile:'+91 98001 00001' },
  { n:'Sneha Patel',  roll:'RV2024002', course:'JEE Advanced (Main + KCET Decoded)', batch:'Batch A', fee:'Paid',    st:'active', email:'sneha.patel@student.rvhub.com',   campus:'RV Rajajinagar', gender:'Female', mobile:'+91 98001 00002' },
  { n:'Rohan Gupta',  roll:'RV2024003', course:'JEE (Main + KCET Decoded)',          batch:'Batch B', fee:'Due',     st:'active', email:'rohan.gupta@student.rvhub.com',   campus:'RV Jayanagar', gender:'Male',   mobile:'+91 98001 00003' },
  { n:'Kavya Reddy',  roll:'RV2024015', course:'NEET UG Decoded',                   batch:'NEET A',  fee:'Paid',    st:'active', email:'kavya.reddy@student.rvhub.com',   campus:'RV Electronic City', gender:'Female', mobile:'+91 98001 00015' },
  { n:'Dev Verma',    roll:'RV2024020', course:'Commerce Decoded Programme',         batch:'Crash',   fee:'Overdue', st:'warning',email:'dev.verma@student.rvhub.com',     campus:'RV Rajajinagar', gender:'Male',   mobile:'+91 98001 00020' },
];
var ADMIN_FACULTY = [
  { n:'Dr. Priya Mehta',  id:'RVF001', email:'priya.mehta@rvhub.com',    campus:'RV Jayanagar',       course:'JEE Advanced (Main + KCET Decoded)', sub:'Physics',     batches:'JEE A,B',    rat:'4.8', st:'active' },
  { n:'Prof. Amit Singh', id:'RVF002', email:'amit.singh@rvhub.com',     campus:'RV Rajajinagar',     course:'JEE (Main + KCET Decoded)',          sub:'Chemistry',   batches:'JEE,NEET',   rat:'4.5', st:'active' },
  { n:'Mr. Raj Sharma',   id:'RVF003', email:'raj.sharma@rvhub.com',     campus:'RV Electronic City', course:'JEE Advanced (Main + KCET Decoded)', sub:'Mathematics', batches:'JEE A,B',    rat:'4.3', st:'active' },
  { n:'Dr. Kavya R.',     id:'RVF004', email:'kavya.r@rvhub.com',        campus:'RV Jayanagar',       course:'NEET UG Decoded',                   sub:'Biology',     batches:'NEET Batch', rat:'4.6', st:'inactive' },
];
}
