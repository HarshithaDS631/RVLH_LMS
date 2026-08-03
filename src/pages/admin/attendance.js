// Module: PAGES['admin_attendance']
export function registerPage(PAGES) {
  PAGES['admin_attendance'] = function() {
  var data = [
    { b:'JEE Advanced A', s:142, avg:87, below:12, tr:'↑' },
    { b:'JEE Advanced B', s:98,  avg:82, below:18, tr:'→' },
    { b:'NEET Batch 2025',s:72,  avg:90, below:5,  tr:'↑' },
    { b:'JEE Mains Crash',s:56,  avg:75, below:14, tr:'↓' },
    { b:'Commerce XI',    s:45,  avg:88, below:4,  tr:'↑' },
  ];
  return '<div class="card"><div class="card-header"><div class="card-title">✅ Attendance Overview — March 2024</div>'
    + '<button class="btn btn-sm btn-teal" onclick="downloadFullAttendance()">⬇ Download Full Report</button></div>'
    + '<div class="tbl-wrap"><table><thead><tr><th>Batch</th><th>Students</th><th>Avg Attendance</th><th>Below 75%</th><th>Trend</th><th>Action</th></tr></thead><tbody>'
    + data.map(function(b) {
        return '<tr onclick="openBatchAttendanceDetail(\'' + b.b.replace(/'/g,"\\'") + '\',' + b.s + ',' + b.avg + ')" style="cursor:pointer" title="View details for ' + b.b + '">'
          + '<td>' + b.b + '</td><td>' + b.s + '</td>'
          + '<td><span style="color:' + (b.avg>=80?'var(--student)':'var(--admin)') + ';font-weight:700">' + b.avg + '%</span></td>'
          + '<td style="color:' + (b.below>15?'var(--admin)':'var(--muted)') + '">' + b.below + ' students</td>'
          + '<td style="font-size:17px;color:' + (b.tr==='↑'?'var(--student)':b.tr==='↓'?'var(--admin)':'var(--muted)') + '">' + b.tr + '</td>'
          + '<td><button class="btn btn-sm btn-purple" onclick="event.stopPropagation();downloadBatchAttendance(\'' + b.b + '\',' + b.s + ',' + b.avg + ')">⬇ Report</button></td></tr>';
      }).join('') + '</tbody></table></div></div>';
};

window.openBatchAttendanceDetail = function(batchName, totalStudents, avgPct) {
  var students = window.ADMIN_STUDENTS || [];
  
  var courseKeyword = batchName.replace(' A','').replace(' B','').replace(' Batch 2025','').replace(' Mains Crash','').replace(' XI','');
  if (courseKeyword === 'JEE') courseKeyword = 'JEE (Main'; // avoid confusion with JEE Advanced
  
  var filteredStudents = students.filter(function(s) {
    return s.course.indexOf(courseKeyword) > -1;
  });
  
  // If no students found, use seed student list fallback
  if (filteredStudents.length === 0) {
    filteredStudents = students.slice(0, 10);
  }

  var listHtml = filteredStudents.map(function(s, idx) {
    var charSum = 0;
    for (var c=0; c<s.n.length; c++) charSum += s.n.charCodeAt(c);
    var att = Math.floor((charSum % 15) + (avgPct - 7));
    att = Math.max(50, Math.min(100, att));
    
    var isLow = att < 75;
    var statusClass = isLow ? 'badge-red' : 'badge-green';
    var statusText = isLow ? 'Low Attendance' : 'Regular';
    
    return '<div class="list-item" style="padding:10px 12px;margin-bottom:8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px;display:flex;justify-content:space-between;align-items:center">'
      + '<div style="display:flex;align-items:center;gap:10px">'
      + makeAv(s.n.charAt(0), isLow ? 'rgba(255,45,107,0.1)' : 'rgba(74,222,128,0.1)')
      + '<div><div style="font-weight:600;font-size:13px">' + s.n + '</div><div style="font-size:11px;color:var(--muted)">' + s.roll + '</div></div>'
      + '</div>'
      + '<div style="display:flex;align-items:center;gap:12px">'
      + '<div style="text-align:right"><div style="font-weight:700;font-size:13px;color:' + (isLow ? 'var(--admin)' : 'var(--student)') + '">' + att + '%</div>'
      + '<span class="badge ' + statusClass + '" style="font-size:9px;padding:2px 5px">' + statusText + '</span></div>'
      + (isLow ? '<button class="btn btn-sm btn-red" style="padding:4px 8px;font-size:11px" onclick="event.stopPropagation();toast(\'Low attendance alert sent to ' + s.n.replace(/'/g,"\\'") + ' and parents!\',\'📨\')">📨 Alert</button>' : '')
      + '</div>'
      + '</div>';
  }).join('');

  var body = '<div style="margin-bottom:14px">'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">'
    + makeFeeCard('Total Students', filteredStudents.length + ' students')
    + makeFeeCard('Average Attendance', avgPct + '%')
    + '</div>'
    + '<div class="card-title" style="margin-bottom:10px;font-size:13px;color:var(--muted)">Student Roster & Stats</div>'
    + '<div style="max-height:350px;overflow-y:auto;padding-right:4px">' + listHtml + '</div>'
    + '</div>';

  openDetail('📊 ' + batchName + ' — Attendance Details', body,
    '<button class="btn btn-solid" onclick="closeModal(\'modal-detail\');downloadBatchAttendance(\'' + batchName.replace(/'/g,"\\'") + '\',' + totalStudents + ',' + avgPct + ')">⬇ Download CSV Report</button>'
    + '<button class="btn btn-purple" onclick="closeModal(\'modal-detail\')">Close</button>');
};

function downloadBatchAttendance(batchName, totalStudents, avgPct) {
  var students = typeof ADMIN_STUDENTS !== 'undefined' ? ADMIN_STUDENTS : [];
  var rows = [['Roll No','Student Name','Batch','Classes Held','Classes Attended','Attendance %','Status']];
  var classesHeld = 48;
  for (var i=0; i<totalStudents; i++) {
    var s = students[i % students.length];
    var att = Math.floor(Math.random()*15 + (avgPct - 7));
    att = Math.max(50, Math.min(100, att));
    var attended = Math.round(classesHeld * att / 100);
    rows.push([s ? s.roll : 'RV'+String(1000+i), s ? s.n : 'Student '+(i+1), batchName, classesHeld, attended, att+'%', att>=75?'Regular':'Low Attendance']);
  }
  var csv = rows.map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join('\n');
  var blob = new Blob([csv],{type:'text/csv'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download=batchName.replace(/\s+/g,'_')+'_attendance.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Attendance report for '+batchName+' downloaded!','⬇');
}

function downloadFullAttendance() {
  var batches = [
    { b:'JEE Advanced A', s:142, avg:87 }, { b:'JEE Advanced B', s:98, avg:82 },
    { b:'NEET Batch 2025', s:72, avg:90 }, { b:'JEE Mains Crash', s:56, avg:75 },
    { b:'Commerce XI', s:45, avg:88 }
  ];
  var rows = [['Batch','Total Students','Avg Attendance %','Below 75%','Status']];
  batches.forEach(function(b){
    var below = Math.round(b.s * (100-b.avg) / 100);
    rows.push([b.b, b.s, b.avg+'%', below, b.avg>=80?'Good':'Needs Attention']);
  });
  var csv = rows.map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join('\n');
  var blob = new Blob([csv],{type:'text/csv'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download='full_attendance_march_2024.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Full attendance report downloaded!','⬇');
}
}
