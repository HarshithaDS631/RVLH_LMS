// Module: PAGES['admin_announcements']
export function registerPage(PAGES) {
  PAGES['admin_announcements'] = function() {
  var form = '<div class="card" style="margin-bottom:14px">'
    + '<div class="card-title" id="admin_announcements_form_title" style="margin-bottom:14px">' + (window.currentEditingDraftId ? '✏️ Edit Announcement Draft' : '📢 Create Announcement') + '</div>'
    + '<div class="inp-group"><label style="font-weight:700;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.6px">Title</label>'
    + '<input class="inp-field" id="ann-title" placeholder="e.g. Holiday Notice"></div>'
    + '<div class="inp-row" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:14px">'
    + '<div class="inp-group"><label style="font-weight:700;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.6px">Category</label>'
    + '<select class="inp-field" id="ann-cat"><option>General</option><option>Academic</option><option>Fee</option><option>Exam</option><option>Event</option></select></div>'
    + '<div class="inp-group"><label style="font-weight:700;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.6px">Priority</label>'
    + '<select class="inp-field" id="ann-pri"><option>Normal</option><option>Important</option><option>Urgent</option></select></div>'
    + '<div class="inp-group"><label style="font-weight:700;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.6px">Target Audience</label>'
    + '<select class="inp-field" id="ann-target"><option value="all">All</option><option value="student">Student</option><option value="faculty">Faculty</option></select></div>'
    + '</div>'
    + '<div class="inp-group"><label style="font-weight:700;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.6px">Message</label>'
    + '<textarea class="inp-field" id="ann-msg" rows="3" placeholder="Write announcement.."></textarea></div>'
    + '<div style="display:flex;gap:10px;margin-top:14px">'
    + '<button class="btn btn-solid" style="background:#ff2d6b;color:#fff;display:flex;align-items:center;gap:6px" onclick="window.saveAnnouncement(false)">📢 Publish</button>'
    + '<button class="btn btn-purple" style="display:flex;align-items:center;gap:6px" onclick="window.saveAnnouncement(true)">💾 Draft</button></div>'
    + '</div>';

  var list = '<div class="card">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px">'
    + '<div class="card-title" style="margin:0">📋 Recent Announcements</div>'
    + '<div class="inner-tabs" style="margin:0">'
    + '<button class="itab itab-ann-target ' + ((window.currentAdminAnnFilter || 'all') === 'all' ? 'active' : '') + '" onclick="window.setAdminAnnFilter(\'all\')">All</button>'
    + '<button class="itab itab-ann-target ' + ((window.currentAdminAnnFilter || 'all') === 'student' ? 'active' : '') + '" onclick="window.setAdminAnnFilter(\'student\')">Student</button>'
    + '<button class="itab itab-ann-target ' + ((window.currentAdminAnnFilter || 'all') === 'faculty' ? 'active' : '') + '" onclick="window.setAdminAnnFilter(\'faculty\')">Faculty</button>'
    + '</div>'
    + '</div>'
    + '<div id="admin-ann-list-container"></div>'
    + '</div>';

  setTimeout(function() {
    if (window.renderAdminAnnList) window.renderAdminAnnList();
  }, 0);

  return form + list;
};


// ═══════════════════════════════════════════════════════
// MY PROFILE (admin_profile)
// ═══════════════════════════════════════════════════════
}
