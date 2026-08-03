// Module: PAGES['admin_approvals']
export function registerPage(PAGES) {
  PAGES['admin_approvals'] = function() {
  var pendingCount = PENDING_APPROVALS.filter(function(a){return a.st==='pending';}).length;
  var approvedCount = PENDING_APPROVALS.filter(function(a){return a.st==='approved';}).length;
  var rejectedCount = PENDING_APPROVALS.filter(function(a){return a.st==='rejected';}).length;

  var stats = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px">'
    + [
      { icon:'⏳', val:pendingCount,  label:'Pending Review',    col:'var(--yellow)' },
      { icon:'✅', val:approvedCount, label:'Approved (Total)',   col:'var(--student)' },
      { icon:'❌', val:rejectedCount, label:'Rejected (Total)',   col:'var(--admin)' },
    ].map(function(s) {
      return '<div class="stat-card" style="border-color:color-mix(in srgb,'+s.col+' 28%,var(--border))">'
        + '<div class="stat-icon">'+s.icon+'</div>'
        + '<div class="stat-val" style="color:'+s.col+'">'+s.val+'</div>'
        + '<div class="stat-label">'+s.label+'</div></div>';
    }).join('') + '</div>';

  var notice = '<div style="margin-bottom:14px;padding:11px 14px;background:rgba(74,222,128,.07);border:1px solid rgba(74,222,128,.2);border-radius:9px;font-size:12px;color:var(--muted)">'
    + '<strong style="color:var(--student)">How it works:</strong> Faculty uploads video/material → Appears here for review → Admin approves → Content becomes visible to all enrolled students and public preview.</div>';

  var list = '<div style="display:flex;flex-direction:column;gap:12px">'
    + PENDING_APPROVALS.map(function(a, idx) {
        var isVid = a.type==='video';
        var stCol = a.st==='pending'?'badge-yellow':a.st==='approved'?'badge-green':'badge-red';
        return '<div class="card" style="border-left:3px solid '+(a.st==='pending'?'var(--yellow)':a.st==='approved'?'var(--student)':'var(--admin)')+'">'
          + '<div style="display:flex;align-items:flex-start;gap:12px">'
          + '<div style="width:48px;height:48px;border-radius:10px;background:'+(isVid?'rgba(255,45,107,.1)':'rgba(108,71,255,.1)')+';display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">'+(isVid?'🎬':'📄')+'</div>'
          + '<div style="flex:1">'
          + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">'
          + '<div style="font-weight:700;font-size:13px">'+a.title+'</div>'
          + '<span class="badge '+stCol+'">'+a.st+'</span></div>'
          + '<div style="font-size:12px;color:var(--muted);margin-bottom:3px">👨‍🏫 '+a.faculty+' &nbsp;•&nbsp; 📚 '+a.subject+' &nbsp;•&nbsp; '+a.course.split('(')[0].trim()+'</div>'
          + '<div style="font-size:11px;color:var(--muted)">📅 '+a.date+' &nbsp;•&nbsp; 💾 '+a.size+(a.dur?' &nbsp;•&nbsp; ⏱ '+a.dur:'')+'</div>'
          + '</div></div>'
          + (a.st==='pending' ? '<div style="display:flex;gap:8px;margin-top:10px">'
              + '<button class="btn btn-sm btn-purple" onclick="openApprovalDetail('+idx+')">👁 Review</button>'
              + '<button class="btn btn-sm btn-green" onclick="approveContent('+idx+')">✅ Approve</button>'
              + '<button class="btn btn-sm btn-red" onclick="rejectContent('+idx+')">❌ Reject</button>'
              + '</div>'
            : '<div style="margin-top:8px;font-size:12px;color:var(--muted)">Action taken: <strong style="color:'+(a.st==='approved'?'var(--student)':'var(--admin)')+'">'+a.st+'</strong></div>')
          + '</div>';
      }).join('') + '</div>';

  return stats + notice + list;
};

function approveContent(idx) {
  var item = PENDING_APPROVALS[idx];
  item.st = 'approved';
  // Add to MEDIA_DB so it appears in Videos & Materials
  if (item.type==='video' && MEDIA_DB[item.course] && MEDIA_DB[item.course][item.subject]) {
    MEDIA_DB[item.course][item.subject].videos.unshift({
      t:item.title, dur:item.dur||'N/A', views:0, date:'Just now', fac:item.faculty, thumb:'🆕'
    });
  }
  toast(item.title + ' approved & published!', '✅');
  // Update nav badge
  var pendingNow = PENDING_APPROVALS.filter(function(a){return a.st==='pending';}).length;
  var navItem = NAV.admin;
  navItem.forEach(function(sec){sec.items.forEach(function(it){if(it.id==='approvals')it.n=pendingNow||null;});});
  loadPage('approvals');
}

function rejectContent(idx) {
  var item = PENDING_APPROVALS[idx];
  openDetail('❌ Reject — ' + item.title,
    '<div class="inp-group"><label>Reason for Rejection</label><textarea class="inp-field" id="reject-reason" rows="4" placeholder="Explain why this content is being rejected..."></textarea></div>'
    + '<div class="inp-group"><label>Feedback to Faculty</label><textarea class="inp-field" id="reject-feedback" rows="3" placeholder="Optional improvement suggestions..."></textarea></div>',
    '<button class="btn btn-red" onclick="confirmReject('+idx+')">❌ Confirm Reject</button>'
  );
}

function confirmReject(idx) {
  PENDING_APPROVALS[idx].st = 'rejected';
  closeModal('modal-detail');
  toast(PENDING_APPROVALS[idx].title + ' rejected.', '❌');
  loadPage('approvals');
}

function openApprovalDetail(idx) {
  var a = PENDING_APPROVALS[idx];
  var isVid = a.type==='video';
  var preview = isVid
    ? '<div style="background:rgba(0,0,0,.5);border-radius:10px;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;margin-bottom:14px;position:relative;overflow:hidden">'
      + '<div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,45,107,.15),rgba(108,71,255,.15))"></div>'
      + '<div style="z-index:1;text-align:center"><div style="width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;margin:0 auto 8px;cursor:pointer" onclick="toast(\'Preview playing...\',\'▶\')">'
      + '<div style="width:0;height:0;border-style:solid;border-width:10px 0 10px 18px;border-color:transparent transparent transparent #fff;margin-left:3px"></div></div>'
      + '<div style="color:rgba(255,255,255,.6);font-size:11px">Preview</div></div></div>'
    : '<div style="padding:20px;background:rgba(108,71,255,.07);border-radius:10px;text-align:center;margin-bottom:14px"><div style="font-size:40px;margin-bottom:8px">📄</div><div style="font-weight:600">'+a.title+'</div><div style="font-size:12px;color:var(--muted);margin-top:4px">'+a.size+'</div></div>';
  var info = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">'
    + [['Faculty',a.faculty],['Course',a.course.split('(')[0].trim()],['Subject',a.subject],['Submitted',a.date],['File Size',a.size],(a.dur?['Duration',a.dur]:['Type',a.type])].map(function(e){
        return '<div style="background:var(--surface2);border-radius:7px;padding:8px"><div style="font-size:10px;color:var(--muted)">'+e[0]+'</div><div style="font-size:13px;font-weight:600;margin-top:2px">'+e[1]+'</div></div>';
      }).join('') + '</div>';
  openDetail((isVid?'🎬':'📄')+' Review — '+a.title, preview+info,
    '<button class="btn btn-green" onclick="approveContent('+idx+');closeModal(\'modal-detail\')">✅ Approve & Publish</button>'
    + '<button class="btn btn-red" onclick="closeModal(\'modal-detail\');rejectContent('+idx+')">❌ Reject</button>');
}



// ════════════════════════════════════════
// QUIZ RESULTS (admin_quiz)
// ════════════════════════════════════════
var QUIZ_RESULTS = [
  { student:'Arjun Sharma',  roll:'RV2024001', course:'JEE Advanced (Main + KCET Decoded)', subject:'Physics',     video:'Electrostatics — Coulomb\'s Law', score:85, total:100, date:'Mar 13', time:'45 min', campus:'RV Jayanagar' },
  { student:'Arjun Sharma',  roll:'RV2024001', course:'JEE Advanced (Main + KCET Decoded)', subject:'Mathematics', video:'Calculus — Limits & Continuity',  score:72, total:100, date:'Mar 12', time:'50 min', campus:'RV Jayanagar' },
  { student:'Arjun Sharma',  roll:'RV2024001', course:'JEE Advanced (Main + KCET Decoded)', subject:'Chemistry',   video:'Organic — IUPAC Naming',          score:91, total:100, date:'Mar 11', time:'42 min', campus:'RV Jayanagar' },
  { student:'Sneha Patel',   roll:'RV2024002', course:'JEE Advanced (Main + KCET Decoded)', subject:'Physics',     video:'Gauss Law — Full Derivation',     score:78, total:100, date:'Mar 13', time:'48 min', campus:'RV Rajajinagar' },
  { student:'Sneha Patel',   roll:'RV2024002', course:'JEE Advanced (Main + KCET Decoded)', subject:'Chemistry',   video:'Reaction Mechanisms SN1 vs SN2',  score:88, total:100, date:'Mar 12', time:'44 min', campus:'RV Rajajinagar' },
  { student:'Rohan Gupta',   roll:'RV2024003', course:'JEE (Main + KCET Decoded)',          subject:'Mathematics', video:'Integration — All Methods',       score:65, total:100, date:'Mar 13', time:'55 min', campus:'RV Jayanagar' },
  { student:'Rohan Gupta',   roll:'RV2024003', course:'JEE (Main + KCET Decoded)',          subject:'Physics',     video:'Optics — Ray & Wave Optics',      score:70, total:100, date:'Mar 11', time:'40 min', campus:'RV Jayanagar' },
  { student:'Kavya Reddy',   roll:'RV2024015', course:'NEET UG Decoded',                   subject:'Biology',     video:'Cell Structure — Complete',       score:94, total:100, date:'Mar 13', time:'38 min', campus:'RV Electronic City' },
  { student:'Kavya Reddy',   roll:'RV2024015', course:'NEET UG Decoded',                   subject:'Chemistry',   video:'Biomolecules — Carbohydrates',    score:82, total:100, date:'Mar 12', time:'41 min', campus:'RV Electronic City' },
  { student:'Dev Verma',     roll:'RV2024020', course:'Commerce Decoded Programme',         subject:'Accountancy', video:'Partnership Accounts Intro',      score:55, total:100, date:'Mar 10', time:'60 min', campus:'RV Rajajinagar' },
  { student:'Dev Verma',     roll:'RV2024020', course:'Commerce Decoded Programme',         subject:'Economics',   video:'Macro Economics — National Income',score:62,total:100, date:'Mar 9',  time:'35 min', campus:'RV Rajajinagar' },
];
}
