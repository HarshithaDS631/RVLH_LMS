// Module: PAGES['student_progress']
export function registerPage(PAGES) {
  PAGES['student_progress'] = function() {
  var stats = makeStats([
    { icon:'📊', val:'78%', label:'Overall Score', col:'var(--student)' },
    { icon:'✅', val:'89%', label:'Attendance',    col:'var(--faculty)' },
    { icon:'📝', val:'29',  label:'Tests Done',    col:'var(--purple)' },
    { icon:'🏆', val:'#4',  label:'Batch Rank',    col:'var(--yellow)' },
  ]);
  var chart = makeChartBars([{m:'',v:65},{m:'',v:72},{m:'',v:69},{m:'',v:78},{m:'',v:74},{m:'',v:82}], 'linear-gradient(180deg,var(--student),rgba(74,222,128,.3))');
  var subj = [{s:'Physics',a:74,c:'#ff2d6b'},{s:'Chemistry',a:82,c:'#00d4c8'},{s:'Maths',a:68,c:'#6c47ff'},{s:'Biology',a:79,c:'#4ade80'}];
  var subjHtml = subj.map(function(s) {
    return '<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:3px"><span>' + s.s + '</span><span style="color:' + s.c + ';font-weight:700">' + s.a + '%</span></div>' + makeProgress(s.a, s.c) + '</div>';
  }).join('');
  var tests = [
    { t:'Mock Test 13', date:'Mar 8', sub:'All', score:'242/360', pct:67, rank:'#12' },
    { t:'Chemistry Weekly', date:'Mar 5', sub:'Chem', score:'98/120', pct:82, rank:'#5' },
    { t:'Physics DPP Ch4', date:'Mar 3', sub:'Phys', score:'64/80', pct:80, rank:'#8' },
  ];
  var testHtml = '<div class="tbl-wrap"><table><thead><tr><th>Test</th><th>Date</th><th>Subject</th><th>Score</th><th>Rank</th></tr></thead><tbody>'
    + tests.map(function(t) {
        return '<tr onclick="openTestSolution(\'' + t.t + '\')">'
          + '<td>' + t.t + '</td><td>' + t.date + '</td><td><span class="badge badge-purple">' + t.sub + '</span></td>'
          + '<td><span style="color:var(--student);font-weight:700">' + t.score + '</span> <span style="font-size:11px;color:var(--muted)">(' + t.pct + '%)</span></td>'
          + '<td>' + t.rank + '</td></tr>';
      }).join('') + '</tbody></table></div>';

  return stats
    + '<div class="grid-2">'
    + '<div class="card"><div class="card-header"><div class="card-title">📈 Monthly Performance</div><button class="btn btn-sm btn-purple" onclick="window.viewMonthlyPerformanceDetail()">👁️ View Details</button></div>' + chart + '</div>'
    + '<div class="card"><div class="card-header"><div class="card-title">📚 Subject Accuracy</div></div>' + subjHtml + '</div>'
    + '</div>'
    + '<div class="card"><div class="card-header"><div class="card-title">📋 Test History</div>'
    + '<button class="btn btn-sm btn-purple" onclick="toast(\'Report downloaded!\',\'⬇\')">⬇ Export</button></div>' + testHtml + '</div>';
};

// ──────────────── STUDENT ATTENDANCE ────────────────
}
