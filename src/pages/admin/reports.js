// Module: PAGES['admin_reports']
export function registerPage(PAGES) {
  PAGES['admin_reports'] = function() {
  var rState = window._repState || { tab: null };
  window._repState = rState;

  // ── 8 live stats ──
  var totalVideos = 0, totalMats = 0;
  if (typeof MEDIA_DB !== 'undefined') {
    Object.keys(MEDIA_DB).forEach(function(cn){
      Object.keys(MEDIA_DB[cn]).forEach(function(sn){
        totalVideos += MEDIA_DB[cn][sn].videos.length;
        totalMats   += MEDIA_DB[cn][sn].materials.length;
      });
    });
  }
  var totalStudents = typeof ADMIN_STUDENTS !== 'undefined' ? ADMIN_STUDENTS.length : 5;
  var totalFaculty  = typeof ADMIN_FACULTY  !== 'undefined' ? ADMIN_FACULTY.length  : 4;
  var totalCourses  = typeof COURSE_DB      !== 'undefined' ? COURSE_DB.length      : 5;
  var enrolled = typeof COURSE_DB !== 'undefined'
    ? COURSE_DB.reduce(function(a,cr){return a+cr.enrolled;},0) : 368;

  var statsHtml = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:20px">'
    + [
      { icon:'👨‍🎓', val:enrolled,       label:'Enrolled Students', col:'var(--student)', page:'enrollment_report' },
      { icon:'📊',  val:'78%',          label:'Avg Performance',   col:'var(--faculty)', page:'academic_report' },
      { icon:'✅',  val:'85%',          label:'Avg Attendance',    col:'var(--purple)',  page:'attendance_report' },
      { icon:'💰',  val:'₹84.2L',       label:'Annual Revenue',    col:'var(--yellow)',  page:'revenue_report' },
      { icon:'👥',  val:totalStudents,  label:'Total Students',    col:'var(--admin)',   page:'enrollment_report' },
      { icon:'👨‍🏫', val:totalFaculty,   label:'Faculty',           col:'var(--orange)',  page:'faculty_report' },
      { icon:'🎬',  val:totalVideos,    label:'Videos',            col:'var(--purple)',  page:'app_usage_report' },
      { icon:'📄',  val:totalMats,      label:'Materials',         col:'var(--faculty)', page:'app_usage_report' },
    ].map(function(s) {
      return '<div class="stat-card" style="border-color:color-mix(in srgb,'+s.col+' 28%,var(--border));cursor:pointer" onclick="openReport(\''+s.page+'\')">'
        + '<div class="stat-icon">'+s.icon+'</div>'
        + '<div class="stat-val" style="color:'+s.col+'">'+s.val+'</div>'
        + '<div class="stat-label">'+s.label+'</div></div>';
    }).join('') + '</div>';

  // Revenue 2024 chart with export
  var months  = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
  var revVals = [62,68,55,72,75,80,85,88,78,90,86,95];
  var revAmts = [5.2,5.7,4.6,6.0,6.3,6.7,7.1,7.3,6.5,7.5,7.2,7.9];
  var maxV = Math.max.apply(null, revVals);
  var revChart = (function(){
    var html = '<div style="display:flex;align-items:flex-end;gap:6px;height:120px;margin-top:8px">';
    for (var i=0; i<revVals.length; i++) {
      var h = Math.round(revVals[i]/maxV*90);
      var tip = months[i] + ' 2024: Rs.' + revAmts[i] + 'L';
      html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer" title="' + tip + '" onclick="toast(\'' + months[i] + ' revenue\',\'\u{1F4B0}\')">';
      html += '<div style="font-size:9px;color:var(--student)">' + revAmts[i] + 'L</div>';
      html += '<div style="width:100%;border-radius:4px 4px 0 0;background:linear-gradient(180deg,var(--yellow),rgba(251,191,36,.3));height:' + h + 'px"></div>';
      html += '<div style="font-size:9px;color:var(--muted)">' + months[i] + '</div></div>';
    }
    html += '</div>';
    return html;
  })();

  var revCard = '<div class="card"><div class="card-header"><div class="card-title">📈 Revenue 2024–25</div>'
    + '<button class="btn btn-sm btn-teal" onclick="exportRevenueCSV()">⬇ Export CSV</button></div>'
    + revChart + '</div>';

  // Generate Reports cards — all functional
  var reports = [
    { id:'enrollment_report',   l:'📊 Enrollment Report',    d:'Total enrolled, course-wise, dropout stats' },
    { id:'attendance_report',   l:'✅ Attendance Report',     d:'Batch-wise and student-wise attendance' },
    { id:'academic_report',     l:'📝 Academic Report',       d:'Test averages, top performers, trends' },
    { id:'faculty_report',      l:'👨‍🏫 Faculty Report',       d:'Ratings, classes taken, coverage' },
    { id:'revenue_report',      l:'💰 Revenue Report',        d:'Collection vs target, pending, overdue' },
    { id:'app_usage_report',    l:'📱 App Usage Report',      d:'Logins, video views, material downloads' },
  ];
  var repHtml = '<div class="grid-3">'
    + reports.map(function(r) {
        return '<div class="card" style="cursor:pointer;transition:all .18s" onmouseenter="this.style.background=\'var(--surface2)\'" onmouseleave="this.style.background=\'\'" onclick="openReport(\''+r.id+'\')">'
          + '<div style="font-weight:600;font-size:13px;margin-bottom:3px">'+r.l+'</div>'
          + '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+r.d+'</div>'
          + '<div style="display:flex;gap:6px">'
          + '<button class="btn btn-sm btn-purple" onclick="event.stopPropagation();openReport(\''+r.id+'\')">📊 View</button>'
          + '<button class="btn btn-sm btn-teal" onclick="event.stopPropagation();exportReport(\''+r.id+'\')">⬇ Export</button>'
          + '</div></div>';
      }).join('') + '</div>';

  return statsHtml
    + '<div class="grid-2">'
    + revCard
    + '<div class="card"><div class="card-title" style="margin-bottom:14px">📊 Enrollment by Course</div>'
    + (function(){
        if (typeof COURSE_DB === 'undefined') return '';
        var maxE = Math.max.apply(null, COURSE_DB.map(function(cr){return cr.enrolled;}));
        return '<div style="display:flex;flex-direction:column;gap:8px">'
          + COURSE_DB.map(function(cr){
              var pct = maxE ? Math.round(cr.enrolled/cr.maxSt*100) : 0;
              return '<div><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">'
                + '<span>'+cr.n.split('(')[0].trim()+'</span><span style="color:'+cr.col+'">'+cr.enrolled+'/'+cr.maxSt+'</span></div>'
                + '<div style="height:7px;background:var(--surface2);border-radius:4px"><div style="height:7px;border-radius:4px;background:'+cr.col+';width:'+pct+'%"></div></div></div>';
            }).join('') + '</div>';
      })()
    + '</div></div>'
    + '<div class="card" style="margin-top:16px"><div class="card-header"><div class="card-title">📋 Generate Reports</div></div>'
    + repHtml + '</div>';
};

// ── REPORT VIEWER ──
function openReport(reportId) {
  var enrolled = typeof COURSE_DB !== 'undefined'
    ? COURSE_DB.reduce(function(a,cr){return a+cr.enrolled;},0) : 368;

  var configs = {
    enrollment_report: {
      title: '📊 Enrollment Report',
      build: function() {
        var rows = (typeof COURSE_DB !== 'undefined' ? COURSE_DB : []).map(function(cr){
          var pct = Math.round(cr.enrolled/cr.maxSt*100);
          return '<tr><td style="font-weight:600">'+cr.n.split('(')[0].trim()+'</td><td>'+cr.cat+'</td>'
            + '<td style="color:var(--student);font-weight:700">'+cr.enrolled+'</td>'
            + '<td style="color:var(--muted)">'+cr.maxSt+'</td>'
            + '<td><div style="display:flex;align-items:center;gap:7px"><div style="flex:1;height:5px;background:var(--surface2);border-radius:3px"><div style="height:5px;border-radius:3px;background:'+cr.col+';width:'+pct+'%"></div></div><span style="font-size:12px">'+pct+'%</span></div></td>'
            + '<td><button class="btn btn-sm btn-teal" onclick="exportStudentList(\'enrollment_report\',\''+cr.n.replace(/'/g,"\\'")+'\')" title="Download students for '+cr.n.split('(')[0].trim()+'">⬇ Download</button></td>'
            + '<td><span class="badge '+(cr.pub?'badge-green':'badge-yellow')+'">'+(cr.pub?'Active':'Draft')+'</span></td></tr>';
        }).join('');
        return '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:11px;margin-bottom:16px">'
          + [['Total Enrolled',enrolled,'var(--student)'],['Active Courses',typeof COURSE_DB!=='undefined'?COURSE_DB.filter(function(cr){return cr.pub;}).length:4,'var(--faculty)'],['Dropout Rate','2.3%','var(--admin)']].map(function(s){
              return '<div class="fee-card" style="text-align:center"><div style="font-size:22px;font-weight:800;color:'+s[2]+';font-family:Syne">'+s[1]+'</div><div style="font-size:11px;color:var(--muted);margin-top:3px">'+s[0]+'</div></div>';
            }).join('') + '</div>'
          + '<div class="tbl-wrap"><table><thead><tr><th>Course</th><th>Category</th><th>Enrolled</th><th>Capacity</th><th>Fill Rate</th><th>Student List</th><th>Status</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
      }
    },
    attendance_report: {
      title: '✅ Attendance Report',
      build: function() {
        var data = [
          { b:'JEE Advanced (Main + KCET Decoded)', avg:87, students:142, below75:12, col:'#ff2d6b' },
          { b:'JEE (Main + KCET Decoded)',          avg:82, students:98,  below75:18, col:'#6c47ff' },
          { b:'NEET UG Decoded',                    avg:90, students:72,  below75:5,  col:'#4ade80' },
          { b:'Commerce Decoded Programme',         avg:88, students:56,  below75:4,  col:'#fbbf24' },
        ];
        var rows = data.map(function(b){
          return '<tr><td style="font-weight:600">'+b.b.split('(')[0].trim()+'</td>'
            + '<td>'+b.students+'</td>'
            + '<td><span style="font-weight:700;color:'+(b.avg>=85?'var(--student)':'var(--orange)')+'">'+b.avg+'%</span></td>'
            + '<td><span style="color:var(--admin)">'+b.below75+'</span></td>'
            + '<td><div style="height:6px;background:var(--surface2);border-radius:3px"><div style="height:6px;border-radius:3px;background:'+b.col+';width:'+b.avg+'%"></div></div></td>'
            + '<td><button class="btn btn-sm btn-teal" onclick="exportStudentList(\'attendance_report\',\''+b.b+'\')">⬇ Download</button></td></tr>';
        }).join('');
        return '<div class="tbl-wrap"><table><thead><tr><th>Course/Batch</th><th>Students</th><th>Avg Attendance</th><th>Below 75%</th><th>Visual</th><th>Student List</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
      }
    },
    academic_report: {
      title: '📝 Academic Report',
      build: function() {
        var students = typeof ADMIN_STUDENTS !== 'undefined' ? ADMIN_STUDENTS : [];
        var subjects = ['Physics','Chemistry','Mathematics','Biology','Accountancy'];
        var rows = students.map(function(st){
          var scores = subjects.map(function(){ return Math.floor(Math.random()*30+60); });
          var avg = Math.round(scores.reduce(function(a,b){return a+b;},0)/scores.length);
          return '<tr><td style="font-weight:600">'+st.n+'</td><td style="font-size:11px;color:var(--muted)">'+st.course.split('(')[0].trim()+'</td>'
            + scores.map(function(sc){ return '<td><span style="color:'+(sc>=80?'var(--student)':sc>=65?'var(--yellow)':'var(--admin)')+'">'+sc+'%</span></td>'; }).join('')
            + '<td><strong style="color:var(--purple)">'+avg+'%</strong></td>'
            + '<td><button class="btn btn-sm btn-teal" onclick="exportStudentList(\'academic_report\',\''+st.course+'\')">⬇ Download</button></td></tr>';
        }).join('');
        return '<div class="tbl-wrap"><table><thead><tr><th>Student</th><th>Course</th><th>Physics</th><th>Chemistry</th><th>Mathematics</th><th>Biology</th><th>Accountancy</th><th>Avg</th><th>Student List</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
      }
    },
    faculty_report: {
      title: '👨‍🏫 Faculty Report',
      build: function() {
        var faculty = typeof ADMIN_FACULTY !== 'undefined' ? ADMIN_FACULTY : [];
        var rows = faculty.map(function(f){
          var classes = Math.floor(Math.random()*20+30);
          var tests = Math.floor(Math.random()*8+4);
          var doubts = Math.floor(Math.random()*100+50);
          return '<tr><td style="font-weight:600">'+f.n+'</td><td>'+f.sub+'</td><td>'+f.course.split('(')[0].trim()+'</td>'
            + '<td>'+classes+'</td><td>'+tests+'</td><td>'+doubts+'</td>'
            + '<td><span style="color:var(--yellow);font-weight:700">⭐ '+f.rat+'</span></td>'
            + '<td><span class="badge '+(f.st==='active'?'badge-green':'badge-red')+'">'+f.st+'</span></td>'
            + '<td><button class="btn btn-sm btn-teal" onclick="exportStudentList(\'faculty_report\',\''+f.course+'\')">⬇ Download</button></td></tr>';
        }).join('');
        return '<div class="tbl-wrap"><table><thead><tr><th>Faculty</th><th>Subject</th><th>Course</th><th>Classes</th><th>Tests</th><th>Doubts</th><th>Rating</th><th>Status</th><th>Student List</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
      }
    },
    revenue_report: {
      title: '💰 Revenue Report',
      build: function() {
        var feeData = typeof FEE_COURSE_DATA !== 'undefined' ? FEE_COURSE_DATA : [];
        var total = feeData.reduce(function(a,cd){return a+cd.collected;},0);
        var pending = feeData.reduce(function(a,cd){return a+cd.pending;},0);
        var rows = feeData.map(function(cd){
          var pct = Math.round(cd.collected/(cd.collected+cd.pending)*100);
          return '<tr><td style="font-weight:600">'+cd.n.split('(')[0].trim()+'</td>'
            + '<td>'+cd.students+'</td>'
            + '<td>₹'+cd.fee.toLocaleString('en-IN')+'</td>'
            + '<td style="color:var(--student);font-weight:700">₹'+cd.collected.toLocaleString('en-IN')+'</td>'
            + '<td><div style="display:flex;align-items:center;gap:6px"><div style="flex:1;height:5px;background:var(--surface2);border-radius:3px"><div style="height:5px;background:'+cd.col+';border-radius:3px;width:'+pct+'%"></div></div>'+pct+'%</div></td>'
            + '<td><button class="btn btn-sm btn-teal" onclick="exportStudentList(\'revenue_report\',\''+cd.n.replace(/'/g,"\\'")+'\')" title="Download students">⬇ Download</button></td>'
            + '<td><button class="btn btn-sm btn-purple" onclick="downloadCourseData(\''+cd.n.replace(/'/g,"\\'")+'\')" >⬇ CSV</button></td></tr>';
        }).join('');
        var summary = '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:11px;margin-bottom:14px">'
          + [['Total Collected','₹'+total.toLocaleString('en-IN'),'var(--student)'],['Collection Rate',Math.round(total/(total+pending)*100)+'%','var(--yellow)']].map(function(s){
              return '<div class="fee-card" style="text-align:center"><div style="font-size:20px;font-weight:800;color:'+s[2]+';font-family:Syne">'+s[1]+'</div><div style="font-size:11px;color:var(--muted);margin-top:3px">'+s[0]+'</div></div>';
            }).join('')+'</div>';
        return summary + '<div class="tbl-wrap"><table><thead><tr><th>Course</th><th>Students</th><th>Fee/Student</th><th>Collected</th><th>Rate</th><th>Student List</th><th>Export</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
      }
    },
    app_usage_report: {
      title: '📱 App Usage Report',
      build: function() {
        var totalVideos = 0, totalMats = 0;
        if (typeof MEDIA_DB !== 'undefined') {
          Object.keys(MEDIA_DB).forEach(function(cn){
            Object.keys(MEDIA_DB[cn]).forEach(function(sn){
              totalVideos += MEDIA_DB[cn][sn].videos.length;
              totalMats   += MEDIA_DB[cn][sn].materials.length;
            });
          });
        }
        var usageData = [
          { label:'Daily Active Users',   val:'312', trend:'↑8%', col:'var(--student)' },
          { label:'Video Views (Month)',   val:totalVideos*120+'', trend:'↑15%', col:'var(--orange)' },
          { label:'Material Downloads',   val:totalMats*85+'',    trend:'↑12%', col:'var(--purple)' },
          { label:'Live Class Joins',     val:'2,847',            trend:'↑5%',  col:'var(--faculty)' },
          { label:'Quiz Attempts',        val:'1,204',            trend:'↑22%', col:'var(--yellow)' },
          { label:'Avg Session (min)',    val:'42',               trend:'↑3%',  col:'var(--admin)' },
        ];
        var students_au = typeof ADMIN_STUDENTS !== 'undefined' ? ADMIN_STUDENTS : [];
        return '<div class="tbl-wrap" style="margin-bottom:16px"><table><thead><tr><th>Metric</th><th>Value</th><th>Trend</th><th>Student List</th></tr></thead><tbody>'
          + usageData.map(function(u){
              return '<tr>'
                + '<td style="font-weight:600">'+u.label+'</td>'
                + '<td><span style="font-family:Syne,sans-serif;font-weight:700;color:'+u.col+'">'+u.val+'</span></td>'
                + '<td><span style="color:var(--student);font-size:12px">'+u.trend+'</span></td>'
                + '<td><button class="btn btn-sm btn-teal" onclick="exportStudentList(\'app_usage_report\')">⬇ Download</button></td>'
                + '</tr>';
            }).join('') + '</tbody></table></div>'
          + '<div class="card"><div class="card-title" style="margin-bottom:10px">📊 Top Videos by Views</div>'
          + (function(){
              var allVids = [];
              if (typeof MEDIA_DB !== 'undefined') {
                Object.keys(MEDIA_DB).forEach(function(cn){ Object.keys(MEDIA_DB[cn]).forEach(function(sn){ MEDIA_DB[cn][sn].videos.forEach(function(v){allVids.push({t:v.t,views:v.views,fac:v.fac,sub:sn});}); }); });
              }
              allVids.sort(function(a,b){return b.views-a.views;});
              return allVids.slice(0,6).map(function(v){
                return '<div class="list-item"><div class="li-icon" style="background:rgba(255,107,53,.1)">🎬</div>'
                  + '<div class="li-content"><div class="li-title">'+v.t+'</div><div class="li-sub">'+v.fac+' • '+v.sub+'</div></div>'
                  + '<span style="color:var(--orange);font-weight:700">👁 '+v.views+'</span></div>';
              }).join('');
            })() + '</div>';
      }
    },
  };

  var cfg = configs[reportId];
  if (!cfg) { toast('Report not found', '⚠️'); return; }
  var title = cfg.title;

  openDetail(title,
    '<div style="margin-bottom:14px">'+cfg.build()+'</div>',
    '<button class="btn btn-teal" onclick="exportReport(\''+reportId+'\')">⬇ Export Report CSV</button>');
}

function exportStudentList(reportId, courseFilter) {
  var allStudents = typeof ADMIN_STUDENTS !== 'undefined' ? ADMIN_STUDENTS : [];
  var students = courseFilter ? allStudents.filter(function(s){ return s.course === courseFilter; }) : allStudents;
  var rows = [['Roll No','Name','Email','Course','Campus','Fee Status','Status']].concat(
    students.map(function(s){return [s.roll,s.n,s.email,s.course,s.campus,s.fee,s.st];}));
  var csv = rows.map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join('\n');
  var blob = new Blob([csv],{type:'text/csv'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download='students_list_'+(reportId||'report')+'.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Students list exported! ('+students.length+' students)','👥');
}

function exportReport(reportId) {
  var titles = {
    enrollment_report:'Enrollment Report',
    attendance_report:'Attendance Report',academic_report:'Academic Report',
    faculty_report:'Faculty Report',revenue_report:'Revenue Report',app_usage_report:'App Usage Report'
  };
  var rows = [];
  var students = typeof ADMIN_STUDENTS !== 'undefined' ? ADMIN_STUDENTS : [];
  if (reportId === 'enrollment_report' && typeof COURSE_DB !== 'undefined') {
    rows = [['Course','Category','Enrolled','Capacity','Fill %','Status']].concat(
      COURSE_DB.map(function(cr){return [cr.n,cr.cat,cr.enrolled,cr.maxSt,Math.round(cr.enrolled/cr.maxSt*100)+'%',cr.pub?'Active':'Draft'];}));
    if (students.length) {
      rows.push([]); rows.push(['--- STUDENT LIST ---']);
      rows.push(['Roll No','Name','Email','Course','Campus','Fee Status','Status']);
      students.forEach(function(s){rows.push([s.roll,s.n,s.email,s.course,s.campus,s.fee,s.st]);});
    }
  } else if (reportId === 'attendance_report') {
    rows = [['Roll No','Name','Course','Campus','Attendance %','Status']].concat(
      students.map(function(s){ var att=Math.floor(Math.random()*30+65); return [s.roll,s.n,s.course,s.campus,att+'%',att>=75?'Regular':'Low Attendance']; }));
  } else if (reportId === 'academic_report') {
    rows = [['Roll No','Name','Course','Physics','Chemistry','Mathematics','Biology','Accountancy','Average']].concat(
      students.map(function(s){
        var scores=[Math.floor(Math.random()*30+60),Math.floor(Math.random()*30+60),Math.floor(Math.random()*30+60),Math.floor(Math.random()*30+60),Math.floor(Math.random()*30+60)];
        var avg=Math.round(scores.reduce(function(a,b){return a+b;},0)/scores.length);
        return [s.roll,s.n,s.course].concat(scores).concat([avg+'%']);
      }));
  } else if (reportId === 'revenue_report' && typeof FEE_COURSE_DATA !== 'undefined') {
    rows = [['Course','Students','Fee','Collected','Pending','Rate']].concat(
      FEE_COURSE_DATA.map(function(cd){return [cd.n,cd.students,'₹'+cd.fee,'₹'+cd.collected,'₹'+cd.pending,Math.round(cd.collected/(cd.collected+cd.pending)*100)+'%'];}));
    if (typeof FEE_STUDENTS !== 'undefined' && FEE_STUDENTS.length) {
      rows.push([]); rows.push(['--- FEE DETAILS PER STUDENT ---']);
      rows.push(['Roll No','Name','Course','Total Fee','Paid','Pending','Status']);
      FEE_STUDENTS.forEach(function(s){rows.push([s.roll,s.n,s.course,'₹'+s.amount,'₹'+s.paid,'₹'+s.pending,s.st]);});
    }
  } else if (reportId === 'faculty_report' && typeof ADMIN_FACULTY !== 'undefined') {
    rows = [['Name','Subject','Course','Rating','Status']].concat(
      ADMIN_FACULTY.map(function(f){return [f.n,f.sub,f.course,f.rat,f.st];}));
    if (students.length) {
      rows.push([]); rows.push(['--- STUDENT LIST ---']);
      rows.push(['Roll No','Name','Course','Campus','Status']);
      students.forEach(function(s){rows.push([s.roll,s.n,s.course,s.campus,s.st]);});
    }
  } else if (reportId === 'app_usage_report') {
    rows = [['Metric','Value','Trend'],['Daily Active Users','312','↑8%'],['Video Views (Month)','38400','↑15%'],['Material Downloads','1700','↑12%'],['Live Class Joins','2847','↑5%'],['Quiz Attempts','1204','↑22%'],['Avg Session (min)','42','↑3%']];
    if (students.length) {
      rows.push([]); rows.push(['--- STUDENT LIST ---']);
      rows.push(['Roll No','Name','Course','Campus','Fee Status','Status']);
      students.forEach(function(s){rows.push([s.roll,s.n,s.course,s.campus,s.fee,s.st]);});
    }
  } else {
    rows = [['Report','Generated','Date'],[(titles[reportId]||reportId),'RV Learning Hub',new Date().toLocaleDateString()]];
    if (students.length) {
      rows.push([]); rows.push(['--- STUDENT LIST ---']);
      rows.push(['Roll No','Name','Email','Course','Campus','Fee Status','Status']);
      students.forEach(function(s){rows.push([s.roll,s.n,s.email,s.course,s.campus,s.fee,s.st]);});
    }
  }
  var csv = rows.map(function(r){return r.map(function(v){return '"'+String(v||'').replace(/"/g,'""')+'"';}).join(',');}).join('\n');
  var blob = new Blob([csv],{type:'text/csv'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download=(reportId)+'.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast((titles[reportId]||'Report')+' exported with student list!','⬇');
}


function openGenerateReportModal() {
  var rTypes = [
    { id:'enrollment_report',   l:'📊 Enrollment Report',    d:'Total enrolled, course-wise, capacity stats' },
    { id:'attendance_report',   l:'✅ Attendance Report',    d:'Batch-wise and student-wise attendance' },
    { id:'academic_report',     l:'📝 Academic Report',      d:'Test averages, top performers, trends' },
    { id:'faculty_report',      l:'👨‍🏫 Faculty Report',      d:'Ratings, classes taken, subject coverage' },
    { id:'revenue_report',      l:'💰 Revenue Report',       d:'Collection vs target, pending, overdue' },
    { id:'app_usage_report',    l:'📱 App Usage Report',     d:'Logins, video views, material downloads' },
  ];
  var body = '<div style="font-size:13px;color:var(--muted);margin-bottom:16px">Select a report to generate, view and export. All reports include a full student list.</div>'
    + '<div style="display:flex;flex-direction:column;gap:9px">'
    + rTypes.map(function(r) {
        return '<div style="display:flex;align-items:center;gap:12px;padding:13px;background:var(--surface2);border-radius:10px;border:1px solid rgba(255,255,255,0.07);cursor:pointer;transition:all .18s" '
          + 'onclick="openReport(\''+r.id+'\')" onmouseover="this.style.borderColor=\'var(--purple)\'" onmouseout="this.style.borderColor=\'var(--border)\'">'
          + '<div style="flex:1"><div style="font-weight:600;font-size:13px">'+r.l+'</div>'
          + '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+r.d+'</div></div>'
          + '<div style="display:flex;gap:6px">'
          + '<button class="btn btn-sm btn-purple" onclick="event.stopPropagation();openReport(\''+r.id+'\')">👁 View</button>'
          + '<button class="btn btn-sm btn-teal" onclick="event.stopPropagation();exportReport(\''+r.id+'\')">⬇ Report+Students</button>'
          + '<button class="btn btn-sm btn-green" onclick="event.stopPropagation();exportStudentList(\''+r.id+'\')">👥 Students</button>'
          + '</div></div>';
      }).join('') + '</div>';
  openDetail('📊 Generate Reports', body, '');
}

function exportRevenueCSV() {
  var months = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
  var revAmts = [5.2,5.7,4.6,6.0,6.3,6.7,7.1,7.3,6.5,7.5,7.2,7.9];
  var rows = [['Month','Revenue (Lakhs)','Revenue (₹)']].concat(
    months.map(function(m,i){return [m+' 2024',revAmts[i],Math.round(revAmts[i]*100000)];}));
  var csv = rows.map(function(r){return r.join(',');}).join('\n');
  var blob = new Blob([csv],{type:'text/csv'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download='revenue_2024_25.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Revenue 2024–25 exported!','⬇');
}
}
