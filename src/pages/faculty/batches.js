// Module: PAGES['faculty_batches']
export function registerPage(PAGES) {
  PAGES['faculty_batches'] = function() {
  var batches = [
    { n:'JEE Advanced — Batch A', e:'⚛️', s:142, cl:45, avg:78, col:'#ff2d6b', sch:'Mon,Wed,Fri' },
    { n:'JEE Advanced — Batch B', e:'⚛️', s:98,  cl:38, avg:72, col:'#6c47ff', sch:'Tue,Thu,Sat' },
    { n:'NEET Batch 2025',         e:'🔬', s:72,  cl:30, avg:80, col:'#4ade80', sch:'Mon-Fri' },
    { n:'JEE Mains Crash Course',  e:'🚀', s:56,  cl:20, avg:69, col:'#fbbf24', sch:'Sat,Sun' },
  ];
  return '<div class="grid-2">' + batches.map(function(b) {
    return '<div class="card" style="cursor:pointer;border-color:color-mix(in srgb,' + b.col + ' 22%,var(--border))" onclick="openBatchDetail(\'' + b.n.replace(/'/g,"\\'") + '\',\'' + b.e + '\',\'' + b.s + '\',\'' + b.avg + '\',\'' + b.col + '\')">'
      + '<div style="display:flex;gap:11px;align-items:center;margin-bottom:13px">'
      + '<div style="width:46px;height:46px;border-radius:11px;background:color-mix(in srgb,' + b.col + ' 10%,var(--surface2));display:flex;align-items:center;justify-content:center;font-size:24px">' + b.e + '</div>'
      + '<div><div style="font-family:Syne,sans-serif;font-weight:700;font-size:14px">' + b.n + '</div><div style="font-size:12px;color:var(--muted)">' + b.sch + '</div></div></div>'
      + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:12px">'
      + [['Students',b.s,'var(--text)'],['Classes',b.cl,'var(--text)'],['Avg',b.avg+'%',b.avg>=75?'var(--student)':'var(--admin)']].map(function(x) {
          return '<div><div style="font-size:11px;color:var(--muted)">' + x[0] + '</div><div style="font-weight:700;color:' + x[2] + '">' + x[1] + '</div></div>';
        }).join('')
      + '</div>'
      + '<div style="display:flex;gap:7px">'
      + '<button class="btn btn-sm btn-teal" style="flex:1" onclick="event.stopPropagation();openBatchDetail(\'' + b.n.replace(/'/g,"\\'") + '\',\'' + b.e + '\',\'' + b.s + '\',\'' + b.avg + '\',\'' + b.col + '\')">👥 Students</button>'
      + '<button class="btn btn-sm btn-purple" onclick="event.stopPropagation();toast(\'Attendance opened\',\'✅\')">✅</button>'
      + '</div></div>';
  }).join('') + '</div>';
};

function openBatchDetail(name, icon, students, avg, col) {
  var actions = [
    { label: '📋 View Student List', act: 'loadPage(\'tracker\')' },
    { label: '📊 Performance Report', act: 'loadPage(\'analytics\')' },
    { label: '📝 Create Test', act: 'loadPage(\'tests\')' },
    { label: '📣 Send Announcement', act: 'loadPage(\'content\')' },
    { label: '✅ Take Attendance', act: 'loadPage(\'live\')' },
    { label: '📤 Upload Content', act: 'loadPage(\'content\')' }
  ];
  var body = '<div style="display:flex;gap:11px;margin-bottom:18px">'
    + '<div class="fee-card" style="flex:1"><div style="font-size:11px;color:var(--muted)">STUDENTS</div><div style="font-size:20px;font-weight:700;color:' + col + '">' + students + '</div></div>'
    + '<div class="fee-card" style="flex:1"><div style="font-size:11px;color:var(--muted)">AVG SCORE</div><div style="font-size:20px;font-weight:700;color:' + col + '">' + avg + '%</div></div>'
    + '</div><div style="display:flex;flex-direction:column;gap:7px">'
    + actions.map(function(a) {
        return '<button class="btn btn-purple" style="justify-content:flex-start" onclick="closeModal(\'modal-detail\'); ' + a.act + '">' + a.label + '</button>';
      }).join('') + '</div>';
  openDetail(icon + ' ' + name, body, '');
}
}
