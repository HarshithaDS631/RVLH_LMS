// Module: PAGES['faculty_dashboard']
export function registerPage(PAGES) {
  PAGES['faculty_dashboard'] = function() {
  var stats = makeStats([
    { icon:'👥', val:'4',   label:'Active Batches',   change:'JEE & NEET',       col:'var(--faculty)' },
    { icon:'👨‍🎓',val:'312', label:'Total Students',  change:'All batches',       col:'var(--student)' },
    { icon:'📹', val:'48',  label:'Lectures Uploaded',change:'+3 this week',      col:'var(--purple)' },
    { icon:'⭐', val:'4.7', label:'Average Rating',   change:'89 reviews',        col:'var(--yellow)' },
  ]);
  var todayClasses = [
    { t:'09:00', batch:'JEE Adv A', topic:'Electrostatics - Gauss Law', n:142, live:true },
    { t:'11:00', batch:'JEE Adv B', topic:'Magnetic Effects',           n:98,  live:false },
    { t:'02:00', batch:'NEET Batch',topic:'Cell Biology - Mitosis',     n:72,  live:false },
  ];
  var clHtml = todayClasses.map(function(c) {
    return '<div class="sched-item" onclick="openFacultyClassModal(\'' + c.topic.replace(/'/g,"\\'") + '\',\'' + c.batch + '\',\'' + c.t + '\',\'' + (c.live?'live':'upcoming') + '\')">'
      + '<div class="sched-time"><div class="st">' + c.t + '</div><div class="sd">' + (c.live?'NOW':'') + '</div></div>'
      + '<div class="sched-body"><div class="sched-title">' + c.batch + ': ' + c.topic + '</div>'
      + '<div class="sched-meta">' + c.n + ' students <span class="badge ' + (c.live?'badge-red':'badge-purple') + '" style="margin-left:5px">' + (c.live?'🔴 LIVE':'⏳ Upcoming') + '</span></div></div></div>';
  }).join('');

  var pendingDoubts = [
    { st:'Arjun Sharma',  q:'Gauss Law for non-uniform fields', t:'2h ago' },
    { st:'Sneha Patel',   q:'Torque derivation in magnetic field',t:'3h ago' },
    { st:'Rohan Gupta',   q:'Work-energy theorem proof',         t:'5h ago' },
    { st:'Priya Joshi',   q:'Concept of pseudo force',           t:'Yesterday' },
  ];
  var dHtml = pendingDoubts.map(function(d) {
    return '<div class="list-item" onclick="openResolveDoubt(\'' + d.st.replace(/'/g,"\\'") + '\',\'' + d.q.replace(/'/g,"\\'") + '\')">'
      + makeAv(d.st.charAt(0), 'rgba(0,212,200,.1)')
      + '<div class="li-content"><div class="li-title">' + d.q + '</div><div class="li-sub">' + d.st + ' • ' + d.t + '</div></div>'
      + '<button class="btn btn-sm btn-teal" onclick="event.stopPropagation();openResolveDoubt(\'' + d.st.replace(/'/g,"\\'") + '\',\'' + d.q.replace(/'/g,"\\'") + '\')">Reply</button></div>';
  }).join('');

  var batches = [
    { b:'JEE Advanced A', n:142, avg:78, att:'87%', tests:12 },
    { b:'JEE Advanced B', n:98,  avg:72, att:'82%', tests:10 },
    { b:'NEET Batch 2025',n:72,  avg:80, att:'90%', tests:8 },
  ];
  var bHtml = '<div class="tbl-wrap"><table><thead><tr><th>Batch</th><th>Students</th><th>Avg Score</th><th>Attendance</th><th>Tests</th><th>Action</th></tr></thead><tbody>'
    + batches.map(function(b) {
        return '<tr onclick="toast(\'Loading ' + b.b + '\',\'📊\')">'
          + '<td>' + b.b + '</td><td>' + b.n + '</td>'
          + '<td><span style="color:var(--faculty);font-weight:700">' + b.avg + '%</span></td>'
          + '<td>' + b.att + '</td><td>' + b.tests + '</td>'
          + '<td><button class="btn btn-sm btn-teal" onclick="event.stopPropagation();toast(\'Opening batch\',\'👥\')">View</button></td></tr>';
      }).join('') + '</tbody></table></div>';

  return stats
    + '<div class="grid-2">'
    + '<div class="card"><div class="card-header"><div class="card-title">📡 Today\'s Classes</div><button class="card-act" onclick="loadPage(\'live\')">Manage</button></div>' + clHtml + '</div>'
    + '<div class="card"><div class="card-header"><div class="card-title">💬 Pending Doubts</div><button class="card-act" onclick="loadPage(\'doubts\')">Resolve All</button></div>' + dHtml + '</div>'
    + '</div>'
    + '<div class="card"><div class="card-header"><div class="card-title">📊 Batch Overview</div><button class="card-act" onclick="loadPage(\'analytics\')">Full Analytics</button></div>' + bHtml + '</div>';
};

function openFacultyClassModal(topic, batch, time, status) {
  var isLive = status === 'live';
  var body = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:15px">'
    + makeFeeCard('Batch', batch) + makeFeeCard('Time', time) + '</div>'
    + (isLive
      ? '<div class="video-box" style="margin-bottom:13px"><div class="video-inner"><div class="live-badge"><div class="live-dot"></div>CLASS IS LIVE</div><button class="play-btn" onclick="toast(\'Joining...\',\'📡\')">▶</button></div></div>'
        + '<div style="display:flex;gap:8px"><button class="btn btn-red" onclick="toast(\'Going live!\',\'📡\');closeModal(\'modal-detail\')">🔴 Go Live</button>'
        + '<button class="btn btn-purple" onclick="toast(\'Attendance taken\',\'✅\')">✅ Attendance</button></div>'
      : '<div style="display:flex;gap:8px"><button class="btn btn-teal" onclick="toast(\'Class started!\',\'📡\');closeModal(\'modal-detail\')">▶ Start Class</button>'
        + '<button class="btn btn-purple" onclick="toast(\'Students notified!\',\'🔔\')">🔔 Notify</button></div>');
  openDetail('📡 ' + topic, body, '');
}

function openResolveDoubt(student, doubtText) {
  var doubt = (window.LMS_DOUBTS || []).find(function(d) { return d.q === doubtText; });
  var doubtId = doubt ? doubt._id : '';

  var body = '<div class="fee-card" style="margin-bottom:13px">'
    + '<div style="font-size:12px;color:var(--muted);margin-bottom:5px">STUDENT QUESTION</div>'
    + '<div style="font-size:13px;font-weight:500">' + doubtText + '</div></div>'
    + '<div class="inp-group"><label>Your Answer</label>'
    + '<textarea id="doubt-resolve-textarea" class="inp-field" placeholder="Type your response here..." rows="4" style="width:100%;resize:vertical;margin-top:4px"></textarea></div>'
    + '<div class="inp-group"><label>Attach Resource</label>'
    + '<div style="display:flex;gap:7px;margin-top:4px">'
    + '<button class="btn btn-purple" onclick="toast(\'Image upload\',\'🖼\')">🖼 Image</button>'
    + '<button class="btn btn-purple" onclick="toast(\'Video upload\',\'📹\')">📹 Video</button>'
    + '<button class="btn btn-purple" onclick="toast(\'PDF upload\',\'📄\')">📄 PDF</button></div></div>';
  openDetail('💬 Resolve Doubt — ' + student, body, '<button class="btn btn-solid" onclick="window.submitDoubtResolution(\'' + doubtId + '\')">📤 Post Answer</button>');
}
}
