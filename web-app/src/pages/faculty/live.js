// Module: PAGES['faculty_live']
export function registerPage(PAGES) {
  PAGES['faculty_live'] = function() {
  var upcoming = [
    { t:'11:00',batch:'JEE Adv B',topic:'Magnetic Effects',  n:98 },
    { t:'02:00',batch:'NEET Batch',topic:'Cell Biology',       n:72 },
    { t:'09:00',batch:'JEE Adv A', topic:'Modern Physics',    n:142,tomorrow:true },
    { t:'11:00',batch:'Crash',     topic:'Revision Mechanics', n:56, tomorrow:true },
  ];
  var liveCard = '<div class="card" style="border-color:rgba(255,45,107,.3);background:rgba(255,45,107,.03);margin-bottom:16px">'
    + '<div style="display:flex;justify-content:space-between;align-items:center">'
    + '<div><div class="live-badge" style="margin-bottom:7px"><div class="live-dot"></div>LIVE NOW</div>'
    + '<div style="font-family:Syne,sans-serif;font-size:16px;font-weight:700">Physics — Electrostatics: Gauss Law</div>'
    + '<div style="color:var(--muted);font-size:13px;margin-top:3px">JEE Advanced Batch A • 142 students</div></div>'
    + '<div style="display:flex;gap:7px">'
    + '<button class="btn btn-red" onclick="openFacultyClassModal(\'Electrostatics\',\'JEE Adv A\',\'09:00\',\'live\')">🔴 Manage</button>'
    + '<button class="btn btn-purple" onclick="toast(\'Attendance taken\',\'✅\')">✅</button></div></div></div>';

  var upHtml = '<div class="card"><div class="card-header"><div class="card-title">📅 Scheduled Classes</div>'
    + '<button class="btn btn-teal" onclick="openScheduleClassModal()">➕ Schedule</button></div>'
    + upcoming.map(function(c) {
        return '<div class="sched-item" onclick="openFacultyClassModal(\'' + c.topic + '\',\'' + c.batch + '\',\'' + c.t + '\',\'upcoming\')">'
          + '<div class="sched-time"><div class="st">' + c.t + '</div><div class="sd">' + (c.tomorrow?'Tmrw':'Today') + '</div></div>'
          + '<div class="sched-body"><div class="sched-title">' + c.batch + ': ' + c.topic + '</div><div class="sched-meta">' + c.n + ' students</div></div>'
          + '<div style="display:flex;gap:5px">'
          + '<button class="btn btn-sm btn-purple" onclick="event.stopPropagation();toast(\'Editing...\',\'✏️\')">✏️</button>'
          + '<button class="btn btn-sm btn-teal" onclick="event.stopPropagation();toast(\'Students notified!\',\'🔔\')">🔔</button></div></div>';
      }).join('') + '</div>';
  return liveCard + upHtml;
};

function openScheduleClassModal() {
  var body = makeInputGroup('Subject & Topic','text','e.g. Physics — Optics: Snell\'s Law')
    + '<div class="inp-row">'
    + makeInputGroup('Date','date','')
    + makeInputGroup('Time','time','')
    + '</div><div class="inp-row">'
    + makeInputGroup('Duration','select','60 min, 90 min, 120 min')
    + makeInputGroup('Platform','select','In-app Live, Zoom, Google Meet')
    + '</div>'
    + makeInputGroup('Assign Batch','select','JEE Advanced A, JEE Advanced B, NEET Batch, All Batches');
  openDetail('📅 Schedule New Class', body, '<button class="btn btn-solid" onclick="toast(\'Class scheduled!\',\'📅\');closeModal(\'modal-detail\')">✅ Schedule Class</button>');
}
}
