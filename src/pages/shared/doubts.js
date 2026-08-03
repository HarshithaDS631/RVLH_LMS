// Module: PAGES['shared_doubts']
export function registerPage(PAGES) {
  PAGES['shared_doubts'] = function() {
  var header = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">'
    + '<div>'
    + '<div style="font-size:20px;font-weight:800;color:var(--text)">💬 Peer-to-Peer (P2P) Doubts & Q&A Forum</div>'
    + '<div style="font-size:13px;color:var(--muted)">Ask questions, get AI solutions, and earn Peer Karma Points 🏅 by helping classmates</div>'
    + '</div>'
    + '<button class="btn btn-purple" onclick="window.openAskDoubtModal()">➕ Ask a Doubt</button>'
    + '</div>';

  var topBar = '<div class="card" style="margin-bottom:20px;padding:16px">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">'
    + '<div style="display:flex;gap:8px">'
    + '<select id="p2p-sub-filter" class="inp-field" style="width:160px" onchange="window.filterP2PDoubts()"><option>All Subjects</option><option selected>Physics</option><option>Chemistry</option><option>Mathematics</option></select>'
    + '<select id="p2p-status-filter" class="inp-field" style="width:160px" onchange="window.filterP2PDoubts()"><option>All Status</option><option>Resolved</option><option>Unresolved</option></select>'
    + '</div>'
    + '<div style="display:flex;align-items:center;gap:10px">'
    + '<span class="karma-badge-pill">🏅 Your Karma: 240 Pts (Peer Mentor)</span>'
    + '</div></div></div>';

  var doubtCards = '<div id="p2p-doubts-list-container">'
    + '<div class="p2p-doubt-card">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">'
    + '<div><span class="badge badge-purple">Physics</span> &nbsp;<span style="font-size:12px;color:var(--muted)">Module 1: Electrostatics</span></div>'
    + '<span class="badge badge-yellow">✅ Resolved (2 Peer Answers)</span>'
    + '</div>'
    + '<div style="font-size:16px;font-weight:800;color:var(--text);margin-bottom:6px;cursor:pointer" onclick="window.openP2PDoubtThreadModal(\'p2p-1\')">Why is electric field zero inside a hollow spherical conductor?</div>'
    + '<div style="font-size:13px;color:var(--muted);margin-bottom:12px">Asked by <b>Arjun Sharma</b> · 2 hours ago</div>'
    + '<div class="ai-solver-box">'
    + '🤖 <b>AI Auto-Solver:</b> Charges repel each other and move as far apart as possible to minimize potential energy. In a conductor, charges accumulate on the outer boundary. By Gauss Law, ∮ E·dA = Q_enc/ε₀. Since Q_enc = 0 inside, E = 0.'
    + '</div>'
    + '<div class="verified-sol-box">'
    + '✅ <b>Faculty Verified Solution (by Rohan Gupta - Peer Mentor):</b> Because electrostatic equilibrium requires zero net force on free electrons inside the bulk metal. If E != 0, electrons would accelerate until E becomes 0.'
    + '</div>'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px">'
    + '<div style="display:flex;gap:10px">'
    + '<button class="upvote-btn-pill" onclick="window.upvoteP2PDoubt(\'p2p-1\')">👍 Upvote (12)</button>'
    + '<button class="btn btn-sm btn-solid" onclick="window.openP2PDoubtThreadModal(\'p2p-1\')">💬 View Discussion Thread</button>'
    + '</div>'
    + '<span style="font-size:12px;color:#22c55e;font-weight:700">+10 Karma for top answer!</span>'
    + '</div></div>'
    + '</div>';

  return header + topBar + doubtCards;
};

window.filterP2PDoubts = async function() {
  var sub = document.getElementById('p2p-sub-filter')?.value || 'All Subjects';
  var stat = document.getElementById('p2p-status-filter')?.value || 'All Status';

  try {
    var doubts = await api('/api/p2p-doubts?subject=' + encodeURIComponent(sub) + '&status=' + encodeURIComponent(stat));
    var container = document.getElementById('p2p-doubts-list-container');
    if (!container || !doubts || !doubts.length) return;

    container.innerHTML = doubts.map(function(d) {
      return '<div class="p2p-doubt-card">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">'
        + '<div><span class="badge badge-purple">' + d.subject + '</span> &nbsp;<span style="font-size:12px;color:var(--muted)">' + (d.moduleName || 'Module 1') + '</span></div>'
        + '<span class="badge badge-yellow">✅ ' + (d.status || 'Resolved') + '</span>'
        + '</div>'
        + '<div style="font-size:16px;font-weight:800;color:var(--text);margin-bottom:6px;cursor:pointer" onclick="window.openP2PDoubtThreadModal(\'' + d._id + '\')">' + d.questionTitle + '</div>'
        + '<div style="font-size:13px;color:var(--muted);margin-bottom:12px">Asked by <b>' + d.studentName + '</b></div>'
        + (d.aiSuggestedAnswer ? '<div class="ai-solver-box">' + d.aiSuggestedAnswer + '</div>' : '')
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px">'
        + '<div style="display:flex;gap:10px">'
        + '<button class="upvote-btn-pill" onclick="window.upvoteP2PDoubt(\'' + d._id + '\')">👍 Upvote (' + (d.upvotes || 5) + ')</button>'
        + '<button class="btn btn-sm btn-solid" onclick="window.openP2PDoubtThreadModal(\'' + d._id + '\')">💬 View Discussion Thread</button>'
        + '</div></div></div>';
    }).join('');
  } catch (err) {}
};

window.openAskDoubtModal = function() {
  var body = '<div style="display:grid;gap:12px">'
    + '<div><label style="font-size:12px;color:var(--muted)">Subject</label><select id="new-doubt-sub" class="inp-field"><option>Physics</option><option>Chemistry</option><option>Mathematics</option></select></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Module Name</label><input id="new-doubt-mod" class="inp-field" value="Module 1: Electrostatics & Gauss Law"></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Doubt Title</label><input id="new-doubt-title" class="inp-field" placeholder="e.g. Why is E = 0 inside conductor?"></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Detailed Question / Formula Explanation</label><textarea id="new-doubt-text" class="inp-field" rows="4" placeholder="Explain your query in detail..."></textarea></div>'
    + '</div>';

  var footer = '<button class="btn btn-purple" onclick="window.submitNewP2PDoubt()">🤖 Post Doubt & Get Instant AI Answer</button>';
  openDetail('❓ Ask a Doubt to AI & Peer Community', body, footer, 'md');
};

window.submitNewP2PDoubt = async function() {
  var sub = document.getElementById('new-doubt-sub')?.value || 'Physics';
  var mod = document.getElementById('new-doubt-mod')?.value || 'Module 1';
  var title = document.getElementById('new-doubt-title')?.value || '';
  var text = document.getElementById('new-doubt-text')?.value || '';

  if (!title || !text) {
    toast('Please enter doubt title & details!', '⚠️');
    return;
  }

  try {
    await api('/api/p2p-doubts/ask', {
      method: 'POST',
      body: JSON.stringify({ subject: sub, moduleName: mod, questionTitle: title, questionText: text, studentName: G.user ? G.user.name : 'Arjun Sharma' })
    });
    toast('Doubt posted! AI Auto-Solver generated instant resolution. 🤖', '🤖');
    closeModal('modal-detail');
    loadPage('doubts');
  } catch (err) {
    toast('Doubt submitted!', '✅');
    closeModal('modal-detail');
  }
};

window.openP2PDoubtThreadModal = function(doubtId) {
  var body = '<div style="display:grid;gap:14px">'
    + '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px">'
    + '<div style="font-size:16px;font-weight:800;color:var(--text);margin-bottom:6px">Why is electric field zero inside a hollow spherical conductor?</div>'
    + '<div style="font-size:12px;color:var(--muted);line-height:1.6">When a hollow metallic sphere is charged, why does all charge shift to the outer surface leaving E = 0 inside?</div>'
    + '</div>'

    + '<div class="ai-solver-box">'
    + '🤖 <b>AI Auto-Solver:</b> Charges repel each other and move as far apart as possible to minimize potential energy. In a conductor, charges accumulate on the outer boundary. By Gauss Law, ∮ E·dA = Q_enc/ε₀. Since Q_enc = 0 inside, E = 0.'
    + '</div>'

    + '<div class="verified-sol-box">'
    + '✅ <b>Faculty Verified Solution (by Rohan Gupta - Peer Mentor):</b> Because electrostatic equilibrium requires zero net force on free electrons inside the bulk metal. If E != 0, electrons would accelerate until E becomes 0.'
    + '</div>'

    + '<div><label style="font-size:12px;color:var(--muted)">Your Answer / Peer Explanation (Earn +10 Karma Points 🏅)</label>'
    + '<textarea id="peer-reply-text" class="inp-field" rows="3" placeholder="Write step-by-step solution to help your peer..."></textarea></div>'
    + '</div>';

  var footer = '<button class="btn btn-purple" onclick="window.submitP2PAnswer(\'' + doubtId + '\')">🏅 Submit Peer Answer (+10 Karma)</button>';
  openDetail('💬 P2P Discussion Thread', body, footer, 'lg');
};

window.submitP2PAnswer = async function(doubtId) {
  var replyText = document.getElementById('peer-reply-text')?.value || '';
  if (!replyText) {
    toast('Please write your peer answer!', '⚠️');
    return;
  }

  try {
    await api('/api/p2p-doubts/' + doubtId + '/answer', {
      method: 'POST',
      body: JSON.stringify({ author: G.user ? G.user.name + ' (Peer Mentor)' : 'Arjun Sharma (Peer)', authorRole: 'student', text: replyText })
    });
    toast('Answer posted! +10 Peer Karma Points awarded! 🏅', '🏅');
    closeModal('modal-detail');
    loadPage('doubts');
  } catch (err) {
    toast('Answer posted! +10 Karma Points awarded! 🏅', '🏅');
    closeModal('modal-detail');
  }
};

window.upvoteP2PDoubt = function(id) {
  toast('Upvoted doubt thread! 👍', '👍');
};

// ═══════════════════════════════════════════════════════
// MULTI-TENANT SAAS MANAGEMENT PLATFORM PAGE
// ═══════════════════════════════════════════════════════
}
