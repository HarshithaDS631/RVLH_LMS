// Module: PAGES['parent_sibling_admission']
export function registerPage(PAGES) {
  PAGES['parent_sibling_admission'] = function() {
  return '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">'
    + '<div>'
    + '<div style="font-size:20px;font-weight:800;color:var(--text)">👨‍👩‍👧 Sibling Admission Portal</div>'
    + '<div style="font-size:13px;color:var(--muted)">Apply for new admissions for siblings with priority parent quota</div>'
    + '</div>'
    + '<button class="btn btn-solid" style="background:linear-gradient(135deg,#fbbf24,#ff6b35);color:#000;font-weight:800" onclick="window.openSiblingAdmissionModal()">➕ New Sibling Application</button>'
    + '</div>'
    + '<div class="card">'
    + '<div class="card-header"><div class="card-title">📄 Active Sibling Applications</div></div>'
    + '<div style="display:grid;gap:14px">'
    + '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;display:flex;justify-content:space-between;align-items:center">'
    + '<div>'
    + '<div style="font-size:16px;font-weight:800;color:var(--text)">Rohan Sharma</div>'
    + '<div style="font-size:12px;color:var(--muted);margin-top:4px">Applying For: <b>Grade 9 — Foundation Batch</b> | App No: <b>SIB-2026-008</b></div>'
    + '<div style="font-size:12px;color:var(--muted);margin-top:2px">Previous School: Delhi Public School | DOB: May 14, 2012</div>'
    + '</div>'
    + '<div style="text-align:right">'
    + '<span class="badge badge-yellow" style="font-size:12px;padding:6px 14px">📁 Document Verification</span>'
    + '<div style="font-size:11px;color:var(--muted);margin-top:6px">Submitted on Mar 10, 2026</div>'
    + '</div></div>'
    + '</div></div>';
};
}
