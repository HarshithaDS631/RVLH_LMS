// Module: PAGES['faculty_doubts']
export function registerPage(PAGES) {
  PAGES['faculty_doubts'] = function() {
  var statsHtml = '<div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">'
    + '<div class="stat-card" style="border-color:color-mix(in srgb,var(--admin) 28%,var(--border))" onclick="toast(\'Pending doubts\',\'💬\')">'
    + '<div class="stat-icon">💬</div>'
    + '<div class="stat-val" style="background:none;-webkit-text-fill-color:initial;color:#ff2d6b">5</div>'
    + '<div class="stat-label">Pending</div></div>'
    + '<div class="stat-card" style="border-color:color-mix(in srgb,var(--student) 28%,var(--border))" onclick="toast(\'Resolved doubts\',\'✅\')">'
    + '<div class="stat-icon">✅</div>'
    + '<div class="stat-val" style="background:none;-webkit-text-fill-color:initial;color:#4ade80">89</div>'
    + '<div class="stat-label">Resolved Today</div></div>'
    + '<div class="stat-card" style="border-color:color-mix(in srgb,var(--yellow) 28%,var(--border))" onclick="toast(\'Average response time\',\'⏱\')">'
    + '<div class="stat-icon">⏱</div>'
    + '<div class="stat-val" style="background:none;-webkit-text-fill-color:initial;color:#fbbf24">1.2h</div>'
    + '<div class="stat-label">Avg Response</div></div>'
    + '</div>';

  var doubts = window.LMS_DOUBTS || [
    { st:'Arjun Sharma', q:'Gauss Law for non-uniform fields',        batch:'JEE A',  t:'2h ago' },
    { st:'Sneha Patel',  q:'Torque derivation in magnetic field',     batch:'JEE A',  t:'3h ago' },
    { st:'Rohan Gupta',  q:'Work-energy theorem — when does it fail?',batch:'JEE B',  t:'5h ago' },
    { st:'Priya Joshi',  q:'Pseudo force — concept and examples',     batch:'JEE B',  t:'Yesterday' },
    { st:'Dev Verma',    q:'Scalar vs vector potential difference',    batch:'JEE A',  t:'Yesterday' },
  ];

  var dHtml = '<div class="card">' + doubts.map(function(d) {
    var studentName = d.st || d.student || 'Student';
    var batchName = d.batch || (d.sub ? d.sub : 'General');
    var timeLabel = d.t || 'Just now';
    return '<div class="list-item" onclick="openResolveDoubt(\'' + studentName.replace(/'/g,"\\'") + '\',\'' + d.q.replace(/'/g,"\\'") + '\')">'
      + makeAv(studentName.charAt(0), 'rgba(0,212,200,.1)')
      + '<div class="li-content"><div class="li-title">' + d.q + '</div><div class="li-sub">' + studentName + ' • ' + batchName + ' • ' + timeLabel + '</div></div>'
      + '<button class="btn btn-sm btn-teal" onclick="event.stopPropagation();openResolveDoubt(\'' + studentName.replace(/'/g,"\\'") + '\',\'' + d.q.replace(/'/g,"\\'") + '\')">Reply</button></div>';
  }).join('') + '</div>';

  return statsHtml + dHtml;
};
}
