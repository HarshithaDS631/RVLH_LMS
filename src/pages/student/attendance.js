// Module: PAGES['student_attendance']
export function registerPage(PAGES) {
  PAGES['student_attendance'] = function() {
  var stats = makeStats([
    { icon:'📊', val:'89%', label:'Overall',        col:'var(--student)' },
    { icon:'✅', val:'52',  label:'Attended',        col:'var(--faculty)' },
    { icon:'❌', val:'7',   label:'Missed',          col:'var(--admin)' },
    { icon:'🏖️', val:'3',   label:'On Leave',        col:'var(--yellow)' },
  ]);
  var subs = [
    { s:'Physics',   p:92, c:'#ff2d6b', a:22, t:24 },
    { s:'Chemistry', p:88, c:'#00d4c8', a:19, t:22 },
    { s:'Maths',     p:85, c:'#6c47ff', a:17, t:20 },
    { s:'Biology',   p:90, c:'#4ade80', a:16, t:18 },
  ];
  var subHtml = subs.map(function(s) {
    return '<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">'
      + '<span>' + s.s + '</span><span style="color:var(--muted);font-size:11px">' + s.a + '/' + s.t + '</span>'
      + '<span style="color:' + (s.p>=85?'var(--student)':'var(--admin)') + ';font-weight:700">' + s.p + '%</span></div>'
      + makeProgress(s.p, s.p>=85 ? s.c : 'var(--admin)') + '</div>';
  }).join('');
  var recent = [
    { d:'Mar 12 (Today)', s:'Physics',   st:'present' },
    { d:'Mar 11',         s:'Chemistry', st:'present' },
    { d:'Mar 10',         s:'Maths',     st:'absent' },
    { d:'Mar 9',          s:'Biology',   st:'present' },
    { d:'Mar 8',          s:'Physics',   st:'leave' },
  ];
  var recHtml = recent.map(function(a) {
    var ic = a.st==='present'?'✅':a.st==='absent'?'❌':'🏖️';
    var ibg = a.st==='present'?'rgba(74,222,128,.1)':a.st==='absent'?'rgba(255,45,107,.1)':'rgba(251,191,36,.1)';
    return '<div class="list-item">'
      + '<div class="li-icon" style="background:' + ibg + '">' + ic + '</div>'
      + '<div class="li-content"><div class="li-title">' + a.d + '</div><div class="li-sub">' + a.s + '</div></div>'
      + '<span class="badge ' + (a.st==='present'?'badge-green':a.st==='absent'?'badge-red':'badge-yellow') + '">' + a.st + '</span></div>';
  }).join('');

  return stats
    + '<div class="grid-2">'
    + '<div class="card"><div class="card-title" style="margin-bottom:14px">📚 Subject-wise Attendance</div>' + subHtml + '</div>'
    + '<div class="card"><div class="card-header"><div class="card-title">📅 Recent</div></div>' + recHtml
    + '<button class="btn btn-purple btn-full" style="margin-top:9px" onclick="openLeaveRequest()">📋 Request Leave</button></div>'
    + '</div>';
};

function openLeaveRequest() {
  var body = makeInputGroup('From Date','date','')
    + makeInputGroup('To Date','date','')
    + makeInputGroup('Reason','textarea','Reason for leave...');
  openDetail('📋 Leave Request', body, '<button class="btn btn-green" onclick="toast(\'Leave request submitted!\',\'✅\');closeModal(\'modal-detail\')">Submit Request</button>');
}

// ──────────────── STUDENT LEADERBOARD ────────────────
}
