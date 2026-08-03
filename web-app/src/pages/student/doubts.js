// Module: PAGES['student_doubts']
export function registerPage(PAGES) {
  PAGES['student_doubts'] = function() {
  if (!window.studentDoubts) {
    window.studentDoubts = [
      { q:'What is the difference between Gauss Law for uniform and non-uniform electric fields?', s:'resolved', t:'2h ago', sub:'Physics', replies:3, ai:true },
      { q:'When should I use integration by parts vs substitution?', s:'pending', t:'5h ago', sub:'Maths', replies:0, ai:false },
      { q:'Explain SN1 vs SN2 reaction mechanisms with examples', s:'resolved', t:'1d ago', sub:'Chemistry', replies:5, ai:true },
      { q:'How to determine hybridization of central atom?', s:'pending', t:'2d ago', sub:'Chemistry', replies:1, ai:false },
      { q:'What is the significance of psi and psi squared in quantum mechanics?', s:'resolved', t:'3d ago', sub:'Physics', replies:4, ai:true }
    ];
  }
  var doubts = window.studentDoubts;

  var subColors = { Physics:'#ff2d6b', Chemistry:'#00d4c8', Maths:'#a855f7', Biology:'#4ade80', General:'var(--purple)' };

  var statsHtml = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px">'
    + [{icon:'💬',val:'18',label:'Total Doubts',col:'var(--purple)'},{icon:'✅',val:'14',label:'Resolved',col:'var(--student)'},{icon:'⏳',val:'4',label:'Pending',col:'var(--yellow)'},{icon:'🤖',val:'10',label:'AI Answered',col:'var(--faculty)'}].map(function(s){
      return '<div class="enhanced-card" style="text-align:center"><div style="font-size:22px;margin-bottom:6px">'+s.icon+'</div><div style="font-family:Syne,sans-serif;font-size:24px;font-weight:900;color:'+s.col+'">'+s.val+'</div><div style="font-size:10px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-top:3px">'+s.label+'</div></div>';
    }).join('') + '</div>';

  // Ask doubt form with image upload, voice note, related reference, and live preview
  var formHtml = '<div class="card" style="margin-bottom:18px"><div class="card-header"><div class="card-title">✍️ Ask a New Doubt</div></div>'
    + '<div class="inp-row" style="margin-bottom:10px">'
    + '<div class="inp-group"><label>Subject</label><select class="inp-field" id="doubt-subject" onchange="window.updateDoubtPreview()"><option>Physics</option><option>Chemistry</option><option>Maths</option><option>Biology</option><option>General</option></select></div>'
    + '<div class="inp-group"><label>Send To</label><select class="inp-field" id="doubt-send-to"><option value="">Auto-assign best teacher</option><option>Dr. Priya Mehta (Physics)</option><option>Prof. Amit Patel (Chemistry)</option><option>Prof. Alok Sharma (Maths)</option><option>Dr. Sneha Rao (Biology)</option></select></div>'
    + '</div>'
    + '<div class="inp-row" style="margin-bottom:10px">'
    + '<div class="inp-group"><label>Related To</label><select class="inp-field" id="doubt-related-to" onchange="window.toggleDoubtReferenceFields()"><option value="">Direct question (no reference)</option><option value="video">A specific video</option><option value="material">A specific material</option></select></div>'
    + '<div class="inp-group" id="doubt-video-group" style="display:none"><label>Which Video?</label><select class="inp-field" id="doubt-video-select"><option>Laws of Motion — Full Chapter</option><option>Organic Chemistry — IUPAC Naming</option><option>Chemical Bonding — Hybridization</option><option>Integration — By Parts Method</option><option>Electrostatics — Gauss Law</option></select></div>'
    + '<div class="inp-group" id="doubt-material-group" style="display:none"><label>Which Material?</label><select class="inp-field" id="doubt-material-select"><option>Electrostatics — Complete Notes</option><option>Organic Chemistry — Reaction Map</option><option>Integration Formulae Sheet</option><option>Cell Division — Diagram Pack</option></select></div>'
    + '</div>'
    + '<div class="inp-group" style="margin-bottom:10px"><label>Your Question</label><textarea class="inp-field" id="doubt-question" placeholder="Describe your doubt in detail..." rows="3" oninput="window.updateDoubtPreview()"></textarea></div>'
    
    // Live Preview Box
    + '<div id="doubt-live-preview" class="enhanced-card" style="display:none;margin-bottom:12px;background:rgba(108,71,255,0.04);border:1px dashed rgba(108,71,255,0.3);padding:14px">'
    + '<span style="font-size:10px;font-weight:700;color:#a78bff;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:8px">📝 Live Preview</span>'
    + '<div style="display:flex;gap:10px;align-items:flex-start">'
    + '<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#6c47ff,#a855f7);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;flex-shrink:0">A</div>'
    + '<div style="flex:1;min-width:0">'
    + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">'
    + '<strong style="font-size:12px;color:var(--text)">You (Arjun Sharma)</strong>'
    + '<span id="doubt-preview-cat" class="badge badge-purple" style="font-size:9px">Physics</span>'
    + '</div>'
    + '<div id="doubt-preview-text" style="font-size:12px;color:var(--text);line-height:1.5;white-space:pre-wrap;word-break:break-word"></div>'
    + '</div></div></div>'

    // Image attachment area
    + '<div id="doubt-attachment-area" style="display:none;margin-bottom:10px;padding:14px;border:2px dashed rgba(108,71,255,.3);border-radius:12px;text-align:center;background:rgba(108,71,255,.03)">'
    + '<div style="font-size:32px;margin-bottom:8px">📸</div>'
    + '<div style="font-size:12px;color:var(--muted);margin-bottom:8px">Screenshot/Image attached</div>'
    + '<button class="btn btn-sm btn-red" onclick="document.getElementById(\'doubt-attachment-area\').style.display=\'none\';toast(\'Attachment removed\',\'🗑️\')">🗑️ Remove</button></div>'
    
    // Voice note area
    + '<div id="doubt-voice-area" style="display:none;margin-bottom:10px;padding:14px;border:1px solid rgba(74,222,128,.25);border-radius:12px;background:rgba(74,222,128,.04)">'
    + '<div style="display:flex;align-items:center;gap:10px"><span style="font-size:24px">🎤</span>'
    + '<div style="flex:1;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden"><div style="height:100%;width:65%;background:linear-gradient(90deg,#4ade80,#00d4c8);border-radius:3px"></div></div>'
    + '<span style="font-size:12px;color:var(--muted)">0:08</span>'
    + '<button class="btn btn-sm btn-red" onclick="document.getElementById(\'doubt-voice-area\').style.display=\'none\';toast(\'Voice note removed\',\'🗑️\')">🗑️</button></div></div>'
    
    + '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">'
    + '<button class="btn btn-solid" onclick="submitDoubt()">🚀 Submit Doubt</button>'
    + '<button class="btn btn-purple" onclick="document.getElementById(\'doubt-attachment-area\').style.display=\'block\';toast(\'📸 Take a screenshot or upload an image\',\'📸\')">📸 Attach Image</button>'
    + '<button class="btn btn-teal" onclick="document.getElementById(\'doubt-voice-area\').style.display=\'flex\';toast(\'🎤 Recording voice note...\',\'🎤\')">🎤 Voice Note</button>'
    + '<button class="btn btn-yellow" onclick="askAIDoubt()" style="margin-left:auto">🤖 Ask AI Instantly</button>'
    + '</div></div>';

  // Doubts list with filter and search
  var filterHtml = '<div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap">'
    + '<div class="inner-tabs">'
    + ['All Doubts','Pending','Resolved','AI Answered'].map(function(f,i){ return '<button class="itab itab-doubt'+(i===0?' active':'')+'" onclick="window.setDoubtFilter(\''+f+'\'); window.filterDoubts()">'+f+'</button>'; }).join('')
    + '</div>'
    + '<input id="doubt-search" class="inp-field" placeholder="🔍 Search doubts..." style="flex:1;max-width:240px;padding:8px 12px" oninput="window.filterDoubts()">'
    + '</div>';

  var listHtml = '<div class="card"><div class="card-header"><div class="card-title">📋 Your Doubts</div></div>' + filterHtml
    + '<div id="doubt-list-container">'
    + doubts.map(function(d) {
      var col = subColors[d.sub] || 'var(--purple)';
      return '<div class="enhanced-card doubt-card-item" style="margin-bottom:10px;cursor:pointer" data-q="'+d.q.replace(/"/g,'&quot;')+'" data-sub="'+d.sub+'" data-status="'+d.s+'" data-ai="'+d.ai+'" onclick="openEnhancedDoubtDetail(\''+d.q.replace(/'/g,"\\'")+'\',\''+d.s+'\',\''+d.sub+'\')">'
        + '<div style="display:flex;align-items:flex-start;gap:12px">'
        + '<div style="width:40px;height:40px;border-radius:12px;background:color-mix(in srgb,'+col+' 12%,var(--surface2));display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">💬</div>'
        + '<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:600;margin-bottom:4px;line-height:1.45">'+d.q+'</div>'
        + '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">'
        + '<span class="badge" style="background:color-mix(in srgb,'+col+' 12%,transparent);color:'+col+';border:1px solid color-mix(in srgb,'+col+' 25%,transparent)">'+d.sub+'</span>'
        + '<span style="font-size:11px;color:var(--muted)">'+d.t+'</span>'
        + '<span style="font-size:11px;color:var(--muted)">💬 '+d.replies+' replies</span>'
        + (d.ai ? '<span class="badge badge-teal" style="font-size:10px">🤖 AI Answered</span>' : '')
        + '</div></div>'
        + '<span class="badge '+(d.s==='resolved'?'badge-green':'badge-yellow')+'">'+d.s+'</span></div></div>';
    }).join('') 
    + '</div></div>';

  // Initialize filter state if not set
  window.currentDoubtFilter = window.currentDoubtFilter || 'All Doubts';

  return statsHtml + formHtml + listHtml;
};

// Global helper functions for Doubts page
window.toggleDoubtReferenceFields = function() {
  var related = document.getElementById('doubt-related-to').value;
  var vg = document.getElementById('doubt-video-group');
  var mg = document.getElementById('doubt-material-group');
  if (vg) vg.style.display = related === 'video' ? 'block' : 'none';
  if (mg) mg.style.display = related === 'material' ? 'block' : 'none';
};

window.updateDoubtPreview = function() {
  var q = document.getElementById('doubt-question').value;
  var cat = document.getElementById('doubt-subject').value;
  var previewBox = document.getElementById('doubt-live-preview');
  var previewText = document.getElementById('doubt-preview-text');
  var previewCat = document.getElementById('doubt-preview-cat');
  if (!previewBox) return;
  if (q.trim().length > 0) {
    previewBox.style.display = 'block';
    if (previewText) previewText.textContent = q;
    if (previewCat) {
      previewCat.textContent = cat;
      var subColors = { Physics:'#ff2d6b', Chemistry:'#00d4c8', Maths:'#a855f7', Biology:'#4ade80', General:'var(--purple)' };
      previewCat.style.background = subColors[cat] || 'var(--purple)';
    }
  } else {
    previewBox.style.display = 'none';
  }
};

window.setDoubtFilter = function(filter) {
  window.currentDoubtFilter = filter;
  document.querySelectorAll('.itab-doubt').forEach(function(btn) {
    if (btn.textContent.trim().toLowerCase() === filter.toLowerCase()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
};

window.filterDoubts = function() {
  var searchField = document.getElementById('doubt-search');
  var query = searchField ? searchField.value.toLowerCase() : '';
  var filter = window.currentDoubtFilter || 'all doubts';
  var items = document.querySelectorAll('.doubt-card-item');
  items.forEach(function(item) {
    var q = item.getAttribute('data-q').toLowerCase();
    var sub = item.getAttribute('data-sub').toLowerCase();
    var status = item.getAttribute('data-status').toLowerCase();
    var hasAi = item.getAttribute('data-ai') === 'true';
    
    var matchesSearch = q.indexOf(query) > -1 || sub.indexOf(query) > -1;
    var matchesFilter = true;
    if (filter.toLowerCase() === 'pending') {
      matchesFilter = status === 'pending';
    } else if (filter.toLowerCase() === 'resolved') {
      matchesFilter = status === 'resolved';
    } else if (filter.toLowerCase() === 'ai answered') {
      matchesFilter = hasAi;
    }
    
    if (matchesSearch && matchesFilter) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
};

// ──────────────── STUDENT ANNOUNCEMENTS (ENHANCED v3) ────────────────
}
