// Module: PAGES['admin_quiz']
export function registerPage(PAGES) {
  PAGES['admin_quiz'] = function() {
  var qState = window._quizState || { course:'', student:'' };
  window._quizState = qState;

  var courses = [];
  var studentNames = [];
  QUIZ_RESULTS.forEach(function(r){
    if (courses.indexOf(r.course)<0) courses.push(r.course);
    if (studentNames.indexOf(r.student)<0) studentNames.push(r.student);
  });

  var filtered = QUIZ_RESULTS.filter(function(r){
    var searchVal = (qState.student || '').toLowerCase().trim();
    var matchStudent = !searchVal
      || r.student.toLowerCase().indexOf(searchVal) !== -1
      || r.roll.toLowerCase().indexOf(searchVal) !== -1;
    return (!qState.course || r.course === qState.course) && matchStudent;
  });

  // Aggregate per student: one row with columns for each subject they attempted
  var studentMap = {};
  filtered.forEach(function(r){
    var key = r.roll;
    if (!studentMap[key]) {
      studentMap[key] = { student:r.student, roll:r.roll, course:r.course, subjects:{}, dates:[], videos:{} };
    }
    studentMap[key].subjects[r.subject] = r.score;
    studentMap[key].videos[r.subject]   = r.video;
    studentMap[key].dates.push(r.date);
  });

  var allSubjects = [];
  Object.values(studentMap).forEach(function(sd){
    Object.keys(sd.subjects).forEach(function(sub){ if(allSubjects.indexOf(sub)<0) allSubjects.push(sub); });
  });
  allSubjects.sort();

  var totalAttempts = filtered.length;
  var avgScore = totalAttempts ? Math.round(filtered.reduce(function(a,r){return a+r.score;},0)/totalAttempts) : 0;
  var passed   = filtered.filter(function(r){return r.score>=60;}).length;
  var topScore = totalAttempts ? Math.max.apply(null,filtered.map(function(r){return r.score;})) : 0;

  var stats = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:16px">'
    + [['📝','Total Attempts',totalAttempts,'var(--purple)'],['📊','Avg Score',avgScore+'%','var(--yellow)'],['✅','Passed (≥60%)',passed,'var(--student)'],['🏆','Top Score',topScore+'%','var(--admin)']].map(function(s){
        return '<div class="stat-card" style="border-color:color-mix(in srgb,'+s[3]+' 28%,var(--border))">'
          + '<div class="stat-icon">'+s[0]+'</div><div class="stat-val" style="color:'+s[3]+'">'+s[2]+'</div>'
          + '<div class="stat-label">'+s[1]+'</div></div>';
      }).join('') + '</div>';

  var filterBar = '<div class="card" style="margin-bottom:16px"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end">'
    + '<div class="inp-group" style="flex:1;min-width:200px;margin-bottom:0"><label>Course</label>'
    + '<select class="inp-field" id="qf-course" onchange="window._quizState.course=this.value;window._quizState.student=\'\';loadPage(\'quiz\')">'
    + '<option value="">All Courses</option>'
    + courses.map(function(cn){return '<option'+(qState.course===cn?' selected':'')+' value="'+cn+'">'+cn.split('(')[0].trim()+'</option>';}).join('')
    + '</select></div>'
    + '<div class="inp-group" style="flex:1;min-width:200px;margin-bottom:0"><label>Search Student</label>'
    + '<div style="position:relative">'
    + '<span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:13px;pointer-events:none">🔍</span>'
    + '<input class="inp-field" id="qf-search" style="padding-left:30px" placeholder="Type name or roll no..." value="'+(qState.student||'')+'" oninput="window._quizState.student=this.value;window._quizSearchDebounce()" />'
    + '</div></div>'
    + '<button class="btn btn-sm btn-red" onclick="window._quizState={course:\'\',student:\'\'};loadPage(\'quiz\')">Clear</button>'
    + '<button class="btn btn-sm btn-teal" onclick="window.exportQuizResults()">⬇ Export CSV</button>'
    + '</div></div>';

  // Build dynamic header with one column per subject
  var subjectHeaders = allSubjects.map(function(sub){
    var icon = sub==='Physics'?'⚡':sub==='Chemistry'?'🧪':sub==='Mathematics'?'📐':sub==='Biology'?'🔬':sub==='Accountancy'?'📊':'💹';
    return '<th>'+icon+' '+sub+'</th>';
  }).join('');

  var rows = Object.values(studentMap).map(function(sd){
    var scores = allSubjects.map(function(sub){ return sd.subjects[sub] !== undefined ? sd.subjects[sub] : null; });
    var validScores = scores.filter(function(sc){ return sc !== null; });
    var totalScore = validScores.reduce(function(a,b){ return a+b; }, 0);
    var maxScore   = validScores.length * 100;
    var avgPct     = validScores.length ? Math.round(totalScore / validScores.length) : 0;
    var grade      = avgPct>=90?'A+':avgPct>=80?'A':avgPct>=70?'B':avgPct>=60?'C':'F';
    var gradeCol   = avgPct>=80?'var(--student)':avgPct>=60?'var(--yellow)':'var(--admin)';
    var latestDate = sd.dates.sort().reverse()[0];
    var videoLabel = Object.values(sd.videos)[0] || '—';

    var subCells = allSubjects.map(function(sub){
      var sc = sd.subjects[sub];
      if (sc === undefined) return '<td style="color:var(--muted);font-size:12px;text-align:center">—</td>';
      var col = sc>=80?'var(--student)':sc>=60?'var(--yellow)':'var(--admin)';
      return '<td style="text-align:center">'
        + '<div style="font-weight:700;color:'+col+';font-size:13px">'+sc+'</div>'
        + '<div style="font-size:10px;color:var(--muted)">/ 100</div>'
        + '</td>';
    }).join('');

    var scorePct = maxScore ? Math.round(totalScore/maxScore*100) : 0;
    var bar = '<div style="display:flex;align-items:center;gap:6px;min-width:90px">'
      + '<div style="flex:1;height:5px;background:var(--surface2);border-radius:3px"><div style="height:5px;border-radius:3px;background:'+gradeCol+';width:'+scorePct+'%"></div></div>'
      + '<span style="font-weight:700;color:'+gradeCol+';font-size:12px;flex-shrink:0">'+scorePct+'%</span></div>';

    return '<tr>'
      + '<td><div style="font-weight:600;font-size:13px">'+sd.student+'</div><div style="font-size:11px;color:var(--muted)">'+sd.roll+'</div></td>'
      + '<td style="font-size:11px;color:var(--muted);max-width:130px">'+sd.course.split('(')[0].trim()+'</td>'
      + subCells
      + '<td style="font-size:11px;color:var(--muted);max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+videoLabel+'">🎬 '+videoLabel.split('—')[0].trim()+'</td>'
      + '<td style="text-align:center"><div style="font-weight:700;font-size:13px">'+totalScore+'</div><div style="font-size:10px;color:var(--muted)">/ '+maxScore+'</div></td>'
      + '<td>'+bar+'</td>'
      + '<td style="text-align:center"><span style="font-weight:800;font-size:14px;color:'+gradeCol+'">'+grade+'</span></td>'
      + '<td style="font-size:12px;color:var(--muted)">'+latestDate+'</td>'
      + '</tr>';
  }).join('');

  var table = '<div class="card"><div class="card-header"><div class="card-title">📊 Student Quiz Performance</div>'
    + '<span style="font-size:12px;color:var(--muted)">'+Object.keys(studentMap).length+' students</span></div>'
    + '<div class="tbl-wrap"><table><thead><tr>'
    + '<th>Student</th><th>Course</th>'
    + subjectHeaders
    + '<th>Quiz / Video</th><th>Score</th><th>Progress</th><th>Grade</th><th>Date</th>'
    + '</tr></thead><tbody>' + rows + '</tbody></table></div></div>';

  return stats + filterBar + table;
};

// Quiz search debounce
var _quizSearchTimer = null;
window._quizSearchDebounce = function() {
  clearTimeout(_quizSearchTimer);
  _quizSearchTimer = setTimeout(function() { loadPage('quiz'); }, 280);
};

function exportQuizResults() {
  var qState = window._quizState || {};
  var filtered = QUIZ_RESULTS.filter(function(r){
    var searchVal = (qState.student || '').toLowerCase().trim();
    var matchStudent = !searchVal
      || r.student.toLowerCase().indexOf(searchVal) !== -1
      || r.roll.toLowerCase().indexOf(searchVal) !== -1;
    return (!qState.course || r.course === qState.course) && matchStudent;
  });
  var rows = [['Student','Roll No','Course','Subject','Video/Quiz','Score','Grade','Date']].concat(
    filtered.map(function(r){
      var grade = r.score>=90?'A+':r.score>=80?'A':r.score>=70?'B':r.score>=60?'C':'F';
      return [r.student,r.roll,r.course,r.subject,r.video,r.score+'%',grade,r.date];
    }));
  var csv = rows.map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join('\n');
  var blob = new Blob([csv],{type:'text/csv'});
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a'); a.href=url; a.download='quiz_results.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Quiz results exported!','⬇');
}

// ════════════════════════════════════════
// PAYMENTS (admin_payments)
// ════════════════════════════════════════
var PAYMENT_HISTORY = [
  { id:'TXN001', student:'Sneha Patel',    material:'JEE Advanced Full Course', amount:45000, date:'Mar 12, 2025', method:'UPI',         status:'success', type:'course' },
  { id:'TXN002', student:'Kavya Reddy',    material:'NEET UG Decoded',          amount:38000, date:'Mar 12, 2025', method:'Credit Card',  status:'success', type:'course' },
  { id:'TXN003', student:'Aman Joshi',     material:'Commerce Decoded',         amount:28000, date:'Mar 11, 2025', method:'Cash',         status:'success', type:'course' },
  { id:'TXN004', student:'Rohan Gupta',    material:'Physics DPP Pack',         amount:499,   date:'Mar 10, 2025', method:'UPI',          status:'success', type:'material' },
  { id:'TXN005', student:'Kavya Reddy',    material:'NEET Biology DPP Pack',    amount:299,   date:'Mar 10, 2025', method:'UPI',          status:'success', type:'material' },
  { id:'TXN006', student:'Dev Verma',      material:'Commerce Decoded',         amount:14000, date:'Mar 9, 2025',  method:'Net Banking',  status:'pending', type:'course' },
  { id:'TXN007', student:'Arjun Sharma',   material:'JEE Advanced Full Course', amount:22500, date:'Mar 8, 2025',  method:'UPI',          status:'success', type:'course' },
  { id:'TXN008', student:'Meera Shah',     material:'JEE Advanced Full Course', amount:15000, date:'Mar 7, 2025',  method:'Cheque',       status:'failed',  type:'course' },
  { id:'TXN009', student:'Ravi Kumar',     material:'NEET Full Course',         amount:19000, date:'Mar 6, 2025',  method:'Debit Card',   status:'success', type:'course' },
  { id:'TXN010', student:'Priya Joshi',    material:'Calculus Formula Sheet',   amount:99,    date:'Mar 5, 2025',  method:'UPI',          status:'success', type:'material' },
];
}
