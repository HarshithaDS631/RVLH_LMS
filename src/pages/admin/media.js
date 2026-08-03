// Module: PAGES['admin_media']
export function registerPage(PAGES) {
  PAGES['admin_media'] = function() {
  var mediaState = window._mediaState || { tab:'videos', course:null, subject:null, matTab:null, qpCourse:null, qpYear:null };
  window._mediaState = mediaState;

  function crumbHtml() {
    var crumbs = ['<span style="cursor:pointer;color:var(--admin);font-weight:600" onclick="_mediaNav(\'reset\')">📂 All</span>'];
    if (mediaState.tab==='videos') {
      if (mediaState.course) crumbs.push('<span style="cursor:pointer;color:var(--purple);font-weight:600" onclick="_mediaNav(\'vcourse\')">' + mediaState.course.split('(')[0].trim() + '</span>');
      if (mediaState.subject) crumbs.push('<span style="color:var(--text)">' + mediaState.subject + '</span>');
    } else if (mediaState.tab==='materials') {
      if (mediaState.matTab) {
        crumbs.push('<span style="cursor:pointer;color:var(--purple);font-weight:600" onclick="_mediaNav(\'mattype\')">' + mediaState.matTab + '</span>');
        if (mediaState.matTab==='Course Materials' && mediaState.course) crumbs.push('<span style="cursor:pointer;color:var(--purple);font-weight:600" onclick="_mediaNav(\'matcourse\')">' + mediaState.course.split('(')[0].trim() + '</span>');
        if (mediaState.matTab==='Course Materials' && mediaState.subject) crumbs.push('<span style="color:var(--text)">' + mediaState.subject + '</span>');
        if (mediaState.matTab==='Formula Materials' && mediaState.subject) crumbs.push('<span style="color:var(--text)">' + mediaState.subject + '</span>');
        if (mediaState.matTab==='Question Papers' && mediaState.qpCourse) crumbs.push('<span style="cursor:pointer;color:var(--purple);font-weight:600" onclick="_mediaNav(\'qpcourse\')">' + mediaState.qpCourse.split('(')[0].trim() + '</span>');
        if (mediaState.matTab==='Question Papers' && mediaState.qpYear) crumbs.push('<span style="color:var(--text)">' + mediaState.qpYear + '</span>');
      }
    }
    return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:18px;padding:10px 14px;background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);border-radius:10px;font-size:13px;flex-wrap:wrap">'
      + '<span style="color:var(--muted);font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;margin-right:4px">PATH</span>'
      + crumbs.join('<span style="color:var(--border);font-size:16px;font-weight:300;margin:0 2px">›</span>') + '</div>';
  }

  window._mediaNav = function(action) {
    if (action==='reset')    { mediaState.course=null; mediaState.subject=null; mediaState.matTab=null; mediaState.qpCourse=null; mediaState.qpYear=null; }
    if (action==='vcourse')  { mediaState.subject=null; }
    if (action==='mattype')  { mediaState.course=null; mediaState.subject=null; mediaState.qpCourse=null; mediaState.qpYear=null; }
    if (action==='matcourse'){ mediaState.subject=null; }
    if (action==='qpcourse') { mediaState.qpYear=null; }
    loadPage('media');
  };

  // Modern tab switcher
  var tabBar = '<div style="display:flex;gap:0;margin-bottom:20px;background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:4px;width:fit-content">'
    + [['videos','🎬','Videos'],['materials','📄','Materials']].map(function(t) {        var active = mediaState.tab === t[0];
        return '<button onclick="window._mediaState.tab=\''+t[0]+'\';window._mediaState.course=null;window._mediaState.subject=null;window._mediaState.matTab=null;window._mediaState.qpCourse=null;window._mediaState.qpYear=null;loadPage(\'media\')" '
          + 'style="padding:9px 22px;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:7px;'
          + (active ? 'background:linear-gradient(135deg,var(--admin),var(--purple));color:#fff;box-shadow:0 4px 14px rgba(255,45,107,.35)' : 'background:transparent;color:var(--muted)') + '">'
          + t[1] + ' ' + t[2] + '</button>';
      }).join('') + '</div>';

  var content = '';

  // ── VIDEOS FLOW ──
  if (mediaState.tab==='videos') {
    if (!mediaState.course) {
      // Show courses
      var courses = Object.keys(MEDIA_DB);
      content = '<div style="margin-bottom:10px;font-size:12px;color:var(--muted)">Select a course to browse videos by subject</div>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">' + courses.map(function(cn) {
        var subjs = Object.keys(MEDIA_DB[cn]);
        var totalVids = subjs.reduce(function(a,s){return a+MEDIA_DB[cn][s].videos.length;},0);
        var cols = {'JEE':'#ff2d6b','NEET':'#4ade80','Commerce':'#fbbf24'};
        var col = cols[cn.split(' ')[0]] || '#6c47ff';
        return '<div onclick="window._mediaState.course=\''+cn.replace(/'/g,"\\'")+'\';;loadPage(\'media\')" '
          + 'style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid color-mix(in srgb,'+col+' 22%,var(--border));border-radius:14px;padding:20px;cursor:pointer;transition:all .22s;position:relative;overflow:hidden" '
          + 'onmouseover="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'0 10px 28px rgba(0,0,0,.3)\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'">'
          + '<div style="position:absolute;top:0;right:0;width:80px;height:80px;background:radial-gradient(circle,color-mix(in srgb,'+col+' 18%,transparent),transparent 70%);pointer-events:none"></div>'
          + '<div style="width:52px;height:52px;border-radius:14px;background:color-mix(in srgb,'+col+' 14%,var(--surface2));display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:14px">🎬</div>'
          + '<div style="font-family:Syne,sans-serif;font-weight:700;font-size:14px;margin-bottom:6px">'+cn.split('(')[0].trim()+'</div>'
          + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">'
          + '<span style="font-size:12px;color:var(--muted)">'+subjs.length+' subjects</span>'
          + '<span style="width:4px;height:4px;border-radius:50%;background:var(--border)"></span>'
          + '<span style="font-family:Syne,sans-serif;font-size:18px;font-weight:800;color:'+col+'">'+totalVids+'</span>'
          + '<span style="font-size:12px;color:var(--muted)">videos</span></div>'
          + '<div style="display:flex;gap:5px;flex-wrap:wrap">'+subjs.map(function(s){return '<span style="font-size:10px;font-weight:600;padding:3px 8px;border-radius:20px;background:color-mix(in srgb,'+col+' 10%,var(--surface2));color:'+col+';border:1px solid color-mix(in srgb,'+col+' 22%,transparent)">'+s+'</span>';}).join('')+'</div>'
          + '</div>';
      }).join('') + '</div>';
    } else if (!mediaState.subject) {
      // Show subjects for selected course
      var subjs = Object.keys(MEDIA_DB[mediaState.course]);
      var courseCol = mediaState.course.includes('JEE')?'#ff2d6b':mediaState.course.includes('NEET')?'#4ade80':'#fbbf24';
      content = '<div style="margin-bottom:10px;font-size:12px;color:var(--muted)">Select a subject to view videos</div>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">' + subjs.map(function(sn) {
        var vids = MEDIA_DB[mediaState.course][sn].videos;
        var subIcon = sn==='Physics'?'⚡':sn==='Chemistry'?'🧪':sn==='Mathematics'?'📐':sn==='Biology'?'🔬':sn==='Accountancy'?'📊':sn==='Economics'?'💹':'📚';
        var subCol = sn==='Physics'?'#ff2d6b':sn==='Chemistry'?'#00d4c8':sn==='Mathematics'?'#6c47ff':sn==='Biology'?'#4ade80':sn==='Accountancy'?'#fbbf24':'#ff6b35';
        return '<div onclick="window._mediaState.subject=\''+sn+'\';loadPage(\'media\')" '
          + 'style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid color-mix(in srgb,'+subCol+' 22%,var(--border));border-radius:14px;padding:18px;cursor:pointer;transition:all .22s" '
          + 'onmouseover="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'0 10px 24px rgba(0,0,0,.3)\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'">'
          + '<div style="font-size:36px;margin-bottom:12px">'+subIcon+'</div>'
          + '<div style="font-family:Syne,sans-serif;font-weight:700;font-size:15px;margin-bottom:6px">'+sn+'</div>'
          + '<div style="display:flex;align-items:center;gap:8px">'
          + '<span style="font-family:Syne,sans-serif;font-size:22px;font-weight:800;color:'+subCol+'">'+vids.length+'</span>'
          + '<span style="font-size:12px;color:var(--muted)">videos</span></div>'
          + '</div>';
      }).join('') + '</div>';
    } else {
      // Show videos for selected subject
      var vids = MEDIA_DB[mediaState.course][mediaState.subject].videos;
      content = '<div style="display:flex;flex-direction:column;gap:11px">'
        + vids.map(function(v,i) {
            return '<div class="card" style="display:flex;gap:14px;align-items:flex-start">'
              + '<div style="width:90px;height:60px;background:linear-gradient(135deg,rgba(255,45,107,.2),rgba(108,71,255,.2));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;cursor:pointer" onclick="openVideoPlayer(\'' + v.t.replace(/'/g,"\\'") + '\')">'
              + '<div style="width:0;height:0;border-style:solid;border-width:10px 0 10px 18px;border-color:transparent transparent transparent rgba(255,255,255,.8)"></div></div>'
              + '<div style="flex:1">'
              + '<div style="font-weight:600;font-size:13px;margin-bottom:4px">'+v.t+'</div>'
              + '<div style="font-size:11px;color:var(--muted)">⏱ '+v.dur+' &nbsp;•&nbsp; 👁 '+v.views+' views &nbsp;•&nbsp; 👨‍🏫 '+v.fac+' &nbsp;•&nbsp; 📅 '+v.date+'</div>'
              + '</div>'
              + '<div style="display:flex;gap:6px;flex-shrink:0">'
              + '<button class="btn btn-sm btn-purple" onclick="openVideoPlayer(\'' + v.t.replace(/'/g,"\\'") + '\')">▶ Play</button>'
              + '<button class="btn btn-sm btn-red" onclick="deleteVideoItem(\'' + v._id + '\')">🗑 Delete</button>'
              + '</div></div>';
          }).join('') + '</div>';
    }
  }

  // ── MATERIALS FLOW ──
  if (mediaState.tab==='materials') {
    if (!mediaState.matTab) {
      content = '<div style="margin-bottom:10px;font-size:12px;color:var(--muted)">Choose a material category</div>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px">'
        + [
            { k:'Course Materials', icon:'📚', col:'#00d4c8', desc:'Subject-wise study notes & chapters', badge:'badge-teal' },
            { k:'Formula Materials', icon:'📐', col:'#6c47ff', desc:'Formula sheets by subject', badge:'badge-purple' },
            { k:'Question Papers', icon:'📝', col:'#fbbf24', desc:'Past papers organised by year', badge:'badge-yellow' }
          ].map(function(mt) {
            return '<div onclick="window._mediaState.matTab=\''+mt.k+'\';loadPage(\'media\')" '
              + 'style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid color-mix(in srgb,'+mt.col+' 22%,var(--border));border-radius:16px;padding:24px;cursor:pointer;transition:all .22s;text-align:center" '
              + 'onmouseover="this.style.transform=\'translateY(-4px)\';this.style.boxShadow=\'0 12px 28px rgba(0,0,0,.3)\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'">'
              + '<div style="width:64px;height:64px;border-radius:18px;background:color-mix(in srgb,'+mt.col+' 14%,var(--surface2));display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 16px">'+mt.icon+'</div>'
              + '<div style="font-family:Syne,sans-serif;font-weight:700;font-size:15px;margin-bottom:6px">'+mt.k+'</div>'
              + '<div style="font-size:12px;color:var(--muted)">'+mt.desc+'</div>'
              + '</div>';
          }).join('') + '</div>';
    } else if (mediaState.matTab==='Course Materials') {
      if (!mediaState.course) {
        var courses = Object.keys(MEDIA_DB);
        content = '<div class="grid-2">' + courses.map(function(cn) {
          var subjs = Object.keys(MEDIA_DB[cn]);
          var totalMats = subjs.reduce(function(a,s){return a+MEDIA_DB[cn][s].materials.length;},0);
          var col = cn.includes('JEE')?'#ff2d6b':cn.includes('NEET')?'#4ade80':'#fbbf24';
          return '<div class="card" style="cursor:pointer;border-color:color-mix(in srgb,'+col+' 22%,var(--border))" onclick="window._mediaState.course=\''+cn.replace(/'/g,"\\'")+'\';;loadPage(\'media\')">'
            + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">'
            + '<div style="font-size:32px">📚</div>'
            + '<div><div style="font-weight:700;font-size:13px">'+cn.split('(')[0].trim()+'</div>'
            + '<div style="font-size:11px;color:var(--muted)">'+totalMats+' materials across '+subjs.length+' subjects</div></div></div></div>';
        }).join('') + '</div>';
      } else if (!mediaState.subject) {
        var subjs = Object.keys(MEDIA_DB[mediaState.course]);
        content = '<div class="grid-2">' + subjs.map(function(sn) {
          var mats = MEDIA_DB[mediaState.course][sn].materials;
          return '<div class="card" style="cursor:pointer" onclick="window._mediaState.subject=\''+sn+'\';loadPage(\'media\')">'
            + '<div style="display:flex;align-items:center;gap:10px">'
            + '<div style="font-size:32px">'+(sn==='Physics'?'⚡':sn==='Chemistry'?'🧪':sn==='Mathematics'?'📐':sn==='Biology'?'🔬':'📄')+'</div>'
            + '<div><div style="font-weight:700">'+sn+'</div><div style="font-size:12px;color:var(--muted)">'+mats.length+' materials</div></div></div></div>';
        }).join('') + '</div>';
      } else {
        var mats = MEDIA_DB[mediaState.course][mediaState.subject].materials;
        content = '<div style="margin-bottom:12px;font-size:12px;color:var(--muted)">'+mats.length+' materials available for download</div>'
          + '<div style="display:flex;flex-direction:column;gap:10px">'
          + mats.map(function(m) {
              return '<div style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;display:flex;align-items:center;gap:14px;transition:all .18s" '
                + 'onmouseover="this.style.borderColor=\'var(--purple)\'" onmouseout="this.style.borderColor=\'var(--border)\'">'
                + '<div style="width:44px;height:52px;background:rgba(255,45,107,.1);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">📄</div>'
                + '<div style="flex:1">'
                + '<div style="font-weight:600;font-size:13px;margin-bottom:4px">'+m.t+'</div>'
                + '<div style="font-size:11px;color:var(--muted)">'+m.type+' &nbsp;•&nbsp; '+m.size+' &nbsp;•&nbsp; '+m.pg+' pages &nbsp;•&nbsp; Uploaded '+m.date+'</div>'
                + '</div>'
                + '<div style="display:flex;gap:8px;flex-shrink:0">'
                + '<button class="btn btn-teal" onclick="downloadMaterial(\''+m.t.replace(/'/g,"\\'")+'\')" style="gap:6px">⬇ Download PDF</button>'
                + '<button class="btn btn-sm btn-red" onclick="deleteMaterialItem(\'' + m._id + '\')">🗑</button>'
                + '</div></div>';
            }).join('') + '</div>';
      }
    } else if (mediaState.matTab==='Formula Materials') {
      if (!mediaState.subject) {
        var subs = Object.keys(FORMULA_SUBJECTS);
        content = '<div style="margin-bottom:10px;font-size:12px;color:var(--muted)">Complete formula books by subject — one comprehensive PDF per subject</div>'
          + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">' + subs.map(function(sn) {
          var sheets = FORMULA_SUBJECTS[sn];
          var totalPg = sheets.reduce(function(a,s){return a+s.pg;},0);
          var subIcon = sn==='Physics'?'⚡':sn==='Chemistry'?'🧪':sn==='Mathematics'?'📐':sn==='Biology'?'🔬':sn==='Accountancy'?'📊':'💹';
          var subCol = sn==='Physics'?'#ff2d6b':sn==='Chemistry'?'#00d4c8':sn==='Mathematics'?'#6c47ff':sn==='Biology'?'#4ade80':sn==='Accountancy'?'#fbbf24':'#ff6b35';
          return '<div onclick="window._mediaState.subject=\''+sn+'\';loadPage(\'media\')" '
            + 'style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid color-mix(in srgb,'+subCol+' 22%,var(--border));border-radius:14px;padding:18px;cursor:pointer;transition:all .22s" '
            + 'onmouseover="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'0 10px 24px rgba(0,0,0,.3)\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'">'
            + '<div style="font-size:36px;margin-bottom:12px">'+subIcon+'</div>'
            + '<div style="font-family:Syne,sans-serif;font-weight:700;font-size:14px;margin-bottom:4px">'+sn+'</div>'
            + '<div style="font-size:11px;color:var(--muted);margin-bottom:8px">Complete formula book &nbsp;•&nbsp; '+totalPg+' pages</div>'
            + '<span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;background:color-mix(in srgb,'+subCol+' 12%,var(--surface2));color:'+subCol+';border:1px solid color-mix(in srgb,'+subCol+' 22%,transparent)">📐 Formula Book</span>'
            + '</div>';
        }).join('') + '</div>';
      } else {
        // Single complete formula book for the subject
        var totalPg = (FORMULA_SUBJECTS[mediaState.subject]||[]).reduce(function(a,s){return a+s.pg;},0);
        var subIcon = mediaState.subject==='Physics'?'⚡':mediaState.subject==='Chemistry'?'🧪':mediaState.subject==='Mathematics'?'📐':mediaState.subject==='Biology'?'🔬':mediaState.subject==='Accountancy'?'📊':'💹';
        var subCol = mediaState.subject==='Physics'?'#ff2d6b':mediaState.subject==='Chemistry'?'#00d4c8':mediaState.subject==='Mathematics'?'#6c47ff':mediaState.subject==='Biology'?'#4ade80':mediaState.subject==='Accountancy'?'#fbbf24':'#ff6b35';
        var topics = (FORMULA_SUBJECTS[mediaState.subject]||[]).map(function(s){return s.t;}).join(', ');
        content = '<div style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid color-mix(in srgb,'+subCol+' 28%,var(--border));border-radius:16px;padding:28px;max-width:560px">'
          + '<div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">'
          + '<div style="width:72px;height:72px;border-radius:18px;background:color-mix(in srgb,'+subCol+' 14%,var(--surface2));display:flex;align-items:center;justify-content:center;font-size:36px">'+subIcon+'</div>'
          + '<div><div style="font-family:Syne,sans-serif;font-weight:800;font-size:20px;margin-bottom:4px">'+mediaState.subject+' Formula Book</div>'
          + '<div style="font-size:13px;color:var(--muted)">Complete formula reference &nbsp;•&nbsp; '+totalPg+' pages</div></div></div>'
          + '<div style="background:var(--surface2);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px;margin-bottom:20px">'
          + '<div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Topics Covered</div>'
          + '<div style="font-size:13px;line-height:1.8">'+topics+'</div></div>'
          + '<div style="display:flex;gap:10px">'
          + '<button class="btn btn-solid" onclick="downloadMaterial(\''+mediaState.subject+' Complete Formula Book\')" style="flex:1;justify-content:center;padding:12px">⬇ Download Complete Formula Book</button>'
          + '</div></div>';
      }
    } else if (mediaState.matTab==='Question Papers') {
      if (!mediaState.qpCourse) {
        var courses = Object.keys(QUESTION_PAPERS);
        content = '<div style="margin-bottom:10px;font-size:12px;color:var(--muted)">Select a course to browse past papers by year</div>'
          + '<div style="display:flex;flex-direction:column;gap:12px">' + courses.map(function(cn) {
          var years = Object.keys(QUESTION_PAPERS[cn]);
          var col = cn.includes('JEE')?'#ff2d6b':cn.includes('NEET')?'#4ade80':'#fbbf24';
          var totalPapers = years.reduce(function(a,yr){return a+QUESTION_PAPERS[cn][yr].length;},0);
          return '<div onclick="window._mediaState.qpCourse=\''+cn.replace(/'/g,"\\'")+'\';;loadPage(\'media\')" '
            + 'style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid color-mix(in srgb,'+col+' 22%,var(--border));border-radius:14px;padding:18px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:14px" '
            + 'onmouseover="this.style.transform=\'translateX(4px)\'" onmouseout="this.style.transform=\'\'">'
            + '<div style="width:52px;height:52px;border-radius:14px;background:color-mix(in srgb,'+col+' 12%,var(--surface2));display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0">📝</div>'
            + '<div style="flex:1">'
            + '<div style="font-family:Syne,sans-serif;font-weight:700;font-size:14px;margin-bottom:4px">'+cn.split('(')[0].trim()+'</div>'
            + '<div style="font-size:12px;color:var(--muted)">'+years.length+' years &nbsp;•&nbsp; '+totalPapers+' papers available</div>'
            + '<div style="display:flex;gap:5px;margin-top:6px">'+years.map(function(y){return '<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;background:color-mix(in srgb,'+col+' 10%,var(--surface2));color:'+col+';border:1px solid color-mix(in srgb,'+col+' 22%,transparent)">'+y+'</span>';}).join('')+'</div>'
            + '</div>'
            + '<div style="color:var(--muted);font-size:20px">›</div>'
            + '</div>';
        }).join('') + '</div>';
      } else if (!mediaState.qpYear) {
        var years = Object.keys(QUESTION_PAPERS[mediaState.qpCourse]);
        var courseCol = mediaState.qpCourse.includes('JEE')?'#ff2d6b':mediaState.qpCourse.includes('NEET')?'#4ade80':'#fbbf24';
        content = '<div style="margin-bottom:10px;font-size:12px;color:var(--muted)">Select a year to view papers</div>'
          + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px">' + years.map(function(yr) {
          var papers = QUESTION_PAPERS[mediaState.qpCourse][yr];
          return '<div onclick="window._mediaState.qpYear=\''+yr+'\';loadPage(\'media\')" '
            + 'style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid color-mix(in srgb,'+courseCol+' 22%,var(--border));border-radius:14px;padding:20px;cursor:pointer;transition:all .22s;text-align:center" '
            + 'onmouseover="this.style.transform=\'translateY(-4px)\';this.style.boxShadow=\'0 10px 24px rgba(0,0,0,.3)\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'">'
            + '<div style="font-family:Syne,sans-serif;font-size:36px;font-weight:800;color:'+courseCol+';margin-bottom:6px">'+yr+'</div>'
            + '<div style="font-size:12px;color:var(--muted)">'+papers.length+' papers</div>'
            + '</div>';
        }).join('') + '</div>';
      } else {
        var papers = QUESTION_PAPERS[mediaState.qpCourse][mediaState.qpYear] || [];
        var qpCol = mediaState.qpCourse.includes('JEE')?'#ff2d6b':mediaState.qpCourse.includes('NEET')?'#4ade80':'#fbbf24';
        content = '<div style="margin-bottom:12px;font-size:12px;color:var(--muted)">'+papers.length+' papers for '+mediaState.qpYear+'</div>'
          + '<div style="display:flex;flex-direction:column;gap:10px">'
          + papers.map(function(p) {
              return '<div style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;display:flex;align-items:center;gap:14px;transition:all .18s" '
                + 'onmouseover="this.style.borderColor=\''+qpCol+'\'" onmouseout="this.style.borderColor=\'var(--border)\'">'
                + '<div style="width:44px;height:52px;background:rgba(251,191,36,.1);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">📝</div>'
                + '<div style="flex:1">'
                + '<div style="font-weight:600;font-size:13px;margin-bottom:4px">'+p.t+'</div>'
                + '<div style="font-size:11px;color:var(--muted)">'+p.type+' &nbsp;•&nbsp; '+mediaState.qpYear+'</div>'
                + '</div>'
                + '<div style="display:flex;gap:8px;flex-shrink:0">'
                + '<button class="btn btn-sm btn-yellow" onclick="viewQuestionPaper(\''+p.t.replace(/'/g,"\\'")+'\')" style="gap:6px">👁 View</button>'
                + '<button class="btn btn-teal" onclick="downloadMaterial(\''+p.t.replace(/'/g,"\\'")+'\')" style="gap:6px">⬇ PDF</button>'
                + '</div></div>';
            }).join('') + '</div>';
      }
    }
  }

  return crumbHtml() + tabBar + content;
};


function viewQuestionPaper(title) {
  var body = '<div style="background:var(--surface2);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;margin-bottom:16px">'
    + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">'
    + '<div style="width:48px;height:56px;background:rgba(251,191,36,.1);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:26px">📝</div>'
    + '<div><div style="font-family:Syne,sans-serif;font-weight:700;font-size:15px">'+title+'</div>'
    + '<div style="font-size:12px;color:var(--muted);margin-top:2px">RV Learning Hub &nbsp;•&nbsp; Official Paper</div></div></div>'
    + '<div style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);border-radius:9px;padding:16px;font-size:13px;line-height:1.8">'
    + '<div style="font-weight:700;margin-bottom:10px;font-size:14px;text-align:center">SAMPLE PREVIEW</div>'
    + '<div style="margin-bottom:10px"><strong>Section A — Multiple Choice (60 Marks)</strong></div>'
    + '<div style="color:var(--muted);margin-bottom:8px">Q1. A body starts from rest and moves with uniform acceleration. The ratio of distance covered in 1st, 2nd and 3rd second is:</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">'
    + ['(A) 1 : 2 : 3','(B) 1 : 3 : 5','(C) 1 : 4 : 7','(D) 2 : 4 : 6'].map(function(o){return '<div style="padding:6px 10px;background:var(--surface2);border-radius:6px;font-size:12px">'+o+'</div>';}).join('')
    + '</div>'
    + '<div style="color:var(--muted);margin-bottom:8px">Q2. The SI unit of work done is:</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">'
    + ['(A) Watt','(B) Joule','(C) Newton','(D) Pascal'].map(function(o){return '<div style="padding:6px 10px;background:var(--surface2);border-radius:6px;font-size:12px">'+o+'</div>';}).join('')
    + '</div>'
    + '<div style="margin-top:14px;padding:10px;background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.2);border-radius:8px;text-align:center;font-size:12px;color:var(--muted)">'
    + '📄 This is a preview. Download the full paper for complete questions and solutions.</div>'
    + '</div></div>';
  openDetail('👁 ' + title, body,
    '<button class="btn btn-teal" onclick="downloadMaterial(\''+title.replace(/'/g,"\\'")+'\')" >⬇ Download Full PDF</button>');
}

function downloadMaterial(title) {
  // Generate a simple text blob as demo download (real app would use actual PDF URL)
  var content = 'RV Learning Hub\n' + title + '\n\nThis is a demo download. In production, this would link to the actual PDF file on your CDN.\n\nContent: ' + title;
  var blob = new Blob([content], { type: 'application/pdf' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = title.replace(/[^a-z0-9]/gi, '_') + '.pdf';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Downloading: ' + title, '⬇');
}

window.downloadPaymentReceipt = function(txnId) {
  var p = PAYMENT_HISTORY.find(function(x){return x.id===txnId;});
  if (!p) { toast('Transaction not found','⚠️'); return; }
  var receiptText = "RV Learning Hub - Payment Receipt\n"
    + "=================================\n"
    + "Transaction ID: " + p.id + "\n"
    + "Student:        " + p.student + "\n"
    + "Material/Course:" + p.material + "\n"
    + "Amount:         INR " + p.amount + "\n"
    + "Method:         " + p.method + "\n"
    + "Date:           " + p.date + "\n"
    + "Type:           " + p.type + "\n"
    + "Status:         " + p.status.toUpperCase() + "\n"
    + "=================================\n"
    + "Thank you for your payment!";
  var blob = new Blob([receiptText], {type: 'text/plain'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'receipt_' + p.id + '.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Receipt downloaded!', '⬇');
};

window.downloadQuizReport = function(title, score, total, correct, wrong, skip) {
  var rows = [
    ['Quiz Performance Report', ''],
    ['Quiz Title', title],
    ['Total Score', score + ' / ' + total],
    ['Percentage', Math.round(score/total*100) + '%'],
    ['Correct Answers', correct],
    ['Incorrect Answers', wrong],
    ['Skipped Questions', skip],
    ['Generated On', new Date().toLocaleDateString("en-IN")]
  ];
  var csv = rows.map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join('\n');
  var blob = new Blob([csv], {type: 'text/csv'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = title.replace(/[^a-z0-9]/gi, '_') + '_report.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Report downloaded!', '⬇');
};

window.deleteVideoItem = async function(id) {
  if (!confirm('Are you sure you want to delete this video?')) return;
  try {
    await api('/api/videos/' + id, {
      method: 'DELETE'
    });
    toast('Video deleted successfully!', '🗑️');
    await syncLMSData();
    loadPage('media');
  } catch (err) {
    toast('Failed to delete video: ' + err.message, '❌');
  }
};

window.deleteMaterialItem = async function(id) {
  if (!confirm('Are you sure you want to delete this study material?')) return;
  try {
    await api('/api/materials/' + id, {
      method: 'DELETE'
    });
    toast('Material deleted successfully!', '🗑️');
    await syncLMSData();
    loadPage('media');
  } catch (err) {
    toast('Failed to delete material: ' + err.message, '❌');
  }
};

function openVideoPlayer(title) {
  var sampleVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  ];
  var vidSrc = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];

  var body = '<div style="position:relative;background:#000;border-radius:12px;overflow:hidden;margin-bottom:14px;aspect-ratio:16/9">'
    + '<video id="lms-video-player" controls style="width:100%;height:100%;display:block;background:#000" preload="metadata">'
    + '<source src="' + vidSrc + '" type="video/mp4">'
    + 'Your browser does not support HTML5 video.</video>'
    + '<button onclick="document.getElementById(\'lms-video-player\').requestFullscreen()" '
    + 'style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.3);color:#fff;border-radius:6px;padding:5px 9px;font-size:12px;cursor:pointer;z-index:10;backdrop-filter:blur(4px)">⛶ Fullscreen</button>'
    + '</div>'
    + '<div style="font-size:14px;font-weight:700;margin-bottom:4px">▶ ' + title + '</div>'
    + '<div style="font-size:12px;color:var(--muted);margin-bottom:4px">RV Learning Hub &nbsp;•&nbsp; HD Quality</div>';
  openDetail('▶ ' + title, body,
    '<button class="btn btn-teal" onclick="document.getElementById(\'lms-video-player\').requestFullscreen()">⛶ Full Screen</button>'
    + '<button class="btn btn-purple" onclick="toast(\'Speed: 1.5x\',\'⚡\');var v=document.getElementById(\'lms-video-player\');if(v)v.playbackRate=1.5">⚡ 1.5x Speed</button>');
}


// ═══════════════════════════════════════════════════════
// APPROVALS (admin_approvals) — replaces Video Moderation
// ═══════════════════════════════════════════════════════
var PENDING_APPROVALS = [
  { id:1, type:'video',    title:'Magnetism — Biot Savart Law',          faculty:'Dr. Priya Mehta',  course:'JEE Advanced (Main + KCET Decoded)', subject:'Physics',   date:'Mar 13, 11:30 AM', size:'248 MB', dur:'52 min', st:'pending' },
  { id:2, type:'material', title:'Chapter 8 — Organic Chemistry Notes',  faculty:'Prof. Amit Singh', course:'JEE Advanced (Main + KCET Decoded)', subject:'Chemistry', date:'Mar 13, 10:15 AM', size:'3.2 MB', dur:null,     st:'pending' },
  { id:3, type:'video',    title:'Ecosystem & Biodiversity — Complete',   faculty:'Dr. Kavya R.',     course:'NEET UG Decoded',                    subject:'Biology',   date:'Mar 13, 9:00 AM',  size:'312 MB', dur:'60 min', st:'pending' },
  { id:4, type:'material', title:'Partnership Accounts Formula Sheet',    faculty:'Prof. Neha K.',    course:'Commerce Decoded Programme',          subject:'Accountancy',date:'Mar 12, 4:30 PM', size:'1.1 MB', dur:null,     st:'pending' },
  { id:5, type:'video',    title:'Calculus — Integration by Parts',       faculty:'Mr. Raj Sharma',   course:'JEE (Main + KCET Decoded)',           subject:'Mathematics',date:'Mar 12, 2:00 PM',size:'198 MB', dur:'44 min', st:'pending' },
];
}
