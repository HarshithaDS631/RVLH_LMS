// Module: PAGES['faculty_tracker']
export function registerPage(PAGES) {
  PAGES['faculty_tracker'] = function() {
  var students = [
    { n:'Sneha Patel',  s:94, a:'96%', t:32, tr:'↑', alert:false },
    { n:'Rohan Gupta',  s:91, a:'92%', t:30, tr:'↑', alert:false },
    { n:'Ananya Singh', s:88, a:'94%', t:31, tr:'→', alert:false },
    { n:'Arjun Sharma', s:85, a:'89%', t:29, tr:'↑', alert:false },
    { n:'Dev Verma',    s:52, a:'64%', t:18, tr:'↓', alert:true },
    { n:'Meera Shah',   s:48, a:'58%', t:15, tr:'↓', alert:true },
  ];
  return '<div style="display:flex;justify-content:space-between;margin-bottom:14px">'
    + '<select class="inp-field" style="width:180px" onchange="toast(\'Filter applied\',\'🔍\')"><option>JEE Advanced A</option><option>JEE Advanced B</option><option>NEET Batch</option></select>'
    + '<button class="btn btn-red" onclick="toast(\'Showing at-risk students\',\'⚠️\')">⚠️ At-Risk Students</button></div>'
    + '<div class="card"><div class="tbl-wrap"><table><thead><tr><th>Student</th><th>Avg Score</th><th>Attendance</th><th>Tests</th><th>Trend</th><th>Feedback</th></tr></thead><tbody>'
    + students.map(function(s) {
        return '<tr style="' + (s.alert?'background:rgba(255,45,107,.04)':'') + '" onclick="openSendFeedback(\'' + s.n + '\')">'
          + '<td><div style="display:flex;align-items:center;gap:8px">'
          + makeAv(s.n.charAt(0), 'rgba(0,212,200,.1)')
          + s.n + (s.alert ? '<span class="badge badge-red" style="margin-left:5px">⚠️ At Risk</span>' : '') + '</div></td>'
          + '<td><span style="color:' + (s.s>=70?'var(--student)':'var(--admin)') + ';font-weight:700">' + s.s + '%</span></td>'
          + '<td style="color:' + (parseInt(s.a)>=80?'var(--student)':'var(--admin)') + '">' + s.a + '</td>'
          + '<td>' + s.t + '</td>'
          + '<td style="font-size:17px;color:' + (s.tr==='↑'?'var(--student)':s.tr==='↓'?'var(--admin)':'var(--muted)') + '">' + s.tr + '</td>'
          + '<td><button class="btn btn-sm btn-teal" onclick="event.stopPropagation();openSendFeedback(\'' + s.n + '\')">💬</button></td></tr>';
      }).join('') + '</tbody></table></div></div>';
};

function openSendFeedback(name) {
  var body = makeInputGroup('Message', 'textarea', 'Write personal feedback...')
    + makeInputGroup('Type','select','Encouragement, Performance Alert, Improvement Tips, Congratulations');
  openDetail('💬 Feedback to ' + name, body, '<button class="btn btn-solid" onclick="toast(\'Feedback sent!\',\'✅\');closeModal(\'modal-detail\')">📤 Send</button>');
}
}
