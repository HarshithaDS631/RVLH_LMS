// Module: PAGES['parent_marks']
export function registerPage(PAGES) {
  PAGES['parent_marks'] = function() {
  var child = window.parentChildren[window.currentChildIdx] || window.parentChildren[0];
  
  return '<div class="marks-card-wrapper">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:16px">'
    + '<div>'
    + '<div style="font-size:20px;font-weight:800;color:var(--text)">📜 Academic Report Card — Mid-Term 2024-25</div>'
    + '<div style="font-size:13px;color:var(--muted);margin-top:4px">Student: <b>' + child.name + '</b> | Roll No: <b>' + child.roll + '</b> | Batch: <b>' + child.batch + '</b></div>'
    + '</div>'
    + '<button class="btn btn-solid" style="background:linear-gradient(135deg,#10b981,#059669)" onclick="window.downloadReportCardPDF() font-weight:700">📄 Download Official PDF</button>'
    + '</div>'
    + '<table class="marks-table">'
    + '<thead><tr><th>Subject</th><th>Score</th><th>Max Marks</th><th>Grade</th><th>Faculty Remark</th></tr></thead>'
    + '<tbody>'
    + '<tr><td><b>Physics</b></td><td><span style="color:#4ade80;font-weight:700">92</span></td><td>100</td><td><span class="badge badge-green">A+</span></td><td><div class="teacher-remark-box"><b>Dr. Priya Mehta:</b> "Excellent conceptual clarity in Mechanics & Gauss Law."</div></td></tr>'
    + '<tr><td><b>Chemistry</b></td><td><span style="color:#4ade80;font-weight:700">84</span></td><td>100</td><td><span class="badge badge-green">A</span></td><td><div class="teacher-remark-box"><b>Prof. Amit Singh:</b> "Good performance in Organic Reaction Mechanisms."</div></td></tr>'
    + '<tr><td><b>Mathematics</b></td><td><span style="color:#4ade80;font-weight:700">88</span></td><td>100</td><td><span class="badge badge-green">A+</span></td><td><div class="teacher-remark-box"><b>Mr. Raj Sharma:</b> "Strong problem-solving speed in Differential Calculus."</div></td></tr>'
    + '</tbody>'
    + '</table>'
    + '<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.04);border-radius:14px;padding:16px 20px;margin-top:20px">'
    + '<div style="display:flex;gap:24px">'
    + '<div><div style="font-size:11px;color:var(--muted);text-transform:uppercase">Total Score</div><div style="font-size:18px;font-weight:800;color:#4ade80">264 / 300</div></div>'
    + '<div><div style="font-size:11px;color:var(--muted);text-transform:uppercase">Percentile</div><div style="font-size:18px;font-weight:800;color:#00c6ff">96.8%</div></div>'
    + '<div><div style="font-size:11px;color:var(--muted);text-transform:uppercase">Batch Rank</div><div style="font-size:18px;font-weight:800;color:#fbbf24">3rd Place</div></div>'
    + '</div>'
    + '<div><span class="badge badge-purple" style="font-size:13px;padding:6px 16px">Overall Grade: Distinction (A+)</span></div>'
    + '</div>'
    + '</div>';
};
}
