// Module: PAGES['faculty_feedback']
export function registerPage(PAGES) {
  PAGES['faculty_feedback'] = function() {
  var fb = [
    { st:'Sneha Patel',  r:5, c:'Explains concepts very clearly. Examples are excellent!',       d:'Mar 10',batch:'JEE A' },
    { st:'Arjun Sharma', r:5, c:'Best physics teacher I have had. Very patient with doubts.',    d:'Mar 9', batch:'JEE A' },
    { st:'Rohan Gupta',  r:4, c:'Good style. Would appreciate more solved examples.',             d:'Mar 8', batch:'JEE B' },
    { st:'Ananya Singh', r:5, c:'The way she derives formulas makes it easy to understand.',     d:'Mar 7', batch:'JEE A' },
  ];
  return '<div class="card"><div class="card-title" style="margin-bottom:14px">⭐ Feedback Received</div>'
    + fb.map(function(f) {
        return '<div class="card" style="margin-bottom:11px;background:var(--surface2)">'
          + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px">'
          + '<div style="display:flex;align-items:center;gap:8px">'
          + makeAv(f.st.charAt(0), 'rgba(0,212,200,.1)')
          + '<div><div style="font-weight:600;font-size:13px">' + f.st + '</div><div style="font-size:11px;color:var(--muted)">' + f.batch + ' • ' + f.d + '</div></div></div>'
          + '<span style="color:var(--yellow);font-size:13px">' + '⭐'.repeat(f.r) + '</span></div>'
          + '<div style="font-size:13px;color:var(--muted);font-style:italic">"' + f.c + '"</div></div>';
      }).join('') + '</div>';
};

// ═══════════════════════════════════════════════════════
// ADMIN PAGES
// ═══════════════════════════════════════════════════════
}
