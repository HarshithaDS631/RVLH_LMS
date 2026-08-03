// Module: PAGES['faculty_analytics']
export function registerPage(PAGES) {
  PAGES['faculty_analytics'] = function() {
  var stats = makeStats([
    { icon:'👁', val:'12.4K',label:'Video Views',      col:'var(--faculty)', onclick: "window.viewFacultyAnalyticsDetail('video_views')" },
    { icon:'⭐', val:'4.7',  label:'Avg Rating',       col:'var(--yellow)', onclick: "window.viewFacultyAnalyticsDetail('avg_rating')" },
    { icon:'📝', val:'14',   label:'Tests Created',    col:'var(--purple)', onclick: "window.viewFacultyAnalyticsDetail('tests_created')" },
    { icon:'✅', val:'87%',  label:'Class Completion', col:'var(--student)', onclick: "window.viewFacultyAnalyticsDetail('class_completion')" },
  ]);
  var chart = makeChartBars([{m:'Oct',v:70},{m:'Nov',v:78},{m:'Dec',v:65},{m:'Jan',v:82},{m:'Feb',v:75},{m:'Mar',v:88}], 'linear-gradient(180deg,var(--faculty),rgba(0,212,200,.3))');
  var top3 = [{t:'Electrostatics Lecture',v:312,c:'#ff2d6b'},{t:'Organic Chemistry',v:289,c:'#00d4c8'},{t:'Thermodynamics',v:245,c:'#6c47ff'}];
  var topHtml = top3.map(function(v) {
    return '<div style="margin-bottom:11px"><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:3px"><span>' + v.t + '</span><span style="color:' + v.c + '">👁 ' + v.v + '</span></div>' + makeProgress(v.v/4, v.c) + '</div>';
  }).join('');
  return stats
    + '<div class="grid-2">'
    + '<div class="card"><div class="card-title" style="margin-bottom:14px">📈 Monthly Engagement</div>' + chart + '</div>'
    + '<div class="card"><div class="card-title" style="margin-bottom:14px">📚 Top Content</div>' + topHtml + '</div>'
    + '</div>';
};
}
