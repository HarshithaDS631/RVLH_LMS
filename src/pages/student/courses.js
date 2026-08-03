// Module: PAGES['student_courses']
export function registerPage(PAGES) {
  PAGES['student_courses'] = function() {
  var allCourses = window.LMS_COURSES || [
    { _id:'1', e:'⚛️', title:'JEE (Advanced + Main)',  desc:'Comprehensive coaching for JEE Advanced and Main.', videos:24, materials:18, quizzes:12, enrolled:false, col:'linear-gradient(90deg,#6c47ff,#a855f7)', p:65, done:16, total:24, fac:'Dr. Priya Mehta', rating:4.8, reviews:142, fee:45000, dur:'2 Years' },
    { _id:'2', e:'🚀', title:'JEE (Main + CET)',        desc:'Comprehensive coaching for JEE Main and CET.',       videos:20, materials:14, quizzes:8, enrolled:false, col:'linear-gradient(90deg,#4ade80,#00d4c8)', p:0, done:0, total:20, fac:'Mr. Raj Sharma', rating:4.6, reviews:98, fee:30000, dur:'1 Year' },
    { _id:'3', e:'🎯', title:'KCET Batch',              desc:'Comprehensive coaching for KCET.',                   videos:18, materials:12, quizzes:6, enrolled:false, col:'linear-gradient(90deg,#a855f7,#6c47ff)', p:0, done:0, total:18, fac:'Prof. Amit Singh', rating:4.5, reviews:76, fee:25000, dur:'1 Year' },
    { _id:'4', e:'🔬', title:'NEET UG',                 desc:'Comprehensive coaching for NEET UG.',                videos:30, materials:22, quizzes:15, enrolled:false, col:'linear-gradient(90deg,#ff6b35,#fbbf24)', p:0, done:0, total:30, fac:'Dr. Kavya R.', rating:4.9, reviews:210, fee:38000, dur:'1 Year' },
    { _id:'5', e:'💼', title:'Commerce Decoded',        desc:'Comprehensive coaching for Commerce.',               videos:22, materials:16, quizzes:10, enrolled:false, col:'linear-gradient(90deg,#ff2d6b,#ff6b35)', p:0, done:0, total:22, fac:'Prof. Neha K.', rating:4.4, reviews:64, fee:28000, dur:'1 Year' },
    { _id:'6', e:'📚', title:'ReVise CET 2025',         desc:'Comprehensive revision for CET 2025.',               videos:15, materials:10, quizzes:8, enrolled:false, col:'linear-gradient(90deg,#ff2d6b,#a855f7)', p:0, done:0, total:15, fac:'Mr. Ravi V.', rating:4.7, reviews:88, fee:15000, dur:'6 Months' },
  ];

  var stars = function(r) { var full = Math.floor(r); var html = ''; for(var i=0;i<5;i++) html += '<span style="color:'+(i<full?'#fbbf24':'rgba(255,255,255,.15)')+'">★</span>'; return html; };

  var gridHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px">'
    + allCourses.map(function(c) {
      var statusBadge = c.enrolled
        ? '<span style="background:rgba(74,222,128,.15);color:#4ade80;border:1px solid rgba(74,222,128,.3);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700">✅ Enrolled</span>'
        : '<span style="background:rgba(251,191,36,.12);color:#fbbf24;border:1px solid rgba(251,191,36,.25);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700">🔒 Locked</span>';
      
      var actionBtn = c.enrolled
        ? '<button class="btn btn-solid" style="width:100%;justify-content:center;pointer-events:none">▶ Continue Learning</button>'
        : '<button style="width:100%;padding:10px;border-radius:9px;border:none;background:linear-gradient(135deg,#00c6ff,#00d4c8);color:#fff;font-family:Syne,sans-serif;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;gap:6px;pointer-events:none">👑 Unlock Course</button>';

      var clickHandler = c.enrolled
        ? 'window.openCourseDetail(\''+c.title.replace(/'/g,"\\'")+'\',\''+c.e+'\',\'#4ade80\',\''+c.fac.replace(/'/g,"\\'")+'\','+(c.total || 20)+','+(c.done || 0)+','+(c.p || 0)+')'
        : 'window.openCourseUnlockModal(\''+c._id+'\',\''+c.title.replace(/'/g,"\\'")+'\','+(c.fee || 28000)+',\''+(c.dur || '1 Year')+'\',\''+c.fac.replace(/'/g,"\\'")+'\',\''+c.e+'\')';

      return '<div class="enhanced-card" style="padding:0;overflow:hidden;cursor:pointer" onclick="' + clickHandler + '">'
        + '<div style="height:6px;background:'+c.col+'"></div>'
        + '<div style="padding:18px">'
        + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">'
        + '<div style="display:flex;align-items:center;gap:10px"><span style="font-size:28px">'+c.e+'</span>'
        + '<div style="font-family:Syne,sans-serif;font-size:15px;font-weight:700">'+c.title+'</div></div>'
        + statusBadge + '</div>'
        + '<div style="font-size:12px;color:var(--muted);margin-bottom:12px;line-height:1.5;margin-left:42px">'+c.desc+'</div>'
        + (c.enrolled && (c.p !== undefined ? c.p : 0) > 0 ? '<div style="margin-bottom:12px">'+makeProgress(c.p,'#4ade80')+'<div style="font-size:11px;color:var(--muted);margin-top:3px">'+c.p+'% completed · '+c.done+'/'+c.total+' chapters</div></div>' : '')
        + '<div style="display:flex;gap:16px;font-size:12px;color:var(--muted);margin-bottom:12px;flex-wrap:wrap">'
        + '<span style="display:flex;align-items:center;gap:4px">📹 '+(c.videos !== undefined ? c.videos : 15)+' Videos</span>'
        + '<span style="display:flex;align-items:center;gap:4px">📄 '+(c.materials !== undefined ? c.materials : 10)+' Materials</span>'
        + '<span style="display:flex;align-items:center;gap:4px">📝 '+(c.quizzes !== undefined ? c.quizzes : 8)+' Quizzes</span></div>'
        + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">'
        + '<div style="display:flex;align-items:center;gap:6px"><span style="font-size:14px;letter-spacing:1px">'+stars(c.rating || 4.7)+'</span><span style="font-size:12px;font-weight:700;color:var(--text)">'+(c.rating || 4.7)+'</span><span style="font-size:11px;color:var(--muted)">('+(c.reviews || 85)+')</span></div>'
        + '<span style="font-size:11px;color:var(--muted)">by '+c.fac+'</span></div>'
        + actionBtn
        + '</div></div>';
    }).join('') + '</div>';

  return '<div style="margin-bottom:16px"><div style="font-size:13px;color:var(--muted)">Your enrolled courses and available programs</div></div>' + gridHtml;
};

function openCourseDetail(title, emoji, col, faculty, total, done, pct) {
  var chapters = ['Kinematics','Laws of Motion','Work Energy Power','Rotational Motion','Gravitation','Thermodynamics','Waves','Electrostatics','Current Electricity','Optics','Modern Physics','Semiconductors'];
  var chapHtml = chapters.map(function(ch,i){
    var isDone = i < done;
    return '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,'+(isDone?'0.06':'0.02')+');border:1px solid rgba(255,255,255,.06);margin-bottom:6px;cursor:pointer;transition:all .2s" onmouseover="this.style.borderColor=\'rgba(108,71,255,.3)\'" onmouseout="this.style.borderColor=\'rgba(255,255,255,.06)\'" onclick="closeModal(\'modal-detail\'); openVideoWithNotes(\'Chapter ' + (i+1) + ': ' + ch.replace(/'/g,"\\'") + '\', \'' + emoji + '\')">'
      + '<div style="width:24px;height:24px;border-radius:50%;background:'+(isDone?'linear-gradient(135deg,#4ade80,#00d4c8)':'rgba(255,255,255,.08)')+';display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0">'+(isDone?'✓':(i+1))+'</div>'
      + '<div style="flex:1;font-size:13px;'+(isDone?'':'color:var(--muted)')+'">Ch '+(i+1)+': '+ch+'</div>'
      + (isDone ? '<span class="badge badge-green" style="font-size:10px">Done</span>' : '<span style="font-size:11px;color:var(--muted)">—</span>')
      + '</div>';
  }).join('');

  var actions = [
    { label: '📹 Watch Lectures', act: 'loadPage(\'videos\')' },
    { label: '📄 Download Notes', act: 'loadPage(\'material\')' },
    { label: '📝 Chapter Tests', act: 'loadPage(\'tests\')' },
    { label: '💬 Ask Doubt', act: 'loadPage(\'doubts\')' },
    { label: '📊 My Progress', act: 'loadPage(\'progress\')' },
    { label: '🎨 Digital Blackboard', act: 'openDigitalBlackboard()' }
  ];

  var actionHtml = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:18px">'
    + actions.map(function(a){
        return '<button class="btn btn-purple" style="justify-content:flex-start" onclick="closeModal(\'modal-detail\'); ' + a.act + '">' + a.label + '</button>';
      }).join('')
    + '</div>';

  var body = '<div style="display:flex;gap:14px;margin-bottom:18px;align-items:center">'
    + '<div style="width:66px;height:66px;border-radius:12px;background:color-mix(in srgb,'+col+' 12%,var(--surface2));display:flex;align-items:center;justify-content:center;font-size:36px">'+emoji+'</div>'
    + '<div><div style="font-family:Syne,sans-serif;font-size:18px;font-weight:700;margin-bottom:4px">'+title+'</div>'
    + '<div style="color:var(--muted);font-size:13px">'+faculty+'</div>'
    + '<div style="margin-top:7px;display:flex;gap:6px"><span class="badge badge-green">Enrolled</span><span class="badge badge-purple">'+total+' Chapters</span></div></div></div>'
    + '<div style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:13px"><span>'+done+'/'+total+' completed</span><span style="color:'+col+';font-weight:700">'+pct+'%</span></div>'
    + '<div class="prog-bar" style="height:9px"><div class="prog-fill" style="width:'+pct+'%;background:'+col+'"></div></div></div>'
    + actionHtml
    + '<div style="font-family:Syne,sans-serif;font-size:14px;font-weight:700;margin-bottom:10px;background:linear-gradient(135deg,#eef2ff,#c4b5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent">📋 Chapter-wise Syllabus</div>'
    + '<div style="max-height:250px;overflow-y:auto;padding-right:4px">' + chapHtml + '</div>';
    
  var nextChapIdx = done < total ? done : 0;
  var nextChapName = chapters[nextChapIdx];
  var resumeBtn = '<button class="btn btn-solid" onclick="closeModal(\'modal-detail\'); openVideoWithNotes(\'Chapter ' + (nextChapIdx + 1) + ': ' + nextChapName.replace(/'/g,"\\'") + '\',\'' + emoji + '\')">▶ Resume Course</button>';
  
  openDetail(emoji + ' ' + title, body, resumeBtn);
}

// ──────────────── STUDENT VIDEO LECTURES (ENHANCED v2) ────────────────
}
