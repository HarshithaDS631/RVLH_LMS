// Module: PAGES['student_videos']
export function registerPage(PAGES) {
  PAGES['student_videos'] = function() {
  var videos = window.LMS_VIDEOS || [
    { thumb:'🏗️', title:'Laws of Motion — Full Chapter',       sub:'Physics',   batch:'JEE Adv', dur:'45:20', fac:'Dr. Ramesh Babu',  col:'#ff2d6b', views:1240, bookmarked:true, trending:true },
    { thumb:'🧪', title:'Organic Chemistry — IUPAC Naming',    sub:'Chemistry', batch:'JEE Adv', dur:'38:15', fac:'Prof. Sunita Sharma',col:'#00d4c8', views:980, bookmarked:false, trending:true },
    { thumb:'🌊', title:'Chemical Bonding — Hybridization',    sub:'Chemistry', batch:'NEET',    dur:'35:45', fac:'Prof. Sunita Sharma',col:'#6c47ff', views:870, bookmarked:false, trending:false },
    { thumb:'📐', title:'Integration — By Parts Method',       sub:'Maths',     batch:'JEE Adv', dur:'52:10', fac:'Mr. Raj Sharma',    col:'#a855f7', views:1100, bookmarked:true, trending:false },
    { thumb:'⚡', title:'Electrostatics — Gauss Law',           sub:'Physics',   batch:'JEE Adv', dur:'48:30', fac:'Dr. Priya Mehta',   col:'#ff2d6b', views:1450, bookmarked:false, trending:true },
    { thumb:'🔬', title:'Cell Division — Mitosis vs Meiosis',  sub:'Biology',   batch:'NEET',    dur:'41:05', fac:'Dr. Kavya R.',       col:'#4ade80', views:760, bookmarked:false, trending:false },
  ];

  var featured = videos.filter(function(v){return v.trending;});
  var featuredHtml = '<div class="card" style="margin-bottom:20px"><div class="card-header"><div class="card-title">🔥 Trending Videos</div></div>'
    + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">'
    + featured.map(function(v){
      return '<div class="enhanced-card slide-in" style="padding:0;overflow:hidden;cursor:pointer" onclick="window.openVideoWithNotes(\''+v.title.replace(/'/g,"\\'")+'\',\''+v.thumb+'\')">'
        + '<div style="position:relative;aspect-ratio:16/9;background:linear-gradient(135deg,rgba(10,12,28,.9),rgba(20,22,50,.9));display:flex;align-items:center;justify-content:center;font-size:44px">'+v.thumb
        + '<div style="position:absolute;top:8px;left:8px"><span class="badge badge-red" style="font-size:10px">🔥 Trending</span></div>'
        + '<div style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.85);color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:5px">'+v.dur+'</div>'
        + '<div style="position:absolute;bottom:8px;left:8px;font-size:11px;color:rgba(255,255,255,.7)">👁 '+v.views+'</div>'
        + '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;background:rgba(0,0,0,.4)" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0"><div class="play-btn" style="width:48px;height:48px;font-size:18px">▶</div></div></div>'
        + '<div style="padding:12px"><div style="font-size:13px;font-weight:700;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+v.title+'</div>'
        + '<div style="font-size:11px;color:var(--muted)">'+v.fac+'</div></div></div>';
    }).join('') + '</div></div>';

  var subjectFilters = ['All Subjects','Physics','Chemistry','Maths','Biology'];
  var filterBar = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;gap:12px;flex-wrap:wrap">'
    + '<div class="inner-tabs">' + subjectFilters.map(function(s,i){ return '<button class="itab itab-vid'+(i===0?' active':'')+'" onclick="window.setVideoFilter(\''+s+'\'); window.filterVideos()">'+s+'</button>'; }).join('') + '</div>'
    + '<div style="display:flex;align-items:center;gap:8px;flex:1;max-width:280px">'
    + '<input id="video-search" class="inp-field" placeholder="🔍 Search videos..." style="padding:8px 12px" oninput="window.filterVideos()">'
    + '</div></div>';

  var videoGrid = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px">'
    + videos.map(function(v) {
      return '<div class="enhanced-card video-card-item" data-title="'+v.title.replace(/"/g,'&quot;')+'" data-fac="'+v.fac.replace(/"/g,'&quot;')+'" data-sub="'+v.sub+'" style="padding:0;overflow:hidden">'
        + '<div style="position:relative;aspect-ratio:16/9;background:linear-gradient(135deg,rgba(10,12,28,.9),rgba(20,22,50,.9));display:flex;align-items:center;justify-content:center;font-size:48px;cursor:pointer" onclick="window.openVideoWithNotes(\''+v.title.replace(/'/g,"\\'")+'\',\''+v.thumb+'\')">'
        + v.thumb
        + '<div style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.85);color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:5px">'+v.dur+'</div>'
        + '<div style="position:absolute;top:8px;right:8px"><button class="bookmark-btn" onclick="event.stopPropagation();this.textContent=this.textContent===\'🏷\'?\'🔖\':\'🏷\';toast(\'Bookmark toggled!\',\'🔖\')">'+(v.bookmarked?'🔖':'🏷')+'</button></div>'
        + '<div style="position:absolute;bottom:8px;left:8px;font-size:11px;color:rgba(255,255,255,.7)">👁 '+v.views+'</div>'
        + '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;background:rgba(0,0,0,.4)" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0"><div class="play-btn" style="width:52px;height:52px;font-size:20px">▶</div></div>'
        + '</div>'
        + '<div style="padding:14px">'
        + '<div style="display:flex;gap:6px;margin-bottom:8px">'
        + '<span style="background:rgba(0,198,255,.12);color:#00c6ff;border:1px solid rgba(0,198,255,.25);padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700">'+v.sub+'</span>'
        + '<span style="background:rgba(108,71,255,.12);color:#a78bff;border:1px solid rgba(108,71,255,.25);padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700">'+(v.batch || 'JEE/NEET')+'</span></div>'
        + '<div style="font-family:Syne,sans-serif;font-size:14px;font-weight:700;margin-bottom:4px;line-height:1.35">'+v.title+'</div>'
        + '<div style="font-size:12px;color:var(--muted);margin-bottom:12px">by '+v.fac+'</div>'
        + '<div style="display:flex;gap:6px">'
        + '<button class="btn btn-solid btn-sm" style="flex:1;justify-content:center" onclick="window.openVideoWithNotes(\''+v.title.replace(/'/g,"\\'")+'\',\''+v.thumb+'\')">▶ Watch</button>'
        + '<button class="btn btn-purple btn-sm" onclick="window.viewLectureNotes(\''+v.title.replace(/'/g,"\\'")+'\')">📝</button>'
        + '<button class="btn btn-yellow btn-sm" onclick="window.openAIVideoAssistant(\''+v.title.replace(/'/g,"\\'")+'\')">🤖</button>'
        + '</div></div></div>';
    }).join('') + '</div>';

  var historyHtml = '<div class="card" style="margin-top:20px"><div class="card-header"><div class="card-title">📜 Watch History</div></div>'
    + '<div style="display:flex;flex-direction:column;gap:6px">'
    + [{t:'Thermodynamics — Entropy',when:'Yesterday',pct:100},{t:'Organic Chemistry — Alcohols',when:'2 days ago',pct:85},{t:'Coordinate Geometry',when:'3 days ago',pct:60}].map(function(h){
      return '<div class="list-item" style="cursor:pointer" onclick="window.openVideoWithNotes(\''+h.t.replace(/'/g,"\\'")+'\',\'📹\')"><div class="li-icon" style="background:rgba(108,71,255,.1);border:1px solid rgba(108,71,255,.15)">📹</div><div class="li-content"><div class="li-title">'+h.t+'</div><div class="li-sub">Watched '+h.when+' · '+h.pct+'% completed</div></div><span class="badge '+(h.pct===100?'badge-green':'badge-yellow')+'">'+h.pct+'%</span></div>';
    }).join('') + '</div></div>';

  window.currentVideoFilter = window.currentVideoFilter || 'All Subjects';

  return featuredHtml + filterBar + videoGrid + historyHtml;
};

// Global helper functions for Videos page
window.setVideoFilter = function(sub) {
  window.currentVideoFilter = sub;
  document.querySelectorAll('.itab-vid').forEach(function(btn) {
    var text = btn.textContent.trim().toLowerCase();
    var matchText = sub.toLowerCase();
    if (matchText === 'all') matchText = 'all subjects';
    if (text === matchText) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
};

window.filterVideos = function() {
  var searchField = document.getElementById('video-search');
  var query = searchField ? searchField.value.toLowerCase() : '';
  var filter = window.currentVideoFilter || 'all';
  var items = document.querySelectorAll('.video-card-item');
  items.forEach(function(item) {
    var title = item.getAttribute('data-title').toLowerCase();
    var fac = item.getAttribute('data-fac').toLowerCase();
    var sub = item.getAttribute('data-sub').toLowerCase();
    
    var matchesSearch = title.indexOf(query) > -1 || fac.indexOf(query) > -1;
    var matchesFilter = filter.toLowerCase() === 'all' || filter.toLowerCase() === 'all subjects' || sub.toLowerCase() === filter.toLowerCase();
    
    if (matchesSearch && matchesFilter) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
};

// ──────────────── LIVE CLASSES (REAL-TIME WATCHING NOW) ────────────────
}
