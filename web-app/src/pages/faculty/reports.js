// Module: PAGES['faculty_reports']
export function registerPage(PAGES) {
  PAGES['faculty_reports'] = function() {
  var cards = [
    { label: 'Classes Taken', val: '42', col: 'var(--faculty)', key: 'classes_taken' },
    { label: 'Tests Created', val: '8', col: 'var(--purple)', key: 'tests_created' },
    { label: 'Doubts Resolved', val: '156', col: 'var(--student)', key: 'doubts_resolved' },
    { label: 'Student Rating', val: '4.7⭐', col: 'var(--yellow)', key: 'student_rating' }
  ];
  return '<div class="card"><div class="card-header"><div class="card-title">📋 Monthly Performance Report</div>'
    + '<button class="btn btn-sm btn-teal" onclick="window.exportFacultyReport()">⬇ Export All</button></div>'
    + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:11px">'
    + cards.map(function(c) {
        return '<div class="fee-card" style="text-align:center;cursor:pointer" onclick="window.viewFacultyReportDetail(\'' + c.key + '\')"><div style="font-size:22px;font-weight:800;color:' + c.col + ';font-family:Syne,sans-serif">' + c.val + '</div><div style="font-size:11px;color:var(--muted);margin-top:3px">' + c.label + '</div></div>';
      }).join('') + '</div></div>';
};
}
