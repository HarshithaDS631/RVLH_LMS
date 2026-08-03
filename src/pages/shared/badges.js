// Module: PAGES['shared_badges']
export function registerPage(PAGES) {
  PAGES['shared_badges'] = function() {
  var badges = [
    { title: '7-Day Streak Master', icon: '🔥', category: 'Streak', desc: 'Maintained a 7-day active study streak.', unlocked: true, date: 'Mar 10, 2026', pct: 100 },
    { title: 'Speed Quizzer', icon: '⚡', category: 'Quiz', desc: 'Scored 85%+ in Physics Electrostatics DPP.', unlocked: true, date: 'Mar 12, 2026', pct: 100 },
    { title: 'Top 5 Ranker', icon: '🏆', category: 'Academic', desc: 'Ranked 3rd in JEE Advanced Batch A.', unlocked: true, date: 'Mar 15, 2026', pct: 100 },
    { title: 'Distinction Scholar', icon: '📜', category: 'Academic', desc: 'Scored A+ Grade in Mid-Term Examinations.', unlocked: true, date: 'Mar 15, 2026', pct: 100 },
    { title: 'Doubt Explorer', icon: '💬', category: 'Community', desc: 'Submitted & resolved 5 academic doubts.', unlocked: true, date: 'Mar 14, 2026', pct: 100 },
    { title: 'Library Scholar', icon: '📚', category: 'Academic', desc: 'Download 10+ Question Papers & DPP Guides.', unlocked: false, date: '', pct: 70 },
    { title: 'Mock Exam Titan', icon: '🚀', category: 'Academic', desc: 'Clear all 5 JEE Advanced Full Mock Exams.', unlocked: false, date: '', pct: 20 }
  ];

  var grid = '<div class="badge-grid-container">'
    + badges.map(function(b) {
        var cardClass = b.unlocked ? 'badge-tile-unlocked' : 'badge-tile-locked';
        var clickFn = b.unlocked ? 'window.openBadgeCertificateModal(\'' + b.title.replace(/'/g,"\\'") + '\',\'' + b.icon + '\')' : 'toast(\'Badge locked! Complete ' + b.desc + ' to unlock.\',\'🔒\')';
        return '<div class="badge-tile ' + cardClass + '" onclick="' + clickFn + '" style="cursor:pointer">'
          + '<span class="badge-icon-lg">' + b.icon + '</span>'
          + '<div style="font-size:15px;font-weight:800;color:var(--text);margin-bottom:4px">' + b.title + '</div>'
          + '<div style="font-size:12px;color:var(--muted);margin-bottom:10px">' + b.desc + '</div>'
          + (b.unlocked 
              ? '<span class="badge badge-yellow">✓ Unlocked (' + b.date + ')</span>' 
              : '<div class="prog-bar" style="height:6px"><div class="prog-fill" style="width:' + b.pct + '%;background:#fbbf24"></div></div><div style="font-size:10px;color:var(--muted);margin-top:4px">' + b.pct + '% Progress</div>')
          + '</div>';
      }).join('')
    + '</div>';

  var header = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">'
    + '<div>'
    + '<div style="font-size:20px;font-weight:800;color:var(--text)">🏅 Gamified Badges & Trophy Cabinet</div>'
    + '<div style="font-size:13px;color:var(--muted)">Earn badges for study streaks, quiz performance, and academic distinctions</div>'
    + '</div>'
    + '<span class="badge badge-yellow" style="font-size:13px;padding:8px 16px">5 of 7 Badges Unlocked</span>'
    + '</div>';

  return header + grid;
};

window.openBadgeCertificateModal = function(badgeTitle, icon) {
  var student = G.user || { name: 'Arjun Sharma' };
  var body = '<div style="text-align:center;padding:20px;background:rgba(251,191,36,0.05);border:2px solid rgba(251,191,36,0.3);border-radius:18px">'
    + '<div style="font-size:54px;margin-bottom:10px">' + icon + '</div>'
    + '<div style="font-size:12px;color:#fbbf24;text-transform:uppercase;font-weight:800;letter-spacing:2px">Certificate of Achievement</div>'
    + '<div style="font-size:22px;font-weight:800;color:var(--text);margin-top:6px">' + badgeTitle + '</div>'
    + '<div style="font-size:13px;color:var(--muted);margin-top:8px">This certificate verifies that <b>' + student.name + '</b> has successfully earned this achievement badge at RV Learning Hub.</div>'
    + '<div style="margin-top:16px;font-size:11px;color:var(--muted)">Issued on March 15, 2026 | Verified by RV Learning Hub LMS</div>'
    + '</div>';

  var footer = '<button class="btn btn-solid" style="background:#fbbf24;color:#000;font-weight:800" onclick="toast(\'Badge certificate downloaded!\',\'📄\');closeModal(\'modal-detail\')">📥 Download Badge Certificate</button>';
  openDetail(icon + ' ' + badgeTitle + ' — Achievement Unlocked', body, footer, 'md');
};

// ═══════════════════════════════════════════════════════
// REAL-TIME LIVE STREAM PLAYER & CHAT HANDLERS
// ═══════════════════════════════════════════════════════
window.openLiveStreamPlayer = function(classId) {
  var initialViewers = 142;
  var user = G.user || { name: 'Arjun Sharma', role: 'student' };

  var body = '<div style="display:grid;grid-template-columns:2fr 1fr;gap:16px">'
    // Left: HD Simulated Video Stream
    + '<div>'
    + '<div style="position:relative;aspect-ratio:16/9;background:#050714;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center">'
    + '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/3JIpN8nnPoM?autoplay=1&mute=1" title="Live Class Stream" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border:none"></iframe>'
    + '<div style="position:absolute;top:10px;left:10px"><span class="live-badge-pulse"><div class="live-dot"></div>🔴 LIVE STREAM</span></div>'
    + '<div style="position:absolute;top:10px;right:10px"><span class="live-viewer-count">👥 <strong id="modal-live-viewers">142</strong> Watching</span></div>'
    + '</div>'
    + '<div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center">'
    + '<div>'
    + '<h3 style="font-size:16px;font-weight:800;color:var(--text);margin-bottom:2px">Electrostatics: Gauss Law & Spherical Shells</h3>'
    + '<div style="font-size:12px;color:var(--muted)">Dr. Priya Mehta &nbsp;•&nbsp; Physics &nbsp;•&nbsp; JEE Advanced</div>'
    + '</div>'
    + '<div style="display:flex;gap:8px">'
    + '<button class="btn btn-purple" onclick="window.raiseHandInLiveStream(\'' + classId + '\')">🖐️ Raise Hand</button>'
    + '</div></div></div>'
    // Right: Real-time Live Chat Box
    + '<div style="display:flex;flex-direction:column;height:100%">'
    + '<div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:6px;display:flex;align-items:center;justify-content:space-between"><span>💬 Live Stream Chat</span><span style="font-size:11px;color:var(--muted)">142 Members</span></div>'
    + '<div id="live-stream-chat-box" class="live-chat-box">'
    + '<div class="chat-msg-row chat-msg-faculty"><b>Dr. Priya Mehta (Faculty):</b> Welcome everyone! We are starting Gauss Law derivation now. <span style="font-size:10px;color:var(--muted)">10:00 AM</span></div>'
    + '<div class="chat-msg-row"><b>Arjun Sharma:</b> Ma\'am, will spherical conductor proofs be included in today\'s quiz? <span style="font-size:10px;color:var(--muted)">10:04 AM</span></div>'
    + '<div class="chat-msg-row chat-msg-faculty"><b>Dr. Priya Mehta (Faculty):</b> Yes Arjun, 2 questions will be from spherical conductors. <span style="font-size:10px;color:var(--muted)">10:05 AM</span></div>'
    + '</div>'
    + '<div style="display:flex;gap:6px;margin-top:8px">'
    + '<input id="live-chat-input" class="inp-field" placeholder="Ask a live question..." onkeydown="if(event.key===\'Enter\')window.sendLiveStreamChat(\'' + classId + '\')">'
    + '<button class="btn btn-solid" onclick="window.sendLiveStreamChat(\'' + classId + '\')">Send</button>'
    + '</div></div></div>';

  var footer = '<button class="btn btn-red" onclick="closeModal(\'modal-detail\')">🚪 Leave Live Stream</button>';
  openDetail('🔴 LIVE STREAMING — Physics (Dr. Priya Mehta)', body, footer, 'lg');

  // Trigger heartbeat ping to backend
  api('/api/live/' + classId + '/heartbeat', { method: 'POST', body: JSON.stringify({ action: 'join' }) }).catch(function(){});
};

window.sendLiveStreamChat = async function(classId) {
  var input = document.getElementById('live-chat-input');
  if (!input || !input.value.trim()) return;
  var text = input.value.trim();
  input.value = '';

  var user = G.user || { name: 'Arjun Sharma', role: 'student' };
  var chatBox = document.getElementById('live-stream-chat-box');
  if (chatBox) {
    var now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    var msgHtml = '<div class="chat-msg-row"><b>' + user.name + ':</b> ' + text + ' <span style="font-size:10px;color:var(--muted)">' + now + '</span></div>';
    chatBox.insertAdjacentHTML('beforeend', msgHtml);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  try {
    await api('/api/live/' + classId + '/chat', {
      method: 'POST',
      body: JSON.stringify({ sender: user.name, role: user.role, text: text })
    });
  } catch (err) {}
};

window.raiseHandInLiveStream = function(classId) {
  toast('Hand raised in live class! Dr. Priya Mehta notified. 🖐️', '🖐️');
};

// ═══════════════════════════════════════════════════════
// MODULE-BASED QUESTION BANK GENERATOR PAGE
// ═══════════════════════════════════════════════════════
}
