// Module: PAGES['admin_payments']
export function registerPage(PAGES) {
  PAGES['admin_payments'] = function() {
  var total     = PAYMENT_HISTORY.filter(function(p){return p.status==='success';}).reduce(function(a,p){return a+p.amount;},0);
  var courseTxn = PAYMENT_HISTORY.filter(function(p){return p.type==='course'  && p.status==='success';}).reduce(function(a,p){return a+p.amount;},0);
  var matTxn    = PAYMENT_HISTORY.filter(function(p){return p.type==='material'&& p.status==='success';}).reduce(function(a,p){return a+p.amount;},0);
  var pending   = PAYMENT_HISTORY.filter(function(p){return p.status==='pending';}).reduce(function(a,p){return a+p.amount;},0);

  function fmt(n){return '₹'+n.toLocaleString('en-IN');}

  var stats = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:20px">'
    + [
      { icon:'💰', val:fmt(total),     label:'Total Revenue',      col:'var(--yellow)' },
      { icon:'📚', val:fmt(courseTxn), label:'Course Payments',    col:'var(--student)' },
      { icon:'📄', val:fmt(matTxn),    label:'Material Sales',     col:'var(--purple)' },
      { icon:'⏳', val:fmt(pending),   label:'Pending',            col:'var(--admin)' },
    ].map(function(s){
      return '<div class="stat-card" style="border-color:color-mix(in srgb,'+s.col+' 28%,var(--border))">'
        + '<div class="stat-icon">'+s.icon+'</div>'
        + '<div class="stat-val" style="font-size:16px;color:'+s.col+'">'+s.val+'</div>'
        + '<div class="stat-label">'+s.label+'</div></div>';
    }).join('') + '</div>';

  // Filter tabs
  var pState = window._payState || 'all';
  window._payState = pState;
  var tabs = '<div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;align-items:center">'
    + [['all','All'],['success','✅ Success'],['pending','⏳ Pending'],['failed','❌ Failed'],['course','📚 Course'],['material','📄 Material']].map(function(t){
        var active = pState===t[0];
        return '<button class="btn btn-sm" onclick="window._payState=\''+t[0]+'\';loadPage(\'payments\')" style="'+(active?'background:var(--admin);color:#fff;':'')+'">'+t[1]+'</button>';
      }).join('')
    + '<button class="btn btn-sm btn-teal" onclick="exportPayments()" style="margin-left:auto">⬇ Export</button>'
    + '</div>';

  var filtered = pState==='all' ? PAYMENT_HISTORY
    : ['success','pending','failed'].indexOf(pState)>=0
      ? PAYMENT_HISTORY.filter(function(p){return p.status===pState;})
      : PAYMENT_HISTORY.filter(function(p){return p.type===pState;});

  var rows = filtered.map(function(p){
    var stCol = p.status==='success'?'badge-green':p.status==='pending'?'badge-yellow':'badge-red';
    return '<tr onclick="openPaymentDetail(\''+p.id+'\')" style="cursor:pointer">'
      + '<td style="color:var(--muted);font-size:12px">'+p.id+'</td>'
      + '<td style="font-weight:600">'+p.student+'</td>'
      + '<td style="font-size:12px">'+p.material+'</td>'
      + '<td style="font-weight:700;color:var(--yellow)">'+fmt(p.amount)+'</td>'
      + '<td style="color:var(--muted);font-size:12px">'+p.date+'</td>'
      + '<td style="font-size:12px">'+p.method+'</td>'
      + '<td><span class="badge '+stCol+'">'+p.status+'</span></td>'
      + '<td><span class="badge '+(p.type==='course'?'badge-purple':'badge-teal')+'">'+p.type+'</span></td>'
      + '<td><button class="btn btn-sm btn-purple" onclick="event.stopPropagation();openPaymentDetail(\''+p.id+'\')">🧾 Receipt</button></td>'
      + '</tr>';
  }).join('');

  var table = '<div class="card"><div class="card-header"><div class="card-title">💳 Payment Transactions</div><span style="font-size:12px;color:var(--muted)">'+filtered.length+' records</span></div>'
    + '<div class="tbl-wrap"><table><thead><tr><th>Txn ID</th><th>Student</th><th>Material / Course</th><th>Amount</th><th>Date</th><th>Method</th><th>Status</th><th>Type</th><th>Actions</th></tr></thead>'
    + '<tbody>'+rows+'</tbody></table></div></div>';

  return stats + tabs + table;
};

function openPaymentDetail(txnId) {
  var p = PAYMENT_HISTORY.find(function(x){return x.id===txnId;});
  if (!p) { toast('Transaction not found','⚠️'); return; }
  var stCol = p.status==='success'?'var(--student)':p.status==='pending'?'var(--yellow)':'var(--admin)';
  var body = '<div style="background:linear-gradient(135deg,rgba(251,191,36,.06),rgba(74,222,128,.06));border:1px solid rgba(251,191,36,.2);border-radius:12px;padding:16px;margin-bottom:14px">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
    + '<div style="font-size:18px;font-weight:800;font-family:Syne,sans-serif">🧾 Payment Receipt</div>'
    + '<span class="badge" style="background:color-mix(in srgb,'+stCol+' 15%,transparent);color:'+stCol+';border:1px solid color-mix(in srgb,'+stCol+' 30%,transparent);font-size:12px">'+p.status.toUpperCase()+'</span></div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
    + [['Transaction ID',p.id],['Student',p.student],['Material / Course',p.material],['Amount','₹'+p.amount.toLocaleString('en-IN')],['Payment Method',p.method],['Date',p.date],['Type',p.type],['Status',p.status]].map(function(e){
        return '<div style="background:var(--surface2);border-radius:7px;padding:8px"><div style="font-size:10px;color:var(--muted)">'+e[0]+'</div><div style="font-size:13px;font-weight:600;margin-top:2px">'+e[1]+'</div></div>';
      }).join('')+'</div></div>';
  openDetail('🧾 Transaction — '+p.id, body,
    '<button class="btn btn-teal" onclick="window.downloadPaymentReceipt(\''+p.id+'\');closeModal(\'modal-detail\')">⬇ Download PDF</button>'
    + (p.status==='pending' ? '<button class="btn btn-green" onclick="toast(\'Payment marked as received!\',\'✅\');closeModal(\'modal-detail\')">✅ Mark Paid</button>' : ''));
}

function exportPayments() {
  var pState = window._payState || 'all';
  var filtered = pState==='all' ? PAYMENT_HISTORY
    : ['success','pending','failed'].indexOf(pState)>=0
      ? PAYMENT_HISTORY.filter(function(p){return p.status===pState;})
      : PAYMENT_HISTORY.filter(function(p){return p.type===pState;});
  var rows = [['Txn ID','Student','Material/Course','Amount','Date','Method','Status','Type']].concat(
    filtered.map(function(p){return [p.id,p.student,p.material,'₹'+p.amount,p.date,p.method,p.status,p.type];}));
  var csv = rows.map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join('\n');
  var blob = new Blob([csv],{type:'text/csv'});
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a'); a.href=url; a.download='payments_'+pState+'.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Payments exported!','⬇');
}

// ════════════════════════════════════════
// FACULTY UPLOAD → PENDING_APPROVALS
// ════════════════════════════════════════
async function submitFacultyUpload() {
  var titleEl   = document.querySelectorAll('#page-body .inp-field')[1];
  var typeEl    = document.querySelectorAll('#page-body select')[0];
  var subjectEl = document.querySelectorAll('#page-body select')[1];
  var title   = titleEl   ? titleEl.value.trim()   : '';
  var type    = typeEl    ? typeEl.value            : 'Video Lecture';
  var subject = subjectEl ? subjectEl.value         : 'Physics';
  if (!title) { toast('Enter a title before uploading!','⚠️'); return; }
  
  var isVideo = type.toLowerCase().indexOf('video') >= 0;
  
  try {
    if (isVideo) {
      await api('/api/videos', {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          sub: subject,
          dur: '45:00',
          thumb: '🎥'
        })
      });
    } else {
      await api('/api/materials', {
        method: 'POST',
        body: JSON.stringify({
          name: title + ' Notes.pdf',
          type: 'pdf',
          sub: subject
        })
      });
    }
    toast('"' + title + '" uploaded successfully!', '📤');
    if (titleEl) titleEl.value = '';
    
    // Re-sync data and reload page
    await syncLMSData();
    loadPage('content');
  } catch (err) {
    toast('Upload failed: ' + err.message, '❌');
  }
}

window.openEditLibraryItem = function(id, isVideo) {
  if (String(id).indexOf('mock') === 0) {
    toast('Cannot edit mock library items!', '⚠️');
    return;
  }
  var item;
  if (isVideo) {
    item = (window.LMS_VIDEOS || []).find(function(v){return v._id === id;});
  } else {
    item = (window.LMS_MATERIALS || []).find(function(m){return m._id === id;});
  }
  if (!item) { toast('Item not found', '⚠️'); return; }
  
  var title = isVideo ? item.title : item.name;
  var subject = item.sub || '';
  var batch = item.batch || 'All Batches';
  var extraField = isVideo 
    ? '<div class="inp-group"><label>Duration</label><input class="inp-field" id="edit-lib-dur" value="'+(item.dur || '30:00')+'"></div>'
    : '<div class="inp-group"><label>File Size</label><input class="inp-field" id="edit-lib-size" value="'+(item.size || '1.5 MB')+'"></div>';

  var body = '<div style="display:flex;flex-direction:column;gap:12px">'
    + '<div class="inp-group"><label>Title</label><input class="inp-field" id="edit-lib-title" value="'+title.replace(/"/g,'&quot;')+'"></div>'
    + '<div class="inp-row" style="display:grid;grid-template-columns:1fr 1fr;gap:14px">'
    + '<div class="inp-group"><label>Subject</label>'
    + '<select class="inp-field" id="edit-lib-sub">'
    + ['Physics','Chemistry','Maths','Biology'].map(function(s){
        return '<option '+(s===subject?'selected':'')+'>'+s+'</option>';
      }).join('')
    + '</select></div>'
    + extraField
    + '</div>'
    + '<div class="inp-group"><label>Assign to Batch</label>'
    + '<select class="inp-field" id="edit-lib-batch">'
    + ['All Batches','JEE Advanced A','JEE Advanced B','NEET Batch'].map(function(b){
        return '<option '+(b===batch?'selected':'')+'>'+b+'</option>';
      }).join('')
    + '</select></div>'
    + '</div>';

  openDetail('✏️ Edit Content', body,
    '<button class="btn btn-solid" onclick="window.saveEditLibraryItem(\''+id+'\','+isVideo+')">💾 Save Changes</button>'
    + '<button class="btn btn-purple" onclick="closeModal(\'modal-detail\')">Cancel</button>');
};

window.saveEditLibraryItem = async function(id, isVideo) {
  var titleEl = document.getElementById('edit-lib-title');
  var subEl = document.getElementById('edit-lib-sub');
  var batchEl = document.getElementById('edit-lib-batch');
  
  if (!titleEl || !titleEl.value.trim()) {
    toast('Title is required!', '⚠️');
    return;
  }
  
  var titleVal = titleEl.value.trim();
  var subVal = subEl ? subEl.value : 'Physics';
  var batchVal = batchEl ? batchEl.value : 'All Batches';
  
  var payload = {
    title: titleVal,
    name: titleVal,
    sub: subVal,
    batch: batchVal
  };
  
  if (isVideo) {
    var durEl = document.getElementById('edit-lib-dur');
    if (durEl) payload.dur = durEl.value;
  } else {
    var sizeEl = document.getElementById('edit-lib-size');
    if (sizeEl) payload.size = sizeEl.value;
  }
  
  try {
    var endpoint = isVideo ? '/api/videos/' + id : '/api/materials/' + id;
    await api(endpoint, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    
    toast('Changes saved successfully!', '✅');
    closeModal('modal-detail');
    await syncLMSData();
    loadPage('content');
  } catch (err) {
    toast('Save failed: ' + err.message, '❌');
  }
};


window.deleteLibraryItem = async function(id, isVideo) {
  if (String(id).indexOf('mock') === 0) {
    toast('Cannot delete mock library items!', '⚠️');
    return;
  }
  if (!confirm('Are you sure you want to delete this content item?')) return;
  try {
    var endpoint = isVideo ? '/api/videos/' + id : '/api/materials/' + id;
    await api(endpoint, { method: 'DELETE' });
    toast('Deleted successfully!', '🗑️');
    await syncLMSData();
    loadPage('content');
  } catch (err) {
    toast('Failed to delete: ' + err.message, '❌');
  }
};



// ══════════════════════════════════════════════════
// MISSING FUNCTIONS & ENHANCEMENTS — APPENDED TO FILE
// ══════════════════════════════════════════════════

// ── Live Class Modal (Video Player with chat) ──
function openLiveClassModal() {
  window.mockChatMessages = window.mockChatMessages || [
    {n:'Sneha P.',m:'Great explanation sir!',t:'2m ago',c:'#6c47ff'},
    {n:'Rohan G.',m:'Can you repeat the formula?',t:'1m ago',c:'#ff6b35'},
    {n:'Ananya S.',m:'Thank you! Very clear 👏',t:'30s ago',c:'#4ade80'},
    {n:'Dr. Priya',m:'Check slide 14 for the derivation',t:'15s ago',c:'#00d4c8'}
  ];

  window.renderLivePlayerChat = function() {
    var container = document.getElementById('live-chat-messages-inplayer');
    if (!container) return;
    container.innerHTML = window.mockChatMessages.map(function(msg){
      return '<div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:10px">'
        + '<div style="width:24px;height:24px;border-radius:50%;background:'+msg.c+';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0">'+msg.n[0]+'</div>'
        + '<div><div style="font-size:11px"><span style="font-weight:700;color:'+msg.c+'">'+msg.n+'</span> <span style="color:var(--muted);font-size:10px">'+msg.t+'</span></div>'
        + '<div style="font-size:12px;color:var(--text);margin-top:2px">'+msg.m+'</div></div></div>';
    }).join('');
    container.scrollTop = container.scrollHeight;
  };

  var sampleVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  ];
  var vidSrc = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];

  var body = '<div style="display:flex;gap:14px;margin-bottom:14px">'
    + '<div style="flex:2;min-width:0">'
    + '<div style="position:relative;background:#000;border-radius:12px;overflow:hidden;aspect-ratio:16/9">'
    + '<video id="lms-live-player" controls autoplay style="width:100%;height:100%;display:block;background:#000" preload="metadata">'
    + '<source src="' + vidSrc + '" type="video/mp4">Your browser does not support HTML5 video.</video>'
    + '<div style="position:absolute;top:10px;left:10px;display:flex;gap:6px">'
    + '<span class="live-badge" style="font-size:11px;padding:4px 10px"><div class="live-dot"></div>LIVE</span>'
    + '<span style="background:rgba(0,0,0,.6);backdrop-filter:blur(4px);padding:4px 10px;border-radius:20px;font-size:11px;color:#fff">👥 142 watching</span></div>'
    + '<div style="position:absolute;top:10px;right:10px"><span style="background:rgba(255,45,107,.2);border:1px solid rgba(255,45,107,.3);padding:3px 8px;border-radius:20px;font-size:10px;color:#ff2d6b;font-weight:700">🔴 REC</span></div>'
    + '</div>'
    + '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">'
    + '<button class="btn btn-purple" onclick="var v=document.getElementById(\'lms-live-player\');if(v)v.playbackRate=1;toast(\'Speed: 1x\',\'▶\')">1x</button>'
    + '<button class="btn btn-purple" onclick="var v=document.getElementById(\'lms-live-player\');if(v)v.playbackRate=1.5;toast(\'Speed: 1.5x\',\'⚡\')">1.5x</button>'
    + '<button class="btn btn-purple" onclick="var v=document.getElementById(\'lms-live-player\');if(v)v.playbackRate=2;toast(\'Speed: 2x\',\'⚡\')">2x</button>'
    + '<button class="btn btn-teal" onclick="var v=document.getElementById(\'lms-live-player\');if(v)v.requestFullscreen()">⛶ Fullscreen</button>'
    + '<button class="btn btn-yellow" onclick="toast(\'Hand raised! ✋\',\'🖐️\')">✋ Raise Hand</button>'
    + '<button class="btn btn-purple" onclick="toast(\'Notes opened\',\'📝\')">📝 Notes</button>'
    + '</div></div>'
    // Chat panel
    + '<div style="flex:1;min-width:200px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;display:flex;flex-direction:column;max-height:350px">'
    + '<div style="padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.06);font-size:13px;font-weight:700">💬 Live Chat</div>'
    + '<div id="live-chat-messages-inplayer" style="flex:1;overflow-y:auto;padding:10px 12px;display:flex;flex-direction:column;gap:8px"></div>'
    + '<div style="padding:8px 10px;border-top:1px solid rgba(255,255,255,.06);display:flex;gap:6px"><input id="live-chat-input-inplayer" class="inp-field" placeholder="Type a message..." style="flex:1;padding:8px 10px;font-size:12px" onkeydown="if(event.key===\'Enter\'){window.sendLiveChatFromPlayer()}">'
    + '<button class="btn btn-sm btn-solid" onclick="window.sendLiveChatFromPlayer()">Send</button></div></div></div>'
    + '<div style="font-size:14px;font-weight:700;margin-bottom:4px">⚛️ Physics — Electrostatics: Gauss Law</div>'
    + '<div style="font-size:12px;color:var(--muted)">Dr. Priya Mehta &nbsp;•&nbsp; JEE Advanced Batch A &nbsp;•&nbsp; HD Quality</div>';

  openDetail('🎥 Live Class', body, '<button class="btn btn-red" onclick="toast(\'Left class\',\'👋\');closeModal(\'modal-detail\')">Leave Class</button>');
  
  setTimeout(function() {
    window.renderLivePlayerChat();
  }, 50);
}

window.sendLiveChatFromPlayer = function() {
  var input = document.getElementById('live-chat-input-inplayer');
  if (!input || !input.value.trim()) return;
  
  window.mockChatMessages.push({
    n: 'Arjun S. (You)',
    m: input.value.trim(),
    t: 'Just now',
    c: 'var(--student)'
  });
  
  input.value = '';
  window.renderLivePlayerChat();
};

// ── Doubt Detail (used in dashboard) ──
function openDoubtDetail(question, status) {
  openEnhancedDoubtDetail(question, status, 'Physics');
}

// ── Digital Blackboard ──
function openDigitalBlackboard() {
  var body = '<div style="margin-bottom:14px">'
    + '<canvas id="blackboard-canvas" width="700" height="400" style="width:100%;background:#1a1a2e;border:1px solid rgba(255,255,255,.1);border-radius:12px;cursor:crosshair;touch-action:none"></canvas></div>'
    + '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">'
    + '<span style="font-size:12px;color:var(--muted);font-weight:700">Color:</span>'
    + ['#fff','#ff2d6b','#4ade80','#fbbf24','#00c6ff','#a855f7'].map(function(c){ return '<button onclick="window._bbColor=\''+c+'\'" style="width:28px;height:28px;border-radius:50%;background:'+c+';border:2px solid rgba(255,255,255,.2);cursor:pointer"></button>'; }).join('')
    + '<span style="font-size:12px;color:var(--muted);font-weight:700;margin-left:12px">Size:</span>'
    + [2,4,8].map(function(s){ return '<button onclick="window._bbSize='+s+'" class="btn btn-sm btn-purple" style="min-width:32px;justify-content:center">'+s+'</button>'; }).join('')
    + '<button class="btn btn-sm btn-red" style="margin-left:auto" onclick="var c=document.getElementById(\'blackboard-canvas\');if(c){c.getContext(\'2d\').clearRect(0,0,c.width,c.height)}">🗑️ Clear</button>'
    + '</div>';

  openDetail('🎨 Digital Blackboard', body, '<button class="btn btn-teal" onclick="toast(\'Screenshot saved!\',\'📸\');closeModal(\'modal-detail\')">📸 Save Screenshot</button>');

  // Setup drawing after modal is shown
  setTimeout(function() {
    var canvas = document.getElementById('blackboard-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var drawing = false;
    window._bbColor = '#fff';
    window._bbSize = 3;
    canvas.addEventListener('mousedown', function(e) { drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); });
    canvas.addEventListener('mousemove', function(e) { if (!drawing) return; ctx.lineTo(e.offsetX, e.offsetY); ctx.strokeStyle = window._bbColor; ctx.lineWidth = window._bbSize; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); });
    canvas.addEventListener('mouseup', function() { drawing = false; });
    canvas.addEventListener('mouseleave', function() { drawing = false; });
    // Touch support
    canvas.addEventListener('touchstart', function(e) { e.preventDefault(); drawing = true; var r = canvas.getBoundingClientRect(); var t = e.touches[0]; ctx.beginPath(); ctx.moveTo(t.clientX-r.left, t.clientY-r.top); });
    canvas.addEventListener('touchmove', function(e) { e.preventDefault(); if (!drawing) return; var r = canvas.getBoundingClientRect(); var t = e.touches[0]; ctx.lineTo(t.clientX-r.left, t.clientY-r.top); ctx.strokeStyle = window._bbColor; ctx.lineWidth = window._bbSize; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); });
    canvas.addEventListener('touchend', function() { drawing = false; });
  }, 300);
}

// ── Video Watch with Notes ──
function openVideoWithNotes(title, emoji) {
  var sampleVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  ];
  var vidSrc = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];

  var body = '<div style="position:relative;background:#000;border-radius:12px;overflow:hidden;margin-bottom:14px;aspect-ratio:16/9">'
    + '<video id="lms-video-player2" controls style="width:100%;height:100%;display:block;background:#000" preload="metadata">'
    + '<source src="' + vidSrc + '" type="video/mp4">Your browser does not support HTML5 video.</video></div>'
    + '<div style="font-size:15px;font-weight:700;margin-bottom:4px">' + (emoji||'▶') + ' ' + title + '</div>'
    + '<div style="font-size:12px;color:var(--muted);margin-bottom:14px">RV Learning Hub &nbsp;•&nbsp; HD Quality</div>'
    + '<div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">'
    + '<button class="btn btn-purple btn-sm" onclick="var v=document.getElementById(\'lms-video-player2\');if(v)v.playbackRate=1;toast(\'1x\',\'▶\')">1x</button>'
    + '<button class="btn btn-purple btn-sm" onclick="var v=document.getElementById(\'lms-video-player2\');if(v)v.playbackRate=1.25;toast(\'1.25x\',\'⚡\')">1.25x</button>'
    + '<button class="btn btn-purple btn-sm" onclick="var v=document.getElementById(\'lms-video-player2\');if(v)v.playbackRate=1.5;toast(\'1.5x\',\'⚡\')">1.5x</button>'
    + '<button class="btn btn-purple btn-sm" onclick="var v=document.getElementById(\'lms-video-player2\');if(v)v.playbackRate=2;toast(\'2x\',\'⚡\')">2x</button>'
    + '<button class="btn btn-teal btn-sm" onclick="var v=document.getElementById(\'lms-video-player2\');if(v)v.requestFullscreen()">⛶ Fullscreen</button>'
    + '<button class="btn btn-yellow btn-sm" onclick="toast(\'Bookmarked!\',\'🔖\')">🔖 Bookmark</button>'
    + '<button class="btn btn-purple btn-sm" onclick="toast(\'AI Quiz generating...\',\'🤖\')">🤖 AI Quiz</button></div>'
    + '<div style="font-family:Syne,sans-serif;font-size:13px;font-weight:700;margin-bottom:8px">📝 Video Notes</div>'
    + '<textarea class="inp-field" placeholder="Take notes while watching..." rows="4" style="width:100%;resize:vertical"></textarea>';

  openDetail('▶ ' + title, body,
    '<button class="btn btn-teal" onclick="toast(\'Notes saved!\',\'📝\');closeModal(\'modal-detail\')">💾 Save Notes</button>'
    + '<button class="btn btn-purple" onclick="downloadMaterial(\''+title.replace(/'/g,"\\'")+' Lecture Notes\');closeModal(\'modal-detail\')">⬇️ Download</button>');
}

// ── Material Preview Modal ──
function openMaterialPreview(name, type, sub, fac) {
  var previewContent;
  if (type === 'pdf') {
    previewContent = '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:40px;text-align:center;margin-bottom:16px;min-height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center">'
      + '<div style="font-size:64px;margin-bottom:16px">📕</div>'
      + '<div style="font-family:Syne,sans-serif;font-size:16px;font-weight:700;margin-bottom:6px">' + name + '</div>'
      + '<div style="font-size:13px;color:var(--muted);margin-bottom:16px">' + sub + ' · by ' + fac + '</div>'
      + '<div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:20px;width:100%;max-width:400px;text-align:left">'
      + '<div style="font-size:13px;font-weight:700;margin-bottom:8px">📋 Contents</div>'
      + '<div style="font-size:12px;color:var(--muted);line-height:2">'
      + '1. Introduction & Overview<br>2. Key Concepts & Definitions<br>3. Important Formulae<br>4. Worked Examples<br>5. Practice Problems<br>6. Summary & Quick Revision</div></div></div>';
  } else {
    previewContent = '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:40px;text-align:center;margin-bottom:16px;min-height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center">'
      + '<div style="font-size:64px;margin-bottom:16px">' + (type==='ppt'?'📊':'📘') + '</div>'
      + '<div style="font-family:Syne,sans-serif;font-size:16px;font-weight:700;margin-bottom:6px">' + name + '</div>'
      + '<div style="font-size:13px;color:var(--muted)">' + sub + ' · by ' + fac + ' · ' + type.toUpperCase() + ' format</div></div>';
  }

  openDetail('📂 ' + name, previewContent,
    '<button class="btn btn-solid" onclick="downloadMaterial(\''+name.replace(/'/g,"\\'")+'\');closeModal(\'modal-detail\')">⬇️ Download</button>'
    + '<button class="btn btn-yellow" onclick="toast(\'Bookmarked!\',\'🔖\')">🔖 Bookmark</button>'
    + '<button class="btn btn-purple" onclick="toast(\'Shared!\',\'📤\')">📤 Share</button>');
}

// ── Announcement Detail Modal ──
function openAnnouncementDetail(title, body, cat, date) {
  var catColors = { Important:'#ff2d6b', Academic:'#a855f7', Events:'#fbbf24', Notice:'#00d4c8' };
  var col = catColors[cat] || 'var(--purple)';

  var content = '<div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">'
    + '<span class="badge" style="background:color-mix(in srgb,'+col+' 12%,transparent);color:'+col+';border:1px solid color-mix(in srgb,'+col+' 25%,transparent)">'+cat+'</span>'
    + '<span style="font-size:12px;color:var(--muted)">📅 ' + date + '</span></div>'
    + '<div style="font-size:15px;line-height:1.7;color:var(--text);margin-bottom:16px">' + body + '</div>'
    + '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:14px">'
    + '<div style="font-size:12px;font-weight:700;margin-bottom:6px;color:var(--muted)">📎 Additional Info</div>'
    + '<div style="font-size:12px;color:var(--muted);line-height:1.8">• Posted by: Administration<br>• Applicable to: All Batches<br>• Priority: ' + cat + '</div></div>';

  openDetail('📢 ' + title, content,
    '<button class="btn btn-purple" onclick="toast(\'Marked as read!\',\'✅\');closeModal(\'modal-detail\')">✅ Mark as Read</button>'
    + '<button class="btn btn-yellow" onclick="toast(\'Pinned!\',\'📌\')">📌 Pin</button>');
}

// ── Profile Edit Modal ──
function openEditProfile() {
  var u = G.user || {};
  var body = '<div style="display:flex;flex-direction:column;gap:12px">'
    + '<div class="inp-group"><label>Full Name</label><input class="inp-field" value="'+(u.name||'Student')+'" id="edit-name"></div>'
    + '<div class="inp-group"><label>Email</label><input class="inp-field" value="'+(u.email||'')+'" id="edit-email"></div>'
    + '<div class="inp-row"><div class="inp-group"><label>Phone</label><input class="inp-field" value="9876543210"></div>'
    + '<div class="inp-group"><label>Date of Birth</label><input class="inp-field" type="date" value="2006-03-15"></div></div>'
    + '<div class="inp-row"><div class="inp-group"><label>Batch</label><input class="inp-field" value="'+(u.batch||'JEE Advanced 2025')+'" readonly></div>'
    + '<div class="inp-group"><label>Roll Number</label><input class="inp-field" value="'+(u.roll||'RV2024001')+'" readonly></div></div>'
    + '<div class="inp-group"><label>Bio</label><textarea class="inp-field" rows="2" placeholder="Tell us about yourself...">Aspiring Engineer | JEE 2025</textarea></div>'
    + '<div class="inp-group"><label>Social Links</label>'
    + '<div style="display:flex;gap:8px;flex-wrap:wrap">'
    + '<input class="inp-field" placeholder="LinkedIn URL" style="flex:1">'
    + '<input class="inp-field" placeholder="GitHub URL" style="flex:1"></div></div></div>';

  openDetail('✏️ Edit Profile', body,
    '<button class="btn btn-solid" onclick="toast(\'Profile updated!\',\'✅\');closeModal(\'modal-detail\')">💾 Save Changes</button>'
    + '<button class="btn btn-purple" onclick="closeModal(\'modal-detail\')">Cancel</button>');
}

// ── Quiz Analytics Modal ──
function openQuizAnalytics(title, score, total, correct, wrong, skip) {
  var pct = Math.round(score/total*100);
  var col = pct >= 85 ? '#4ade80' : pct >= 70 ? '#fbbf24' : '#ff2d6b';

  var body = '<div style="text-align:center;margin-bottom:20px">'
    + '<div style="position:relative;width:120px;height:120px;margin:0 auto 14px"><svg width="120" height="120" style="transform:rotate(-90deg)"><circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="8"/><circle cx="60" cy="60" r="50" fill="none" stroke="'+col+'" stroke-width="8" stroke-linecap="round" stroke-dasharray="314" stroke-dashoffset="'+Math.round(314-314*pct/100)+'"/></svg><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><span style="font-family:Syne,sans-serif;font-size:32px;font-weight:900;color:'+col+'">'+pct+'%</span><span style="font-size:11px;color:var(--muted)">Score</span></div></div>'
    + '<div style="font-family:Syne,sans-serif;font-size:20px;font-weight:800;color:'+col+'">'+score+' / '+total+'</div></div>'
    + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">'
    + '<div style="text-align:center;padding:14px;background:rgba(74,222,128,.06);border:1px solid rgba(74,222,128,.15);border-radius:12px"><div style="font-size:22px;margin-bottom:4px">✅</div><div style="font-family:Syne,sans-serif;font-size:24px;font-weight:900;color:#4ade80">'+correct+'</div><div style="font-size:10px;color:var(--muted);font-weight:700;margin-top:3px">CORRECT</div></div>'
    + '<div style="text-align:center;padding:14px;background:rgba(255,45,107,.06);border:1px solid rgba(255,45,107,.15);border-radius:12px"><div style="font-size:22px;margin-bottom:4px">❌</div><div style="font-family:Syne,sans-serif;font-size:24px;font-weight:900;color:#ff2d6b">'+wrong+'</div><div style="font-size:10px;color:var(--muted);font-weight:700;margin-top:3px">WRONG</div></div>'
    + '<div style="text-align:center;padding:14px;background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.15);border-radius:12px"><div style="font-size:22px;margin-bottom:4px">⊘</div><div style="font-family:Syne,sans-serif;font-size:24px;font-weight:900;color:#fbbf24">'+skip+'</div><div style="font-size:10px;color:var(--muted);font-weight:700;margin-top:3px">SKIPPED</div></div></div>'
    + '<div style="font-family:Syne,sans-serif;font-size:13px;font-weight:700;margin-bottom:10px">📊 Subject-wise Performance</div>'
    + [{sub:'Physics',s:85,c:'#ff2d6b'},{sub:'Chemistry',s:72,c:'#00d4c8'},{sub:'Maths',s:78,c:'#a855f7'}].map(function(s){
      return '<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span>'+s.sub+'</span><span style="color:'+s.c+';font-weight:700">'+s.s+'%</span></div><div class="prog-bar"><div class="prog-fill" style="width:'+s.s+'%;background:'+s.c+'"></div></div></div>';
    }).join('');

  openDetail('📊 ' + title + ' — Analysis', body,
    '<button class="btn btn-teal" onclick="window.downloadQuizReport(\''+title.replace(/'/g,"\\'")+'\','+score+','+total+','+correct+','+wrong+','+skip+');closeModal(\'modal-detail\')">⬇️ Download Report</button>'
    + '<button class="btn btn-purple" onclick="toast(\'Shared with mentor!\',\'📤\')">📤 Share</button>');
}

// ── Leaderboard Student Profile ──
function openStudentProfile(name, rank, score) {
  var body = '<div style="text-align:center;margin-bottom:20px">'
    + '<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#6c47ff,#a855f7);display:inline-flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;color:#fff;margin-bottom:10px">' + name.charAt(0) + '</div>'
    + '<div style="font-family:Syne,sans-serif;font-size:18px;font-weight:800">' + name + '</div>'
    + '<div style="display:flex;gap:8px;justify-content:center;margin-top:8px"><span class="badge badge-yellow">Rank #' + rank + '</span><span class="badge badge-green">' + score + '% Score</span></div></div>'
    + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">'
    + [{l:'Tests',v:'32',i:'📝'},{l:'Attendance',v:'92%',i:'✅'},{l:'Streak',v:'5 days',i:'🔥'}].map(function(s){
      return '<div style="text-align:center;padding:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:12px"><div style="font-size:18px;margin-bottom:4px">'+s.i+'</div><div style="font-family:Syne,sans-serif;font-size:18px;font-weight:900;color:var(--text)">'+s.v+'</div><div style="font-size:10px;color:var(--muted);font-weight:700;margin-top:3px">'+s.l+'</div></div>';
    }).join('') + '</div>';
  openDetail('👤 ' + name, body, '');
}

// ── AI Doubt Answer ──
function askAIDoubt() {
  var body = '<div style="text-align:center;padding:30px">'
    + '<div style="font-size:48px;margin-bottom:16px">🤖</div>'
    + '<div style="font-family:Syne,sans-serif;font-size:18px;font-weight:700;margin-bottom:8px">AI Assistant</div>'
    + '<div style="font-size:13px;color:var(--muted);margin-bottom:20px">Ask any academic doubt and get instant AI-powered answers</div>'
    + '<textarea id="ai-doubt-input" class="inp-field" rows="3" placeholder="Type your question here... e.g., Explain Gauss Law in simple terms" style="margin-bottom:14px"></textarea>'
    + '<div id="ai-doubt-answer" style="display:none;text-align:left;background:rgba(0,212,200,.06);border:1px solid rgba(0,212,200,.15);border-radius:12px;padding:16px;margin-top:10px">'
    + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><span style="font-size:20px">🤖</span><span style="font-family:Syne,sans-serif;font-size:13px;font-weight:700;color:var(--faculty)">AI Response</span></div>'
    + '<div style="font-size:13px;line-height:1.7;color:var(--text)">This is a simulated AI response. In a production environment, this would connect to an AI model to generate detailed explanations, step-by-step solutions, and relevant examples for your academic doubt.</div></div></div>';

  openDetail('🤖 Ask AI Doubt', body,
    '<button class="btn btn-solid" onclick="document.getElementById(\'ai-doubt-answer\').style.display=\'block\';toast(\'AI is thinking...\',\'🤖\')">🚀 Get Answer</button>');
}

// ── Submit Student Doubt ──
async function submitDoubt() {
  var qEl = document.getElementById('doubt-question');
  var subEl = document.getElementById('doubt-subject');
  
  if (!qEl) return;
  var question = qEl.value.trim();
  var subject = subEl ? subEl.value : 'General';
  
  if (question.length < 15) {
    toast('Your question must be at least 15 characters long to describe the doubt clearly.', '❌');
    return;
  }
  
  try {
    await api('/api/doubts', {
      method: 'POST',
      body: JSON.stringify({ q: question, sub: subject })
    });
    toast('Doubt submitted successfully!', '✅');
    qEl.value = '';
    var previewBox = document.getElementById('doubt-live-preview');
    if (previewBox) previewBox.style.display = 'none';
    
    // sync data and reload
    await syncLMSData();
    loadPage('doubts');
  } catch (err) {
    toast('Failed to submit doubt: ' + err.message, '❌');
  }
}

// ── Doubt discussion thread detail ──
function openEnhancedDoubtDetail(question, status, subject) {
  window.activeDoubtQuestion = question;
  window.activeDoubtSubject = subject;
  
  var doubt = (window.LMS_DOUBTS || []).find(function(d) { return d.q === question; });
  var isResolved = status === 'resolved' || (doubt && doubt.s === 'resolved');
  
  var statusBadge = isResolved 
    ? '<span class="badge badge-green">Resolved</span>' 
    : '<span class="badge badge-yellow">Pending Teacher Response</span>';
  
  var chatHtml = '<div style="display:flex;flex-direction:column;gap:12px;margin-bottom:18px;max-height:300px;overflow-y:auto;padding-right:4px">';
  
  if (doubt && doubt.replies && doubt.replies.length > 0) {
    chatHtml += doubt.replies.map(function(reply) {
      var isMe = reply.sender === G.user.name;
      var senderInitial = reply.sender ? reply.sender.charAt(0) : 'U';
      var bg = isMe ? 'linear-gradient(135deg,#6c47ff,#a855f7)' : 'linear-gradient(135deg,#00d4c8,#00c6ff)';
      return '<div style="display:flex;gap:10px;align-items:flex-start;background:rgba(255,255,255,0.02);padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.06);' + (isMe ? '' : 'margin-left:20px') + '">'
        + '<div style="width:28px;height:28px;border-radius:50%;background:' + bg + ';display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0">' + senderInitial + '</div>'
        + '<div style="flex:1">'
        + '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">' + reply.sender + ' · ' + (reply.time || 'just now') + '</div>'
        + '<div style="font-size:13px;color:var(--text);line-height:1.5">' + reply.text + '</div>'
        + '</div></div>';
    }).join('');
  } else {
    chatHtml += '<div style="display:flex;gap:10px;align-items:flex-start;background:rgba(255,255,255,0.02);padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.06)">'
      + '<div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#6c47ff,#a855f7);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0">U</div>'
      + '<div style="flex:1">'
      + '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Asked by you · ' + subject + '</div>'
      + '<div style="font-size:13px;color:var(--text);line-height:1.5">' + question + '</div>'
      + '</div></div>';
  }
  
  chatHtml += '</div>';

  var replyInput = '<div style="display:flex;gap:8px;border-top:1px solid rgba(255,255,255,0.06);padding-top:14px">'
    + '<input id="doubt-reply-input" class="inp-field" placeholder="Add to discussion thread..." style="flex:1;font-size:12px">'
    + '<button class="btn btn-solid btn-sm" onclick="window.sendDoubtReply()">Reply</button>'
    + '</div>';

  var body = '<div style="margin-bottom:14px;display:flex;align-items:center;justify-content:space-between">'
    + '<span>' + statusBadge + '</span>'
    + '<span style="font-size:12px;color:var(--muted)">Subject: ' + subject + '</span></div>'
    + chatHtml
    + replyInput;

  openDetail('💬 Doubt Discussion Thread', body, '');
}

window.sendDoubtReply = async function() {
  var input = document.getElementById('doubt-reply-input');
  if (!input || !input.value.trim()) return;
  var replyText = input.value.trim();
  
  var question = window.activeDoubtQuestion;
  var subject = window.activeDoubtSubject;
  var doubt = (window.LMS_DOUBTS || []).find(function(d) { return d.q === question; });
  if (!doubt) {
    toast('Doubt not found', '❌');
    return;
  }
  
  try {
    const updatedDoubt = await api('/api/doubts/' + doubt._id + '/reply', {
      method: 'POST',
      body: JSON.stringify({ text: replyText })
    });
    toast('Reply posted!', '✅');
    input.value = '';
    
    // re-sync data and reload detail modal
    await syncLMSData();
    closeModal('modal-detail');
    openEnhancedDoubtDetail(question, updatedDoubt.s, subject);
    
    // Also reload doubts page if we are on it
    if (G.page === 'doubts') {
      loadPage('doubts');
    }
  } catch (err) {
    toast('Failed to post reply: ' + err.message, '❌');
  }
};

// ── Open Completed Test Solutions ──
function openTestSolution(testName) {
  var body = '<div style="margin-bottom:14px">'
    + '<div style="font-size:13px;color:var(--muted);margin-bottom:12px">Here is the detailed solution key for <strong>' + testName + '</strong>.</div>'
    + '<div style="display:flex;flex-direction:column;gap:12px;max-height:350px;overflow-y:auto;padding-right:4px">'
    + [
      { q: 'Q1. A body of mass 5 kg is acted upon by two perpendicular forces 8N and 6N. The magnitude of acceleration is:', a: 'A. 2.0 m/s²', exp: 'Explanation: The net force acting on the body is F = sqrt(F1^2 + F2^2) = sqrt(8^2 + 6^2) = 10 N. The acceleration is a = F / m = 10 / 5 = 2.0 m/s².' },
      { q: 'Q2. The SI unit of electric flux is:', a: 'A. N·m²/C', exp: 'Explanation: Electric flux is defined as Phi = E * A. Unit of E is N/C and unit of A is m². Therefore, unit of flux is N·m²/C.' },
      { q: 'Q3. The value of ∫₀^π sin²x dx is:', a: 'A. π/2', exp: 'Explanation: Using the identity sin²x = (1 - cos(2x)) / 2, the integral is ∫₀^π (1/2 - cos(2x)/2) dx = [x/2 - sin(2x)/4]₀^π = π/2.' }
    ].map(function(s, idx) {
      return '<div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:12px">'
        + '<div style="font-size:13px;font-weight:700;margin-bottom:6px;color:var(--text)">' + s.q + '</div>'
        + '<div style="font-size:12px;color:#4ade80;font-weight:700;margin-bottom:4px">Correct Answer: ' + s.a + '</div>'
        + '<div style="font-size:12px;color:var(--muted);line-height:1.5;background:rgba(255,255,255,0.02);padding:8px;border-radius:6px">' + s.exp + '</div>'
        + '</div>';
    }).join('')
    + '</div></div>';

  openDetail('📝 Answer Key & Solutions', body,
    '<button class="btn btn-teal" onclick="downloadMaterial(\''+testName.replace(/'/g,"\\'")+' Detailed Solutions\');closeModal(\'modal-detail\')">⬇️ Download PDF Solutions</button>'
    + '<button class="btn btn-purple" onclick="closeModal(\'modal-detail\')">Close</button>');
}



window.enrollInCourse = async function(courseId, courseTitle) {
  if (courseTitle && !confirm('Are you sure you want to unlock & enroll in ' + courseTitle + '?')) {
    return;
  }
  try {
    await api('/api/courses/' + courseId + '/enroll', {
      method: 'POST'
    });
    toast('Enrolled in course successfully!', '✅');
    await syncLMSData();
    loadPage('courses');
  } catch (err) {
    toast('Enrollment failed: ' + err.message, '❌');
  }
};


// ════════════════════════════════════════════════════
// EXPORT ES MODULE FUNCTIONS TO WINDOW FOR INLINE ONCLICK
// ════════════════════════════════════════════════════
window.loadPage = loadPage;
window.doLogin = doLogin;
window.doLogout = doLogout;
window.goBack = goBack;
window.openCourseDetail = openCourseDetail;
window.startMockQuiz = startMockQuiz;
window.submitDoubt = submitDoubt;
window.openLiveClassModal = openLiveClassModal;
window.openVideoWithNotes = openVideoWithNotes;
window.openMaterialPreview = openMaterialPreview;
window.openFeedbackForm = openFeedbackForm;
window.rateStar = rateStar;
window.openLeaveRequest = openLeaveRequest;
window.openEnhancedDoubtDetail = openEnhancedDoubtDetail;
window.openStudentProfile = openStudentProfile;
window.openQuizAnalytics = openQuizAnalytics;
window.togglePw = togglePw;
window.submitFacultyUpload = submitFacultyUpload;
window.openModal = openModal;
window.closeModal = closeModal;
window.openResolveDoubt = openResolveDoubt;
window.openEnrollmentApproval = openEnrollmentApproval;
window.openPaymentDetail = openPaymentDetail;
window.exportPayments = exportPayments;
window.openAnnouncementDetail = openAnnouncementDetail;
window.openEditProfile = openEditProfile;
window.openFeeReceipt = openFeeReceipt;
window.viewLectureNotes = function(title) {
  var notesContent = '';
  if (title.indexOf('Gauss') !== -1 || title.indexOf('Electrostatics') !== -1) {
    notesContent = '<h3>⚡ Electrostatics — Gauss Law Notes</h3>'
      + '<p style="margin-top:8px;font-size:13px;color:var(--text)">Gauss\'s Law states that the net electric flux through any closed surface is equal to the net charge enclosed divided by the permittivity of free space.</p>'
      + '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:12px;margin-top:10px;font-family:monospace;color:#00d4c8">'
      + 'Φ_E = ∮ E · dA = Q_enclosed / ε_0'
      + '</div>'
      + '<h4 style="margin-top:12px;font-size:12px;color:var(--yellow)">Key Concepts:</h4>'
      + '<ul style="margin-left:20px;font-size:12px;color:var(--muted);line-height:1.6">'
      + '<li>Flux is independent of the shape or size of the closed surface.</li>'
      + '<li>Used to find electric fields easily for symmetric charge distributions (spherical, cylindrical, planar).</li>'
      + '<li>Permittivity constant ε_0 = 8.854 × 10⁻¹² F/m.</li>'
      + '</ul>';
  } else if (title.indexOf('Capacitors') !== -1) {
    notesContent = '<h3>💡 Capacitors — Energy & Combinations</h3>'
      + '<p style="margin-top:8px;font-size:13px;color:var(--text)">A capacitor is a device used to store electrical energy in an electric field. The ratio of charge to potential difference is capacitance.</p>'
      + '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:12px;margin-top:10px;font-family:monospace;color:#00d4c8">'
      + 'Series: 1/C_eq = 1/C_1 + 1/C_2 + ...<br>Parallel: C_eq = C_1 + C_2 + ...<br>Stored Energy: U = 1/2 C V² = 1/2 Q V'
      + '</div>';
  } else if (title.indexOf('Organic') !== -1 || title.indexOf('IUPAC') !== -1) {
    notesContent = '<h3>🧪 Organic Chemistry — IUPAC Naming</h3>'
      + '<p style="margin-top:8px;font-size:13px;color:var(--text)">Rules for naming organic chemical compounds based on IUPAC guidelines.</p>'
      + '<ul style="margin-left:20px;font-size:12px;color:var(--muted);line-height:1.6;margin-top:8px">'
      + '<li>Identify the longest continuous carbon chain (Parent Chain).</li>'
      + '<li>Identify principal functional groups (Suffix) and substituents (Prefix).</li>'
      + '<li>Number the carbon atoms starting from the end closer to functional group of higher priority.</li>'
      + '</ul>';
  } else {
    // General study notes
    notesContent = '<h3>📚 Lecture Summary Notes</h3>'
      + '<p style="margin-top:8px;font-size:13px;color:var(--text)">Revision material, sample formulas, and textbook reference points for <strong>' + title + '</strong>.</p>'
      + '<ul style="margin-left:20px;font-size:12px;color:var(--muted);line-height:1.6;margin-top:8px">'
      + '<li>Standard conceptual breakdowns of chapter sections.</li>'
      + '<li>Important board and competitive exam practice points.</li>'
      + '<li>Refer to reference handbook for advanced derivations.</li>'
      + '</ul>';
  }

  var body = '<div style="margin-bottom:12px;font-size:12px;color:var(--muted)">Class study notes for <strong>' + title + '</strong>.</div>'
    + '<div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;margin-bottom:14px">'
    + notesContent
    + '</div>';

  var footer = '<button class="btn btn-teal" onclick="toast(\'PDF Lecture Notes downloaded!\',\'⬇️\');closeModal(\'modal-detail\')">⬇️ Download PDF</button>'
    + '<button class="btn btn-solid" onclick="closeModal(\'modal-detail\')">Close</button>';

  openDetail('📝 Lecture Notes Summary', body, footer, 'md');
};

window.openAIVideoAssistant = function(title) {
  var body = '<div style="text-align:center;padding:10px">'
    + '<div style="font-size:44px;margin-bottom:10px">🤖</div>'
    + '<div style="font-family:Syne,sans-serif;font-size:16px;font-weight:800;margin-bottom:4px">AI Chapter Assistant</div>'
    + '<div style="font-size:12px;color:var(--muted);margin-bottom:16px">Get instant help for <strong>' + title + '</strong></div>'
    + '<div style="display:grid;grid-template-columns:1fr;gap:10px">'
    + '<button class="btn btn-teal" style="justify-content:center" onclick="window.startAIVideoQuiz(\''+title.replace(/'/g,"\\'")+'\')">📝 Start 3-Question Practice Quiz</button>'
    + '<button class="btn btn-purple" style="justify-content:center" onclick="window.openAIDoubtChat(\''+title.replace(/'/g,"\\'")+'\')">💬 Ask Doubts to AI Copilot</button>'
    + '</div></div>';

  openDetail('🤖 AI Copilot — ' + title, body, '<button class="btn btn-solid" onclick="closeModal(\'modal-detail\')">Close</button>', 'sm');
};

window.startAIVideoQuiz = function(title) {
  closeModal('modal-detail');
  toast('Loading AI generated quiz for ' + title, '🤖');
  setTimeout(function() {
    window.startMockQuiz();
  }, 400);
};

window.openAIDoubtChat = function(title) {
  closeModal('modal-detail');
  setTimeout(function() {
    var body = '<div style="display:flex;flex-direction:column;height:350px">'
      + '<div id="ai-video-chat-msgs" style="flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;font-size:12px">'
      + '<div style="background:rgba(0,212,200,.06);border:1px solid rgba(0,212,200,.15);border-radius:10px;padding:10px;color:var(--text)">'
      + '🤖 <strong>AI Tutor:</strong> Hi Arjun! I\'m ready to help you with <strong>' + title + '</strong>. Ask me anything about the derivations, formula, or concepts.</div>'
      + '</div>'
      + '<div style="padding:8px 0;display:flex;gap:6px">'
      + '<input id="ai-video-chat-input" class="inp-field" placeholder="Ask a doubt..." style="flex:1;padding:8px 10px;font-size:12px" onkeydown="if(event.key===\'Enter\'){window.sendAIVideoDoubt(\''+title.replace(/'/g,"\\'")+'\')}">'
      + '<button class="btn btn-sm btn-solid" onclick="window.sendAIVideoDoubt(\''+title.replace(/'/g,"\\'")+'\')">Ask</button></div></div>';

    openDetail('🤖 AI Doubt Solver', body, '<button class="btn btn-solid" onclick="closeModal(\'modal-detail\')">Close</button>', 'sm');
  }, 300);
};

window.sendAIVideoDoubt = function(title) {
  var input = document.getElementById('ai-video-chat-input');
  if (!input || !input.value.trim()) return;

  var container = document.getElementById('ai-video-chat-msgs');
  if (!container) return;

  var userText = input.value.trim();
  input.value = '';

  // Append user message
  container.innerHTML += '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:10px;margin-top:6px">'
    + '👤 <strong>You:</strong> ' + userText + '</div>';

  // Auto scroll
  container.scrollTop = container.scrollHeight;

  // Append AI thinking
  var thinkingId = 'ai-thinking-' + Date.now();
  container.innerHTML += '<div id="' + thinkingId + '" style="background:rgba(0,212,200,.03);border:1px solid rgba(0,212,200,.08);border-radius:10px;padding:10px;margin-top:6px;color:var(--muted)">'
    + '🤖 <em>AI Tutor is thinking...</em></div>';
  container.scrollTop = container.scrollHeight;

  // Answer after a delay
  setTimeout(function() {
    var thinkingEl = document.getElementById(thinkingId);
    if (!thinkingEl) return;

    var explanation = '';
    if (userText.toLowerCase().indexOf('gauss') !== -1 || userText.toLowerCase().indexOf('flux') !== -1) {
      explanation = 'Flux through a closed surface depends only on the charge enclosed: Φ = Q_enclosed / ε_0. It does not depend on the position of charge inside or the shape of the surface!';
    } else {
      explanation = 'Great question! In ' + title + ', this concept is critical. Remember to review the parent formulas, watch the derivation steps, and try the worked examples in slide notes.';
    }

    thinkingEl.innerHTML = '🤖 <strong>AI Tutor:</strong> ' + explanation;
    thinkingEl.style.color = 'var(--text)';
    thinkingEl.style.background = 'rgba(0,212,200,.06)';
    thinkingEl.style.borderColor = 'rgba(0,212,200,.15)';
    container.scrollTop = container.scrollHeight;
  }, 1000);
};

window.openCourseUnlockModal = function(courseId, courseTitle, fee, duration, fac, emoji) {
  var formattedFee = fee ? fee.toLocaleString('en-IN') : '28,000';
  var body = '<div style="background:linear-gradient(135deg,rgba(108,71,255,0.06),rgba(0,198,255,0.06));border:1px solid rgba(108,71,255,0.2);border-radius:12px;padding:16px;margin-bottom:14px">'
    + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">'
    + '<div style="font-size:36px">'+(emoji || '📚')+'</div>'
    + '<div><div style="font-family:Syne,sans-serif;font-size:16px;font-weight:800">'+courseTitle+'</div>'
    + '<div style="font-size:12px;color:var(--muted)">'+(duration || '1 Year')+' Program · Mentor: '+(fac || 'Dr. Priya Mehta')+'</div></div></div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">'
    + '<div style="background:var(--surface2);border-radius:8px;padding:10px"><div style="font-size:11px;color:var(--muted)">Tuition Fee</div><div style="font-size:15px;font-weight:700;color:var(--text);margin-top:2px">₹' + formattedFee + '</div></div>'
    + '<div style="background:var(--surface2);border-radius:8px;padding:10px"><div style="font-size:11px;color:var(--muted)">Access Plan</div><div style="font-size:15px;font-weight:700;color:var(--student);margin-top:2px">Lifetime Unlock</div></div></div>'
    + '<div style="font-family:Syne,sans-serif;font-size:13px;font-weight:700;margin-bottom:8px">💳 Select Payment Method</div>'
    + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px">'
    + ['UPI / GPay', 'Credit Card', 'Net Banking'].map(function(m, i) {
        var activeStyle = i === 0 ? 'border-color:var(--student);background:rgba(74,222,128,.06)' : '';
        return '<button class="btn btn-purple btn-sm" style="justify-content:center;font-size:11px;padding:8px;'+activeStyle+'" onclick="window.selectUnlockMethod(this)">' + m + '</button>';
      }).join('')
    + '</div></div>';

  var footer = '<button class="btn btn-solid" style="background:var(--student);color:#0a0c1c" onclick="window.confirmUnlockCourse(\''+courseId+'\',\''+courseTitle.replace(/'/g,"\\'")+'\')">Confirm & Pay ₹' + formattedFee + '</button>'
    + '<button class="btn btn-purple" onclick="closeModal(\'modal-detail\')">Cancel</button>';

  openDetail('👑 Unlock Course', body, footer, 'sm');
};

window.selectUnlockMethod = function(btn) {
  btn.parentNode.querySelectorAll('button').forEach(function(b) {
    b.style.borderColor = 'rgba(255,255,255,.08)';
    b.style.background = 'rgba(255,255,255,.03)';
  });
  btn.style.borderColor = 'var(--student)';
  btn.style.background = 'rgba(74,222,128,.06)';
};

window.confirmUnlockCourse = async function(courseId, courseTitle) {
  closeModal('modal-detail');
  toast('Processing payment...', '💳');
  setTimeout(async function() {
    try {
      await api('/api/courses/' + courseId + '/enroll', {
        method: 'POST'
      });
      toast('Unlocked and enrolled in ' + courseTitle + '!', '✅');
      if (window.LMS_COURSES) {
        var local = window.LMS_COURSES.find(function(c) { return c._id === courseId; });
        if (local) local.enrolled = true;
      }
      await syncLMSData();
      loadPage('courses');
    } catch (err) {
      toast('Enrollment failed: ' + err.message, '❌');
    }
  }, 1000);
};

window.openLiveClassChatModal = function() {
  window.mockChatMessages = window.mockChatMessages || [
    {n:'Sneha P.',m:'Great explanation sir!',t:'2m ago',c:'#6c47ff'},
    {n:'Rohan G.',m:'Can you repeat the formula?',t:'1m ago',c:'#ff6b35'},
    {n:'Ananya S.',m:'Thank you! Very clear 👏',t:'30s ago',c:'#4ade80'},
    {n:'Dr. Priya',m:'Check slide 14 for the derivation',t:'15s ago',c:'#00d4c8'}
  ];

  window.renderLiveChatMessages = function() {
    var container = document.getElementById('live-chat-messages-modal');
    if (!container) return;
    container.innerHTML = window.mockChatMessages.map(function(msg){
      return '<div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:10px">'
        + '<div style="width:24px;height:24px;border-radius:50%;background:'+msg.c+';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0">'+msg.n[0]+'</div>'
        + '<div><div style="font-size:11px"><span style="font-weight:700;color:'+msg.c+'">'+msg.n+'</span> <span style="color:var(--muted);font-size:10px">'+msg.t+'</span></div>'
        + '<div style="font-size:12px;color:var(--text);margin-top:2px">'+msg.m+'</div></div></div>';
    }).join('');
    container.scrollTop = container.scrollHeight;
  };

  window.sendLiveChatFromModal = function() {
    var input = document.getElementById('live-chat-input-modal');
    if (!input || !input.value.trim()) return;
    
    window.mockChatMessages.push({
      n: 'Arjun S. (You)',
      m: input.value.trim(),
      t: 'Just now',
      c: 'var(--student)'
    });
    
    input.value = '';
    window.renderLiveChatMessages();
  };

  var body = '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;display:flex;flex-direction:column;height:350px">'
    + '<div id="live-chat-messages-modal" style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;height:280px"></div>'
    + '<div style="padding:8px 10px;border-top:1px solid rgba(255,255,255,.06);display:flex;gap:6px">'
    + '<input id="live-chat-input-modal" class="inp-field" placeholder="Type a message..." style="flex:1;padding:8px 10px;font-size:12px" onkeydown="if(event.key===\'Enter\'){window.sendLiveChatFromModal()}">'
    + '<button class="btn btn-sm btn-solid" onclick="window.sendLiveChatFromModal()">Send</button></div></div>';

  openDetail('💬 Live Class Chat — Gauss Law', body, '<button class="btn btn-solid" onclick="closeModal(\'modal-detail\')">Close</button>', 'sm');
  
  setTimeout(function() {
    window.renderLiveChatMessages();
  }, 50);
};

window.viewTestSyllabus = function(title) {
  var syllabusDetails = '';
  if (title.indexOf('Thermodynamics') !== -1) {
    syllabusDetails = '<h3>📚 Physics — Thermodynamics</h3>'
      + '<ul style="margin-left:20px;line-height:1.6;font-size:13px;color:var(--text);margin-top:10px">'
      + '<li>Thermal Equilibrium & Temperature</li>'
      + '<li>First Law of Thermodynamics & Internal Energy</li>'
      + '<li>Thermodynamic Processes (Isothermal, Adiabatic, Isobaric)</li>'
      + '<li>Second Law of Thermodynamics: Heat Engines & Refrigerators</li>'
      + '<li>Reversible & Irreversible Processes, Carnot Engine</li>'
      + '</ul>';
  } else if (title.indexOf('Cell Division') !== -1) {
    syllabusDetails = '<h3>📚 Biology — Cell Cycle & Cell Division</h3>'
      + '<ul style="margin-left:20px;line-height:1.6;font-size:13px;color:var(--text);margin-top:10px">'
      + '<li>Cell Cycle Phases (G1, S, G2, M Phases)</li>'
      + '<li>Mitosis: Stages, Significance, and Regulation</li>'
      + '<li>Meiosis: Meiosis I and Meiosis II</li>'
      + '<li>Comparison between Mitosis and Meiosis</li>'
      + '</ul>';
  } else {
    // Default to Full Syllabus
    syllabusDetails = '<h3>📚 Full Syllabus JEE (Main & Advanced)</h3>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px;font-size:12px;color:var(--text)">'
      + '<div><strong>Physics:</strong> Mechanics, Waves, Electromagnetism, Optics, Thermodynamics, Modern Physics.</div>'
      + '<div><strong>Chemistry:</strong> Organic Synthesis, Chemical Bonding, Thermodynamics, Coordination Compounds, Kinetics.</div>'
      + '<div><strong>Mathematics:</strong> Calculus, Vectors & 3D, Matrices & Determinants, Coordinate Geometry, Probability.</div>'
      + '</div>';
  }

  var body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">Syllabus coverage details for <strong>' + title + '</strong>.</div>'
    + '<div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;margin-bottom:14px">'
    + syllabusDetails
    + '</div>';

  var footer = '<button class="btn btn-teal" onclick="toast(\'Syllabus PDF downloaded!\',\'⬇️\');closeModal(\'modal-detail\')">⬇️ Download PDF</button>'
    + '<button class="btn btn-solid" onclick="closeModal(\'modal-detail\')">Close</button>';

  openDetail('📋 Test Syllabus — Details', body, footer, 'md');
};

window.viewTestMetricDetail = function(key) {
  var title = '';
  var body = '';
  var downloadFn = '';

  if (key === 'tests_taken') {
    title = '📝 Tests Taken Details';
    body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">Your complete checklist of tests attempted.</div>'
      + '<div class="tbl-wrap"><table><thead><tr><th>Test Title</th><th>Date</th><th>Score</th><th>Percentile</th><th>Rank</th></tr></thead><tbody>'
      + [
        ['Mock Test 13 — Physics + Chem', 'Mar 10', '267/300', '89%', '#3'],
        ['Weekly Test — Organic Chem', 'Mar 7', '72/100', '72%', '#12'],
        ['Mock Test 12 — Full Syllabus', 'Mar 3', '298/360', '83%', '#5']
      ].map(function(r) {
        return '<tr><td style="font-weight:600">'+r[0]+'</td><td>'+r[1]+'</td><td style="color:var(--student);font-weight:700">'+r[2]+'</td><td>'+r[3]+'</td><td>'+r[4]+'</td></tr>';
      }).join('')
      + '</tbody></table></div>';
    downloadFn = 'window.downloadTestMetricCSV(\'tests_taken\')';
  } else if (key === 'avg_score') {
    title = '📊 Subject Performance Details';
    body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">Subject-wise score metrics and average weightages.</div>'
      + '<div class="tbl-wrap"><table><thead><tr><th>Subject</th><th>Average Score</th><th>Weightage</th><th>Syllabus Progress</th></tr></thead><tbody>'
      + [
        ['Physics', '74%', '33%', '80%'],
        ['Chemistry', '82%', '33%', '85%'],
        ['Maths', '68%', '34%', '75%']
      ].map(function(r) {
        return '<tr><td style="font-weight:600">'+r[0]+'</td><td style="color:var(--student);font-weight:700">'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td></tr>';
      }).join('')
      + '</tbody></table></div>';
    downloadFn = 'window.downloadTestMetricCSV(\'avg_score\')';
  } else if (key === 'best_rank') {
    title = '🏆 Best Rank & Leaderboard';
    body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">Current top ranks inside your batch series.</div>'
      + '<div class="tbl-wrap"><table><thead><tr><th>Rank</th><th>Student Name</th><th>Total Score</th><th>Accuracy</th></tr></thead><tbody>'
      + [
        ['#1', 'Sneha Patel', '290/300', '96%'],
        ['#2', 'Rohan Gupta', '282/300', '94%'],
        ['#3', 'Ananya Singh', '274/300', '91%'],
        ['#4', 'Arjun Sharma (You)', '267/300', '89%']
      ].map(function(r) {
        var isMe = r[1].indexOf('You') !== -1;
        var style = isMe ? ' style="background:rgba(108,71,255,0.08);font-weight:700"' : '';
        return '<tr' + style + '><td>' + r[0] + '</td><td>' + r[1] + '</td><td style="color:var(--student)">' + r[2] + '</td><td>' + r[3] + '</td></tr>';
      }).join('')
      + '</tbody></table></div>';
    downloadFn = 'window.downloadTestMetricCSV(\'best_rank\')';
  } else if (key === 'accuracy') {
    title = '🎯 Accuracy & Question Analysis';
    body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">Granular breakdown of attempted questions.</div>'
      + '<div class="tbl-wrap"><table><thead><tr><th>Category</th><th>Count</th><th>Percentage</th></tr></thead><tbody>'
      + [
        ['Correct Answers', '181 Questions', '89%'],
        ['Incorrect Answers', '22 Questions', '11%'],
        ['Unattempted/Skipped', '8 Questions', '—']
      ].map(function(r) {
        return '<tr><td style="font-weight:600">'+r[0]+'</td><td style="font-weight:700">'+r[1]+'</td><td>'+r[2]+'</td></tr>';
      }).join('')
      + '</tbody></table></div>';
    downloadFn = 'window.downloadTestMetricCSV(\'accuracy\')';
  }

  var footer = '<button class="btn btn-teal" onclick="' + downloadFn + '">⬇ Download CSV</button>'
    + '<button class="btn btn-solid" onclick="closeModal(\'modal-detail\')">Close</button>';

  openDetail(title, body, footer, 'sm');
};

window.downloadTestMetricCSV = function(key) {
  var rows = [];
  var filename = '';

  if (key === 'tests_taken') {
    filename = 'tests_taken_report.csv';
    rows = [
      ['Test Title', 'Date', 'Score', 'Percentile', 'Rank'],
      ['Mock Test 13 — Physics + Chem', 'Mar 10', '267/300', '89%', '#3'],
      ['Weekly Test — Organic Chem', 'Mar 7', '72/100', '72%', '#12'],
      ['Mock Test 12 — Full Syllabus', 'Mar 3', '298/360', '83%', '#5']
    ];
  } else if (key === 'avg_score') {
    filename = 'subject_performance_report.csv';
    rows = [
      ['Subject', 'Average Score', 'Weightage', 'Syllabus Progress'],
      ['Physics', '74%', '33%', '80%'],
      ['Chemistry', '82%', '33%', '85%'],
      ['Maths', '68%', '33%', '75%']
    ];
  } else if (key === 'best_rank') {
    filename = 'leaderboard_best_rank.csv';
    rows = [
      ['Rank', 'Student Name', 'Total Score', 'Accuracy'],
      ['#1', 'Sneha Patel', '290/300', '96%'],
      ['#2', 'Rohan Gupta', '282/300', '94%'],
      ['#3', 'Ananya Singh', '274/300', '91%'],
      ['#4', 'Arjun Sharma (You)', '267/300', '89%']
    ];
  } else if (key === 'accuracy') {
    filename = 'question_accuracy_report.csv';
    rows = [
      ['Category', 'Count', 'Percentage'],
      ['Correct Answers', '181 Questions', '89%'],
      ['Incorrect Answers', '22 Questions', '11%'],
      ['Unattempted/Skipped', '8 Questions', '—']
    ];
  }

  var csv = rows.map(function(r) { return r.map(function(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Report downloaded successfully!', '⬇');
};

window.openTestSolution = openTestSolution;
window.submitAddStudent = submitAddStudent;
window.submitAddFaculty = submitAddFaculty;
window.submitCreateCourse = submitCreateCourse;
window.initApp = initApp;
window.buildSidebar = buildSidebar;
window.toast = toast;
window.openFacultyClassModal = openFacultyClassModal;
window.openBatchDetail = openBatchDetail;
window.openScheduleClassModal = openScheduleClassModal;
window.openCreateTestModal = openCreateTestModal;
window.openTestResultsModal = openTestResultsModal;
window.openSendFeedback = openSendFeedback;
window.openAddStudentModal = openAddStudentModal;
window.openAddFacultyModal = openAddFacultyModal;
window.saveAdminProfile = saveAdminProfile;
window.changeAdminPassword = changeAdminPassword;
window.saveFacultyProfile = saveFacultyProfile;
window.changeFacultyPassword = changeFacultyPassword;
window.saveStudentProfile = saveStudentProfile;
window.changeStudentPassword = changeStudentPassword;
window.apPwStrength = apPwStrength;
window.apPwMatch = apPwMatch;
window.openVideoPlayer = openVideoPlayer;
window.downloadMaterial = downloadMaterial;
window.exportQuizResults = exportQuizResults;

window.downloadMaterialFile = downloadMaterialFile;
window.exportFacultyReport = exportFacultyReport;
window.exportTestResults = exportTestResults;
window.exportEnrollmentDetails = exportEnrollmentDetails;
window.downloadPurchaseActivityReceipt = downloadPurchaseActivityReceipt;
window.downloadStudentFeeReceipt = downloadStudentFeeReceipt;
window.downloadGenericFeeReceipt = downloadGenericFeeReceipt;

window.saveAnnouncement = saveAnnouncement;
window.editAnnouncementDraft = editAnnouncementDraft;
window.viewFacultyAnalyticsDetail = viewFacultyAnalyticsDetail;
window.downloadFacultyAnalyticsCSV = downloadFacultyAnalyticsCSV;

window.approveContent = approveContent;
window.askAIDoubt = askAIDoubt;
window.confirmReject = confirmReject;
window.downloadFullAttendance = downloadFullAttendance;
window.downloadBatchAttendance = downloadBatchAttendance;
window.exportNotifications = exportNotifications;
window.exportReport = exportReport;
window.exportRevenueCSV = exportRevenueCSV;
window.exportStudentList = exportStudentList;
window.forwardNotif = forwardNotif;
window.itab = itab;
window.markAllRead = markAllRead;
window.openApprovalDetail = openApprovalDetail;
window.openCourseEnrollDetail = openCourseEnrollDetail;
window.openPayModal = openPayModal;
window.openReport = openReport;
window.publishAnnouncement = publishAnnouncement;
window.rejectContent = rejectContent;
window.replyNotif = replyNotif;
window.resolveNotif = resolveNotif;
window.saveGeneralSettings = saveGeneralSettings;
window.sendLiveChat = sendLiveChat;
window.testIntegration = testIntegration;
window.toggleIntegration = toggleIntegration;
window.toggleSetting = toggleSetting;
window.viewQuestionPaper = viewQuestionPaper;
window.toggleFieldPw = toggleFieldPw;

window.submitDoubtResolution = async function(doubtId) {
  var textarea = document.getElementById('doubt-resolve-textarea');
  if (!textarea || !textarea.value.trim()) {
    toast('Please enter your answer', '⚠️');
    return;
  }
  var answerText = textarea.value.trim();
  try {
    await api('/api/doubts/' + doubtId + '/reply', {
      method: 'POST',
      body: JSON.stringify({ text: answerText })
    });
    toast('Answer posted successfully!', '✅');
    await syncLMSData();
    closeModal('modal-detail');
    loadPage('doubts');
  } catch (err) {
    toast('Failed to post answer: ' + err.message, '❌');
  }
};

// ═══════════════════════════════════════════════════════
// EDCHEMY PARENT PORTAL & ORIENTATION PAGES
// ═══════════════════════════════════════════════════════
window.currentChildIdx = window.currentChildIdx || 0;
window.parentChildren = [
  { name: 'Arjun Sharma', roll: 'RV2024001', batch: 'JEE Advanced (Main + KCET Decoded)', campus: 'RV Jayanagar', att: 94, rank: '#3', avg: '88%', feeStatus: 'Paid' },
  { name: 'Sneha Patel', roll: 'RV2024002', batch: 'JEE Advanced (Main + KCET Decoded)', campus: 'RV Rajajinagar', att: 96, rank: '#1', avg: '92%', feeStatus: 'Paid' }
];

window.switchChildProfile = function(idx) {
  window.currentChildIdx = idx;
  toast('Switched profile to ' + window.parentChildren[idx].name, '👨‍👩‍👧‍👦');
  loadPage('dashboard');
};
}
