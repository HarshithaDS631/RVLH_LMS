// Module: PAGES['parent_calendar']
export function registerPage(PAGES) {
  PAGES['parent_calendar'] = function() {
  return '<div class="card">'
    + '<div class="card-header" style="display:flex;justify-content:space-between;align-items:center">'
    + '<div class="card-title">📅 School Calendar & Academic Events (March 2026)</div>'
    + '<div class="inner-tabs">'
    + '<button class="itab active">All Events</button>'
    + '<button class="itab">Exams</button>'
    + '<button class="itab">PTM</button>'
    + '<button class="itab">Holidays</button>'
    + '</div></div>'
    + '<div style="display:grid;gap:14px;margin-top:10px">'
    + '<div class="event-card">'
    + '<div style="width:60px;height:60px;border-radius:14px;background:rgba(255,45,107,0.12);border:1px solid rgba(255,45,107,0.3);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#ff2d6b;flex-shrink:0"><span style="font-size:18px;font-weight:800">25</span><span style="font-size:10px;text-transform:uppercase">MAR</span></div>'
    + '<div style="flex:1"><div style="font-size:15px;font-weight:800">JEE Advanced Full Mock Test 1</div><div style="font-size:12px;color:var(--muted);margin-top:2px">⏰ 09:00 AM - 12:00 PM | 📍 Main Auditorium / Online Portal</div></div>'
    + '<span class="badge badge-red">Exam</span>'
    + '</div>'
    + '<div class="event-card">'
    + '<div style="width:60px;height:60px;border-radius:14px;background:rgba(108,71,255,0.12);border:1px solid rgba(108,71,255,0.3);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#a78bff;flex-shrink:0"><span style="font-size:18px;font-weight:800">28</span><span style="font-size:10px;text-transform:uppercase">MAR</span></div>'
    + '<div style="flex:1"><div style="font-size:15px;font-weight:800">Parent-Teacher Meeting (PTM 2025)</div><div style="font-size:12px;color:var(--muted);margin-top:2px">⏰ 10:00 AM - 02:00 PM | 📍 RV Jayanagar Campus</div></div>'
    + '<span class="badge badge-purple">PTM</span>'
    + '</div>'
    + '<div class="event-card">'
    + '<div style="width:60px;height:60px;border-radius:14px;background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.3);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fbbf24;flex-shrink:0"><span style="font-size:18px;font-weight:800">30</span><span style="font-size:10px;text-transform:uppercase">MAR</span></div>'
    + '<div style="flex:1"><div style="font-size:15px;font-weight:800">Ugadi / Festivity Holiday</div><div style="font-size:12px;color:var(--muted);margin-top:2px">⏰ All Day | Institution closed</div></div>'
    + '<span class="badge badge-yellow">Holiday</span>'
    + '</div>'
    + '</div></div>';
};
}
