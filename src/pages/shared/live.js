// Module: PAGES['shared_live']
export function registerPage(PAGES) {
  PAGES['shared_live'] = function() {
  var upcoming = [
    { time:'11:30 AM', date:'Today',    sub:'Chemistry', topic:'Aldehydes & Ketones',   fac:'Prof. Amit Singh', n:98 },
    { time:'02:00 PM', date:'Today',    sub:'Maths',     topic:'Integration by Parts',  fac:'Mr. Raj Sharma',   n:115 },
    { time:'09:00 AM', date:'Tomorrow', sub:'Physics',   topic:'Magnetic Effects',      fac:'Dr. Priya Mehta',  n:142 },
  ];
  var recorded = [
    { title:"Electrostatics - Coulomb's Law", sub:'Physics',  dur:'58 min', views:312 },
    { title:'Organic Chemistry - Reactions',  sub:'Chemistry',dur:'72 min', views:289 },
    { title:'Quadratic Equations',            sub:'Maths',    dur:'45 min', views:198 },
    { title:'Cell Division - Mitosis',        sub:'Biology',  dur:'52 min', views:167 },
  ];

  // Real-time Watching Now counter box
  var liveBox = '<div class="enhanced-card border-glow" style="margin-bottom:20px;padding:0;overflow:hidden">'
    + '<div style="position:relative;aspect-ratio:21/9;background:linear-gradient(135deg,rgba(10,12,28,.95),rgba(20,22,50,.95),rgba(108,71,255,.1));display:flex;align-items:center;justify-content:center;min-height:200px">'
    + '<div style="position:absolute;top:14px;left:14px;display:flex;align-items:center;gap:8px">'
    + '<span class="live-badge-pulse"><div class="live-dot"></div>🔴 LIVE NOW</span>'
    + '<span class="live-viewer-count">👥 <strong id="live-viewer-val">142</strong> Students Watching</span>'
    + '</div>'
    + '<div style="position:absolute;top:14px;right:14px;display:flex;align-items:center;gap:6px">'
    + '<span style="background:rgba(255,45,107,.15);border:1px solid rgba(255,45,107,.3);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;color:#ff2d6b">🔴 HD REC</span>'
    + '<span style="background:rgba(255,255,255,.1);padding:3px 10px;border-radius:20px;font-size:11px;color:rgba(255,255,255,.8)">🖥️ Screen Share Active</span>'
    + '</div>'
    + '<div style="text-align:center"><div style="font-size:52px;margin-bottom:12px">⚛️</div>'
    + '<div style="font-family:Syne,sans-serif;font-size:20px;font-weight:800;margin-bottom:4px">Physics — Electrostatics: Gauss Law & Spherical Shells</div>'
    + '<div style="color:var(--muted);font-size:13px;margin-bottom:16px">Dr. Priya Mehta &nbsp;•&nbsp; JEE Advanced Batch A</div>'
    + '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">'
    + '<button class="btn btn-red glow-join" onclick="window.openLiveStreamPlayer(\'live1\')" style="font-weight:800;padding:12px 32px;font-size:15px;border-radius:12px">▶ Join Live Stream & Chat</button>'
    + '<button class="btn btn-purple" onclick="toast(\'Hand raised in live class! 🖐️\',\'🖐️\')" style="font-size:20px;padding:10px 16px" title="Raise Hand">🖐️</button>'
    + '<button class="btn btn-teal" onclick="window.openLiveStreamPlayer(\'live1\')" style="padding:10px 16px" title="Open Chat">💬 Live Chat</button>'
    + '</div></div>'
    + '<div style="position:absolute;bottom:14px;left:14px;display:flex;gap:6px">'
    + [{n:'Dr. Priya',c:'#6c47ff'},{n:'Arjun',c:'#ff6b35'},{n:'Sneha',c:'#4ade80'}].map(function(p){return '<div style="width:32px;height:32px;border-radius:50%;background:'+p.c+';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;border:2px solid rgba(10,12,28,.8)" title="'+p.n+'">'+p.n[0]+'</div>';}).join('')
    + '<div style="width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--muted);border:2px solid rgba(10,12,28,.8)">+139</div></div>'
    + '</div></div>';

  var upHtml = upcoming.map(function(c) {
    return '<div class="sched-item" onclick="toast(\'Reminder set for ' + c.topic + '!\',\'🔔\')">'
      + '<div class="sched-time"><div class="st">' + c.time + '</div><div class="sd">' + c.date + '</div></div>'
      + '<div class="sched-body"><div class="sched-title">' + c.sub + ': ' + c.topic + '</div>'
      + '<div class="sched-meta">' + c.fac + ' • ' + c.n + ' enrolled</div></div>'
      + '<button class="btn btn-sm btn-purple" onclick="event.stopPropagation();toast(\'Reminder set!\',\'🔔\')">🔔</button></div>';
  }).join('');

  var recHtml = '<div class="tbl-wrap"><table><thead><tr><th>Lecture</th><th>Subject</th><th>Duration</th><th>Views</th><th>Action</th></tr></thead><tbody>'
    + recorded.map(function(r) {
      return '<tr onclick="window.openLiveStreamPlayer(\'rec\')"><td style="font-weight:600">'+r.title+'</td><td><span class="badge badge-purple">'+r.sub+'</span></td><td>'+r.dur+'</td><td>👁 '+r.views+'</td><td><button class="btn btn-sm btn-teal" onclick="event.stopPropagation();window.openLiveStreamPlayer(\'rec\')">▶ Watch</button></td></tr>';
    }).join('') + '</tbody></table></div>';

  // Heartbeat polling to dynamically update "Watching Now" count
  if (window.liveHeartbeatInterval) clearInterval(window.liveHeartbeatInterval);
  window.liveHeartbeatInterval = setInterval(function() {
    var el = document.getElementById('live-viewer-val');
    if (el) {
      var current = parseInt(el.textContent) || 142;
      var nextVal = current + (Math.floor(Math.random() * 5) - 2);
      if (nextVal < 135) nextVal = 138;
      el.textContent = nextVal;
    }
  }, 4000);

  return liveBox
    + '<div class="grid-2">'
    + '<div class="card"><div class="card-header"><div class="card-title">📅 Upcoming Classes</div></div>' + upHtml + '</div>'
    + '<div class="card"><div class="card-header"><div class="card-title">📼 Recorded Lectures</div></div>' + recHtml + '</div>'
    + '</div>';
};



// ──────────────── STUDENT TESTS (ENHANCED) ────────────────
}
