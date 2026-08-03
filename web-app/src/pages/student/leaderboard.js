// Module: PAGES['student_leaderboard']
export function registerPage(PAGES) {
  PAGES['student_leaderboard'] = function() {
  var data = [
    {r:1,n:'Sneha Patel',s:94,t:32,a:'96%'},
    {r:2,n:'Rohan Gupta',s:91,t:30,a:'92%'},
    {r:3,n:'Ananya Singh',s:88,t:31,a:'94%'},
    {r:4,n:'Arjun Sharma',s:85,t:29,a:'89%',you:true},
    {r:5,n:'Priya Joshi',s:83,t:28,a:'87%'},
    {r:6,n:'Karthik R.',s:81,t:27,a:'85%'},
    {r:7,n:'Meera Shah',s:79,t:26,a:'83%'},
    {r:8,n:'Dev Verma',s:77,t:25,a:'81%'},
  ];
  var rows = data.map(function(s, i) {
    var rc = i===0?'#fbbf24':i===1?'#aaa':i===2?'#cd7f32':'var(--muted)';
    var emo = i<3?['🥇','🥈','🥉'][i]:s.r;
    return '<tr style="' + (s.you?'background:rgba(74,222,128,.05)':'' ) + '" onclick="toast(\'Viewing profile\',\'👤\')">'
      + '<td><div class="lb-rank" style="background:color-mix(in srgb,' + rc + ' 16%,var(--surface2));color:' + rc + '">' + emo + '</div></td>'
      + '<td style="font-weight:' + (s.you?700:400) + '">' + s.n + (s.you?' (You)':'') + '</td>'
      + '<td><span style="color:var(--student);font-weight:700">' + s.s + '%</span></td>'
      + '<td>' + s.t + '</td><td>' + s.a + '</td></tr>';
  }).join('');
  return '<div class="card"><div class="card-header"><div class="card-title">🏆 Leaderboard — JEE Advanced 2025</div>'
    + '<select class="inp-field" style="width:auto;padding:5px 10px;font-size:12px" onchange="toast(\'Filter applied\',\'🔍\')"><option>This Month</option><option>This Week</option><option>Overall</option></select></div>'
    + '<div class="tbl-wrap"><table><thead><tr><th>Rank</th><th>Student</th><th>Avg Score</th><th>Tests</th><th>Attendance</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
};

// ──────────────── STUDENT FEES ────────────────
}
