// Module: PAGES['parent_dashboard']
export function registerPage(PAGES) {
  PAGES['parent_dashboard'] = function() {
  var child = window.parentChildren[window.currentChildIdx] || window.parentChildren[0];
  
  var switcherHtml = '<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:16px 20px;margin-bottom:20px">'
    + '<div style="display:flex;align-items:center;gap:14px">'
    + '<div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff;font-weight:800">🎓</div>'
    + '<div>'
    + '<div style="font-size:16px;font-weight:800;color:var(--text)">' + child.name + ' <span style="font-size:12px;color:var(--muted);font-weight:500">(' + child.roll + ')</span></div>'
    + '<div style="font-size:12px;color:var(--muted);margin-top:2px">📚 ' + child.batch + ' · 📍 ' + child.campus + '</div>'
    + '</div></div>'
    + '<div style="display:flex;align-items:center;gap:10px">'
    + '<span style="font-size:12px;color:var(--muted);font-weight:600">Switch Child:</span>'
    + '<select class="inp-field" style="padding:6px 12px;font-size:13px;width:auto;background:rgba(16,185,129,0.1);border-color:rgba(16,185,129,0.3);color:#10b981;font-weight:700;border-radius:20px" onchange="window.switchChildProfile(this.selectedIndex)">'
    + window.parentChildren.map(function(c, i) {
        return '<option value="' + i + '" ' + (i === window.currentChildIdx ? 'selected' : '') + '>' + c.name + ' (' + c.roll + ')</option>';
      }).join('')
    + '</select>'
    + '</div></div>';

  var stats = makeStats([
    { label: 'Overall Attendance', val: child.att + '%', icon: '✅', col: '#4ade80' },
    { label: 'Batch Rank', val: child.rank, icon: '🏆', col: '#fbbf24' },
    { label: 'Avg Test Score', val: child.avg, icon: '📊', col: '#00c6ff' },
    { label: 'Fee Status', val: child.feeStatus, icon: '💳', col: '#10b981' }
  ]);

  var quickActions = '<div class="card" style="margin-top:20px">'
    + '<div class="card-header"><div class="card-title">⚡ Edchemy Quick Actions</div></div>'
    + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">'
    + '<button class="btn btn-outline" style="justify-content:center;padding:14px;border-color:rgba(16,185,129,0.3);color:#10b981" onclick="loadPage(\'leaves\')">📝 Apply for Leave</button>'
    + '<button class="btn btn-outline" style="justify-content:center;padding:14px;border-color:rgba(108,71,255,0.3);color:#a78bff" onclick="loadPage(\'marks\')">📜 Term Report Card</button>'
    + '<button class="btn btn-outline" style="justify-content:center;padding:14px;border-color:rgba(251,191,36,0.3);color:#fbbf24" onclick="loadPage(\'sibling_admission\')">👨‍👩‍👧 Sibling Admission</button>'
    + '<button class="btn btn-outline" style="justify-content:center;padding:14px;border-color:rgba(0,198,255,0.3);color:#00c6ff" onclick="loadPage(\'calendar\')">📅 School Calendar</button>'
    + '</div></div>';

  var notices = '<div class="card" style="margin-top:20px"><div class="card-header"><div class="card-title">📢 School Circulars & PTM Notices</div></div>'
    + '<div style="display:grid;gap:10px">'
    + makeListItem('📝', 'rgba(108,71,255,0.15)', 'Parent-Teacher Meeting (PTM 2025)', 'Scheduled for March 28 at RV Jayanagar Campus from 10:00 AM', 'Mar 28, 2026')
    + makeListItem('📚', 'rgba(16,185,129,0.15)', 'Mid-Term Examination Results Published', 'Term 1 report card with teacher remarks available for download', 'Mar 15, 2026')
    + '</div></div>';

  return switcherHtml + stats + quickActions + notices;
};
}
