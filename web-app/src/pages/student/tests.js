// Module: PAGES['student_tests']
export function registerPage(PAGES) {
  PAGES['student_tests'] = function() {
  var testsData = {
    upcoming: [
      { title:'Mock Test 14 — Full Syllabus JEE', date:'Mar 20, 2025', time:'09:00 AM', dur:'3 hrs', marks:360, qs:90, sub:'All', diff:'Hard' },
      { title:'Weekly Test — Thermodynamics', date:'Mar 18, 2025', time:'10:00 AM', dur:'1 hr', marks:100, qs:30, sub:'Physics', diff:'Medium' },
    ],
    completed: [
      { title:'Mock Test 13 — Physics + Chemistry', date:'Mar 10', score:267, total:300, pct:89, rank:3, time:'2h 45m', correct:78, wrong:8, skip:4 },
      { title:'Weekly Test — Organic Chemistry', date:'Mar 7', score:72, total:100, pct:72, rank:12, time:'52m', correct:21, wrong:7, skip:2 },
      { title:'Mock Test 12 — Full Syllabus', date:'Mar 3', score:298, total:360, pct:83, rank:5, time:'2h 58m', correct:82, wrong:6, skip:2 },
    ]
  };

  // Analytics cards
  var analytics = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px">'
    + [
      {icon:'📝',val:'32',label:'Tests Taken',col:'var(--purple)',key:'tests_taken'},
      {icon:'📊',val:'78%',label:'Average Score',col:'var(--faculty)',key:'avg_score'},
      {icon:'🏆',val:'#4',label:'Best Rank',col:'var(--yellow)',key:'best_rank'},
      {icon:'🎯',val:'89%',label:'Accuracy',col:'var(--student)',key:'accuracy'}
    ].map(function(s){
      return '<div class="enhanced-card" style="text-align:center;cursor:pointer" onclick="window.viewTestMetricDetail(\'' + s.key + '\')"><div style="font-size:24px;margin-bottom:8px">'+s.icon+'</div><div style="font-family:Syne,sans-serif;font-size:26px;font-weight:900;color:'+s.col+'">'+s.val+'</div><div style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-top:4px">'+s.label+'</div></div>';
    }).join('') + '</div>';

  // Upcoming tests
  var upcomingHtml = '<div class="card"><div class="card-header"><div class="card-title">📅 Upcoming Tests</div></div>'
    + testsData.upcoming.map(function(t){
      return '<div class="enhanced-card slide-in" style="margin-bottom:10px">'
        + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px">'
        + '<div style="flex:1"><div style="font-family:Syne,sans-serif;font-size:15px;font-weight:700;margin-bottom:6px">'+t.title+'</div>'
        + '<div style="display:flex;gap:10px;flex-wrap:wrap;font-size:12px;color:var(--muted);margin-bottom:10px">'
        + '<span>📅 '+t.date+'</span><span>🕐 '+t.time+'</span><span>⏱️ '+t.dur+'</span><span>📊 '+t.marks+' marks</span><span>❓ '+t.qs+' questions</span></div>'
        + '<div style="display:flex;gap:6px"><span class="badge badge-purple">'+t.sub+'</span><span class="badge '+(t.diff==='Hard'?'badge-red':'badge-yellow')+'">'+t.diff+'</span></div></div>'
        + '<div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">'
        + '<button class="btn btn-solid" onclick="window.startMockQuiz()">🚀 Start Test</button>'
        + '<button class="btn btn-sm btn-purple" onclick="window.viewTestSyllabus(\''+t.title.replace(/'/g,"\\'")+'\')">📋 Syllabus</button></div>'
        + '</div></div>';
    }).join('') + '</div>';

  // Completed tests with performance
  var completedHtml = '<div class="card"><div class="card-header"><div class="card-title">✅ Completed Tests</div></div>'
    + testsData.completed.map(function(t){
      var color = t.pct >= 85 ? '#4ade80' : t.pct >= 70 ? '#fbbf24' : '#ff2d6b';
      return '<div class="enhanced-card" style="margin-bottom:10px">'
        + '<div style="display:flex;align-items:center;gap:16px">'
        + '<div style="position:relative;width:60px;height:60px;flex-shrink:0"><svg width="60" height="60" style="transform:rotate(-90deg)"><circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="5"/><circle cx="30" cy="30" r="25" fill="none" stroke="'+color+'" stroke-width="5" stroke-linecap="round" stroke-dasharray="157" stroke-dashoffset="'+Math.round(157-157*t.pct/100)+'"/></svg><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Syne,sans-serif;font-size:14px;font-weight:900;color:'+color+'">'+t.pct+'%</div></div>'
        + '<div style="flex:1"><div style="font-size:14px;font-weight:700;margin-bottom:4px">'+t.title+'</div>'
        + '<div style="font-size:12px;color:var(--muted);margin-bottom:6px">'+t.date+' · '+t.time+' taken · Rank #'+t.rank+'</div>'
        + '<div style="display:flex;gap:10px;font-size:12px"><span style="color:#4ade80;font-weight:700">✓ '+t.correct+'</span><span style="color:#ff2d6b;font-weight:700">✗ '+t.wrong+'</span><span style="color:var(--muted)">⊘ '+t.skip+' skipped</span></div></div>'
        + '<div style="text-align:right;flex-shrink:0"><div style="font-family:Syne,sans-serif;font-size:20px;font-weight:900;color:'+color+'">'+t.score+'<span style="font-size:13px;color:var(--muted)">/'+t.total+'</span></div>'
        + '<button class="btn btn-sm btn-purple" style="margin-top:6px" onclick="window.openQuizAnalytics(\''+t.title.replace(/'/g,"\\'")+'\','+t.score+','+t.total+','+t.correct+','+t.wrong+','+t.skip+')">📊 Analysis</button></div>'
        + '</div></div>';
    }).join('') + '</div>';

  return analytics + upcomingHtml + completedHtml;
};

function startMockQuiz() {
  var questions = [
    { q:'A body of mass 5 kg is acted upon by two perpendicular forces 8N and 6N. The magnitude of acceleration is:', o:['2.0 m/s²','1.5 m/s²','2.8 m/s²','1.0 m/s²'], a:0 },
    { q:'The SI unit of electric flux is:', o:['N·m²/C','C/m²','V·m','N/C'], a:0 },
    { q:'The value of ∫₀^π sin²x dx is:', o:['π/2','π','π/4','2π'], a:0 },
  ];
  
  window.quizState = {
    questions: questions,
    answers: questions.map(function() { return null; }),
    reviewed: questions.map(function() { return false; }),
    currentIdx: 0,
    startTime: Date.now()
  };

  window.selectQuizOption = function(qIdx, optIdx) {
    window.quizState.answers[qIdx] = optIdx;
    window.renderQuizQuestion(qIdx);
  };

  window.toggleQuizReview = function(qIdx) {
    window.quizState.reviewed[qIdx] = !window.quizState.reviewed[qIdx];
    toast(window.quizState.reviewed[qIdx] ? 'Marked for review!' : 'Unmarked from review', '🔖');
    window.renderQuizQuestion(qIdx);
  };

  window.submitQuiz = function() {
    var correct = 0;
    var wrong = 0;
    var skip = 0;
    window.quizState.questions.forEach(function(q, idx) {
      var ans = window.quizState.answers[idx];
      if (ans === null) {
        skip++;
      } else if (ans === q.a) {
        correct++;
      } else {
        wrong++;
      }
    });
    var score = correct * 4 - wrong * 1; // Assuming JEE marking +4 / -1
    if (score < 0) score = 0;
    var total = window.quizState.questions.length * 4;
    closeModal('modal-detail');
    toast('Quiz submitted successfully!', '✅');
    setTimeout(function() {
      openQuizAnalytics('Mock Test Results', score, total, correct, wrong, skip);
    }, 300);
  };

  window.renderQuizQuestion = function(i) {
    window.quizState.currentIdx = i;
    var q = window.quizState.questions[i];
    var ans = window.quizState.answers[i];
    var isReviewed = window.quizState.reviewed[i];

    var navBtns = window.quizState.questions.map(function(_, j) {
      var statusColor = 'rgba(255,255,255,.06)';
      var borderColor = 'rgba(255,255,255,.08)';
      var fontColor = 'var(--muted)';
      if (j === i) {
        statusColor = 'linear-gradient(135deg,#6c47ff,#a855f7)';
        borderColor = 'rgba(108,71,255,.4)';
        fontColor = '#fff';
      } else if (window.quizState.reviewed[j]) {
        statusColor = 'rgba(251,191,36,.2)';
        borderColor = '#fbbf24';
        fontColor = '#fbbf24';
      } else if (window.quizState.answers[j] !== null) {
        statusColor = 'rgba(74,222,128,.15)';
        borderColor = '#4ade80';
        fontColor = '#4ade80';
      }
      return '<button style="width:32px;height:32px;border-radius:8px;background:' + statusColor + ';border:1px solid ' + borderColor + ';color:' + fontColor + ';font-weight:700;font-size:12px;cursor:pointer" onclick="window.renderQuizQuestion(' + j + ')">' + (j + 1) + '</button>';
    }).join('');

    var body = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><div style="display:flex;gap:6px">' + navBtns + '</div>'
      + '<div style="display:flex;align-items:center;gap:8px"><div style="position:relative;width:40px;height:40px"><svg width="40" height="40" style="transform:rotate(-90deg)"><circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="4"/><circle cx="20" cy="20" r="16" fill="none" stroke="#ff2d6b" stroke-width="4" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="25"/></svg><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#ff2d6b">45m</div></div><span style="font-size:12px;color:var(--muted)">Q ' + (i + 1) + '/' + window.quizState.questions.length + '</span></div></div>'
      + '<div class="q-card" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;margin-bottom:14px">'
      + '<div class="q-text" style="font-size:14px;font-weight:600;margin-bottom:14px;line-height:1.5">' + q.q + '</div>'
      + '<div class="opts-grid" style="display:grid;grid-template-columns:1fr;gap:8px">' + q.o.map(function(o, oi) {
          var isSel = ans === oi;
          var btnStyle = isSel ? 'background:linear-gradient(135deg,rgba(108,71,255,0.2),rgba(168,85,247,0.15));border-color:var(--purple);color:#fff;font-weight:700' : '';
          return '<button class="opt" style="text-align:left;padding:12px 16px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);color:var(--text);cursor:pointer;' + btnStyle + '" onclick="window.selectQuizOption(' + i + ',' + oi + ')">' + String.fromCharCode(65 + oi) + '. ' + o + '</button>';
        }).join('') + '</div></div>'
      + '<div style="display:flex;justify-content:space-between;margin-top:14px"><button class="btn btn-purple" onclick="window.toggleQuizReview(' + i + ')">🔖 ' + (isReviewed ? 'Unmark Review' : 'Mark for Review') + '</button><div style="display:flex;gap:8px">'
      + (i > 0 ? '<button class="btn btn-purple" onclick="window.renderQuizQuestion(' + (i - 1) + ')">← Prev</button>' : '')
      + (i < window.quizState.questions.length - 1 ? '<button class="btn btn-solid" onclick="window.renderQuizQuestion(' + (i + 1) + ')">Next →</button>' : '<button class="btn btn-green" onclick="window.submitQuiz()">✅ Submit</button>')
      + '</div></div>';

    openDetail('🎯 Mock Test — Question ' + (i + 1), body, '');
  };

  window.renderQuizQuestion(0);
}

// ──────────────── STUDENT MATERIAL (ENHANCED v2) ────────────────
}
