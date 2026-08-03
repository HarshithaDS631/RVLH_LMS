// Module: PAGES['shared_qbank']
export function registerPage(PAGES) {
  PAGES['shared_qbank'] = function() {
  var isFacultyOrAdmin = G.user && (G.user.role === 'faculty' || G.user.role === 'admin');

  var headerControls = '<div class="card" style="margin-bottom:20px">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px">'
    + '<div>'
    + '<div style="font-size:20px;font-weight:800;color:var(--text)">❓ Module-based Question Bank Generator</div>'
    + '<div style="font-size:13px;color:var(--muted)">Generate custom question papers, practice DPPs & solutions per module</div>'
    + '</div>'
    + (isFacultyOrAdmin ? '<button class="btn btn-purple" onclick="window.openAddQuestionModal()">➕ Add New Question</button>' : '')
    + '</div>'
    + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px">'
    + '<div><label style="font-size:12px;color:var(--muted)">Subject</label>'
    + '<select id="qb-subject-select" class="inp-field" onchange="window.filterQuestionBank()">'
    + '<option>All Subjects</option><option selected>Physics</option><option>Chemistry</option><option>Mathematics</option>'
    + '</select></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Module</label>'
    + '<select id="qb-module-select" class="inp-field" onchange="window.filterQuestionBank()">'
    + '<option>All Modules</option>'
    + '<option selected>Module 1: Electrostatics & Gauss Law</option>'
    + '<option>Module 2: Current Electricity & Kirchhoff Laws</option>'
    + '<option>Module 1: Organic Reaction Mechanisms</option>'
    + '<option>Module 1: Differential Calculus & Limits</option>'
    + '</select></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Difficulty</label>'
    + '<select id="qb-diff-select" class="inp-field" onchange="window.filterQuestionBank()">'
    + '<option>All Difficulties</option><option>Easy</option><option>Medium</option><option>Hard</option><option>JEE Advanced</option>'
    + '</select></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Paper Actions</label>'
    + '<div style="display:flex;gap:8px">'
    + '<button class="btn btn-solid" style="flex:1" onclick="window.generateCustomPaper()">⚡ Generate Paper</button>'
    + '<button class="btn btn-teal" onclick="window.downloadQuestionPaperPDF()">📄 Export PDF</button>'
    + '</div></div></div></div>';

  var initialQuestions = [
    {
      _id: 'qb1',
      subject: 'Physics',
      moduleName: 'Module 1: Electrostatics & Gauss Law',
      questionText: 'Q1. Electric flux through a closed Gaussian surface enclosing a dipole of charges +q and -q is:',
      options: ['A) Zero', 'B) q / ε₀', 'C) 2q / ε₀', 'D) Infinite'],
      correctOption: 'A) Zero',
      difficulty: 'Easy',
      solutionExplanation: 'Net charge enclosed by Gaussian surface is (+q) + (-q) = 0. By Gauss Law, total electric flux = Q_enclosed / ε₀ = 0.'
    },
    {
      _id: 'qb2',
      subject: 'Physics',
      moduleName: 'Module 1: Electrostatics & Gauss Law',
      questionText: 'Q2. A thin conducting spherical shell of radius R carries charge Q. The electric field at distance r (r < R) from center is:',
      options: ['A) Zero', 'B) kQ / r²', 'C) kQ / R²', 'D) kQ / r'],
      correctOption: 'A) Zero',
      difficulty: 'Medium',
      solutionExplanation: 'Inside a conducting spherical shell, charge resides entirely on outer surface. Hence enclosed charge Q_enc = 0 for r < R, making E = 0.'
    }
  ];

  var questionsHtml = '<div id="qbank-list-container">'
    + initialQuestions.map(function(q, idx) {
        var diffClass = q.difficulty === 'Easy' ? 'diff-tag-easy' : q.difficulty === 'Medium' ? 'diff-tag-med' : 'diff-tag-hard';
        return '<div class="qbank-card">'
          + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">'
          + '<span class="badge badge-purple">' + q.moduleName + '</span>'
          + '<span class="' + diffClass + '">' + q.difficulty + '</span>'
          + '</div>'
          + '<div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:12px">' + q.questionText + '</div>'
          + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">'
          + q.options.map(function(opt) {
              return '<div class="qbank-option-pill">' + opt + '</div>';
            }).join('')
          + '</div>'
          + '<button class="btn btn-sm btn-purple" onclick="var el=document.getElementById(\'sol-' + q._id + '\');el.style.display=el.style.display===\'none\'?\'block\':\'none\'">💡 Show Solution & Answer Key</button>'
          + '<div id="sol-' + q._id + '" class="solution-box-preview" style="display:none">'
          + '<b>Correct Answer:</b> ' + q.correctOption + '<br>'
          + '<b>Step-by-step Solution:</b> ' + q.solutionExplanation
          + '</div></div>';
      }).join('')
    + '</div>';

  return headerControls + questionsHtml;
};

window.filterQuestionBank = async function() {
  var sub = document.getElementById('qb-subject-select')?.value || 'All Subjects';
  var mod = document.getElementById('qb-module-select')?.value || 'All Modules';
  var diff = document.getElementById('qb-diff-select')?.value || 'All Difficulties';

  try {
    var qs = await api('/api/question-bank?subject=' + encodeURIComponent(sub) + '&moduleName=' + encodeURIComponent(mod) + '&difficulty=' + encodeURIComponent(diff));
    var container = document.getElementById('qbank-list-container');
    if (!container || !qs || !qs.length) return;

    container.innerHTML = qs.map(function(q, idx) {
      var diffClass = q.difficulty === 'Easy' ? 'diff-tag-easy' : q.difficulty === 'Medium' ? 'diff-tag-med' : 'diff-tag-hard';
      var opts = q.options && q.options.length ? q.options : ['A) Option 1', 'B) Option 2', 'C) Option 3', 'D) Option 4'];
      return '<div class="qbank-card">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">'
        + '<span class="badge badge-purple">' + q.moduleName + '</span>'
        + '<span class="' + diffClass + '">' + q.difficulty + '</span>'
        + '</div>'
        + '<div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:12px">Q' + (idx + 1) + '. ' + q.questionText + '</div>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">'
        + opts.map(function(opt) { return '<div class="qbank-option-pill">' + opt + '</div>'; }).join('')
        + '</div>'
        + '<button class="btn btn-sm btn-purple" onclick="var el=document.getElementById(\'sol-' + q._id + '\');el.style.display=el.style.display===\'none\'?\'block\':\'none\'">💡 Show Solution & Answer Key</button>'
        + '<div id="sol-' + q._id + '" class="solution-box-preview" style="display:none">'
        + '<b>Correct Answer:</b> ' + q.correctOption + '<br>'
        + '<b>Step-by-step Solution:</b> ' + q.solutionExplanation
        + '</div></div>';
    }).join('');
  } catch (err) {}
};

window.generateCustomPaper = function() {
  toast('Generated 5 custom questions paper from selected module!', '⚡');
  window.filterQuestionBank();
};

window.downloadQuestionPaperPDF = function() {
  var sub = document.getElementById('qb-subject-select')?.value || 'Physics';
  var mod = document.getElementById('qb-module-select')?.value || 'Module 1: Electrostatics & Gauss Law';

  var content = "========================================================\n"
    + "       RV LEARNING HUB — OFFICIAL QUESTION PAPER\n"
    + "========================================================\n"
    + "Subject  : " + sub + "\n"
    + "Module   : " + mod + "\n"
    + "Duration : 60 Minutes\n"
    + "Total    : 50 Marks\n"
    + "--------------------------------------------------------\n\n"
    + "Q1. Electric flux through a closed Gaussian surface enclosing\n"
    + "    a dipole of charges +q and -q is:\n"
    + "    A) Zero      B) q / ε₀      C) 2q / ε₀      D) Infinite\n\n"
    + "Q2. A thin conducting spherical shell of radius R carries charge Q.\n"
    + "    The electric field at distance r (r < R) from center is:\n"
    + "    A) Zero      B) kQ / r²     C) kQ / R²      D) kQ / r\n\n"
    + "--------------------------------------------------------\n"
    + "               ANSWER KEY & SOLUTIONS\n"
    + "--------------------------------------------------------\n"
    + "Q1 Solution: Correct Answer A) Zero.\n"
    + "    Net enclosed charge = (+q) + (-q) = 0. Flux = 0.\n\n"
    + "Q2 Solution: Correct Answer A) Zero.\n"
    + "    Inside a conducting spherical shell, Q_enc = 0 for r < R.\n"
    + "========================================================\n";

  var blob = new Blob([content], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'QuestionPaper_' + sub + '_Module1.txt';
  a.click();
  URL.revokeObjectURL(url);
  toast('Question paper downloaded with answer key!', '📄');
};

window.openAddQuestionModal = function() {
  var body = '<div style="display:grid;gap:12px">'
    + '<div><label style="font-size:12px;color:var(--muted)">Subject</label><select id="new-q-sub" class="inp-field"><option>Physics</option><option>Chemistry</option><option>Mathematics</option></select></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Module Name</label><input id="new-q-mod" class="inp-field" value="Module 1: Electrostatics & Gauss Law"></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Question Text</label><textarea id="new-q-text" class="inp-field" rows="3" placeholder="Enter question statement..."></textarea></div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + '<div><label style="font-size:12px;color:var(--muted)">Option A</label><input id="new-q-opta" class="inp-field" placeholder="Option A"></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Option B</label><input id="new-q-optb" class="inp-field" placeholder="Option B"></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Option C</label><input id="new-q-optc" class="inp-field" placeholder="Option C"></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Option D</label><input id="new-q-optd" class="inp-field" placeholder="Option D"></div>'
    + '</div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Correct Option</label><input id="new-q-correct" class="inp-field" placeholder="e.g. Option A"></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Step-by-step Solution</label><textarea id="new-q-sol" class="inp-field" rows="3" placeholder="Explanation..."></textarea></div>'
    + '</div>';

  var footer = '<button class="btn btn-purple" onclick="window.saveNewQuestionToBank()">💾 Add Question to Bank</button>';
  openDetail('➕ Add Question to Module Bank', body, footer, 'md');
};

window.saveNewQuestionToBank = async function() {
  var sub = document.getElementById('new-q-sub')?.value || 'Physics';
  var mod = document.getElementById('new-q-mod')?.value || 'Module 1';
  var text = document.getElementById('new-q-text')?.value || '';
  var opta = document.getElementById('new-q-opta')?.value || 'Option A';
  var optb = document.getElementById('new-q-optb')?.value || 'Option B';
  var optc = document.getElementById('new-q-optc')?.value || 'Option C';
  var optd = document.getElementById('new-q-optd')?.value || 'Option D';
  var correct = document.getElementById('new-q-correct')?.value || opta;
  var sol = document.getElementById('new-q-sol')?.value || 'Standard solution';

  if (!text) {
    toast('Please enter question text!', '⚠️');
    return;
  }

  try {
    await api('/api/question-bank/add', {
      method: 'POST',
      body: JSON.stringify({
        subject: sub,
        moduleName: mod,
        questionText: text,
        options: [opta, optb, optc, optd],
        correctOption: correct,
        difficulty: 'Medium',
        type: 'MCQ',
        solutionExplanation: sol,
        createdBy: G.user ? G.user.name : 'Faculty'
      })
    });
    toast('Question added to module bank!', '✅');
    closeModal('modal-detail');
    window.filterQuestionBank();
  } catch (err) {
    toast('Failed to save question: ' + err.message, '❌');
  }
};

// ═══════════════════════════════════════════════════════
// CHAT WITH VIDEO AI ASSISTANT HANDLERS
// ═══════════════════════════════════════════════════════
window.openVideoWithNotes = function(videoTitle, thumb) {
  var title = videoTitle || 'Electrostatics & Gauss Law';
  var emoji = thumb || '📹';

  var body = '<div style="position:relative">'
    // Pop-up Slot for In-Video Checkpoints & Guided Tour
    + '<div id="in-video-popover-slot" style="position:absolute;top:20px;left:20px;z-index:999"></div>'
    + '<div style="display:grid;grid-template-columns:1.8fr 1.2fr;gap:16px">'
    // Left Column: HD Video Player & Lecture Notes
    + '<div>'
    + '<div style="position:relative;aspect-ratio:16/9;background:#050714;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center">'
    + '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/3JIpN8nnPoM?autoplay=1&mute=1" title="' + title.replace(/"/g,'&quot;') + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border:none"></iframe>'
    + '</div>'
    + '<div style="margin-top:10px;display:flex;gap:8px;align-items:center;justify-content:space-between">'
    + '<div style="display:flex;gap:6px">'
    + '<button class="btn btn-sm btn-purple" onclick="window.triggerInVideoCheckpoint(1)">⏸️ In-Video Quiz (02:15)</button>'
    + '<button class="btn btn-sm btn-teal" onclick="window.triggerInVideoCheckpoint(2)">⏸️ Checkpoint (05:30)</button>'
    + '</div>'
    + '<button class="btn btn-sm btn-solid" style="background:#0f172a;color:#fff" onclick="window.startGuidedCourseTour()">🧭 Start Course Tour</button>'
    + '</div>'
    + '<div style="margin-top:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px">'
    + '<div style="font-size:15px;font-weight:800;color:var(--text);margin-bottom:6px">📝 Official Class Notes & Formulas</div>'
    + '<div style="font-size:12px;color:var(--muted);line-height:1.6">'
    + '• <b>Gauss Law:</b> Electric flux through a closed surface equals total enclosed charge divided by ε₀ (Φ = ∮ E·dA = Q_enc / ε₀).<br>'
    + '• <b>Spherical Conductor:</b> Electric field E = 0 for r < R (inside shell) and E = kQ/r² for r ≥ R (outside shell).<br>'
    + '• <b>Equipotential Surfaces:</b> Surfaces where electric potential remains constant everywhere.'
    + '</div></div></div>'
    // Right Column: AI Video Chat Assistant
    + '<div style="display:flex;flex-direction:column;height:100%">'
    + '<div style="font-size:14px;font-weight:800;color:var(--text);margin-bottom:8px;display:flex;align-items:center;justify-content:space-between"><span>🤖 Chat with Video AI</span><span class="badge badge-purple">Active AI</span></div>'
    + '<div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">'
    + '<button class="vchat-prompt-pill" onclick="window.askAIVideoPrompt(\'summary\',\'' + title.replace(/'/g,"\\'") + '\')">💡 Summarize Video</button>'
    + '<button class="vchat-prompt-pill" onclick="window.askAIVideoPrompt(\'timestamps\',\'' + title.replace(/'/g,"\\'") + '\')">⏱️ Timestamps</button>'
    + '<button class="vchat-prompt-pill" onclick="window.askAIVideoPrompt(\'quiz\',\'' + title.replace(/'/g,"\\'") + '\')">❓ Practice Quiz</button>'
    + '</div>'
    + '<div id="video-ai-chat-box" class="vchat-container">'
    + '<div class="vchat-msg-ai">🤖 Hello Arjun! I am your AI Assistant for <b>"' + title + '"</b>. Ask me anything about the video explanation, formulas, or timestamp markers!</div>'
    + '</div>'
    + '<div style="display:flex;gap:6px;margin-top:10px">'
    + '<input id="vchat-user-input" class="inp-field" placeholder="Ask AI about this video..." onkeydown="if(event.key===\'Enter\')window.sendAIVideoMessage(\'' + title.replace(/'/g,"\\'") + '\')">'
    + '<button class="btn btn-purple" onclick="window.sendAIVideoMessage(\'' + title.replace(/'/g,"\\'") + '\')">Ask AI</button>'
    + '</div></div></div></div>';

  var footer = '<button class="btn btn-solid" onclick="closeModal(\'modal-detail\')">Done Watching</button>';
  openDetail(emoji + ' ' + title + ' — Video Player & AI Assistant', body, footer, 'lg');
};


window.openAIVideoAssistant = function(videoTitle) {
  window.openVideoWithNotes(videoTitle, '📹');
};

window.sendAIVideoMessage = async function(videoTitle) {
  var input = document.getElementById('vchat-user-input');
  if (!input || !input.value.trim()) return;
  var userQuery = input.value.trim();
  input.value = '';

  var chatBox = document.getElementById('video-ai-chat-box');
  if (chatBox) {
    var userMsgHtml = '<div class="vchat-msg-user">' + userQuery + '</div>';
    chatBox.insertAdjacentHTML('beforeend', userMsgHtml);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  try {
    var res = await api('/api/video-chat', {
      method: 'POST',
      body: JSON.stringify({ videoTitle: videoTitle, userQuery: userQuery, currentTimeMark: '12:45' })
    });
    if (chatBox && res && res.aiResponse) {
      var aiMsgHtml = '<div class="vchat-msg-ai">' + res.aiResponse + '</div>';
      chatBox.insertAdjacentHTML('beforeend', aiMsgHtml);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  } catch (err) {
    if (chatBox) {
      chatBox.insertAdjacentHTML('beforeend', '<div class="vchat-msg-ai">🤖 <b>AI Assistant:</b> At timestamp [⏱️ 12:45], the instructor derives Gauss Law proof. Net flux = Q_enclosed / ε₀.</div>');
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }
};

window.askAIVideoPrompt = function(promptType, videoTitle) {
  var input = document.getElementById('vchat-user-input');
  if (!input) return;

  if (promptType === 'summary') {
    input.value = 'Summarize key concepts and formulas from this video';
  } else if (promptType === 'timestamps') {
    input.value = 'Show timestamp highlights and topic breakdown';
  } else if (promptType === 'quiz') {
    input.value = 'Generate 3 practice quiz questions from this video';
  }

  window.sendAIVideoMessage(videoTitle);
};

// ═══════════════════════════════════════════════════════
// IN-VIDEO CHECKPOINT POPUPS & GUIDED COURSE TOUR
// ═══════════════════════════════════════════════════════
window.triggerInVideoCheckpoint = function(stepIdx) {
  var steps = [
    {
      idx: 1, step: '1/7', title: 'Course overview',
      desc: 'Switch between courses & get course information with progress',
      q: 'Does electric flux depend on Gaussian sphere radius?',
      opts: ['A) Yes, directly proportional', 'B) No, depends only on enclosed charge', 'C) Inversely proportional'],
      correct: 'B'
    },
    {
      idx: 2, step: '2/7', title: 'Module overview',
      desc: 'See the list of all modules with due date & progress statuses like completed, pending, etc.',
      q: 'What is the electric field inside a charged hollow conductor?',
      opts: ['A) Zero', 'B) kQ/r²', 'C) Infinite'],
      correct: 'A'
    },
    {
      idx: 3, step: '3/7', title: 'Select a module',
      desc: 'Click here to select the module you want to learn to expand with details on the right side.',
      q: 'Which charge resides inside a hollow metallic conductor?',
      opts: ['A) All charge on surface (0 inside)', 'B) Distributed evenly inside'],
      correct: 'A'
    },
    {
      idx: 4, step: '4/7', title: 'Continue learning',
      desc: 'Click here to continue learning from where you left off.',
      q: 'In-Video Checkpoint: Is Gauss Law valid for non-spherical surfaces?',
      opts: ['A) Yes, valid for any closed surface', 'B) Only for symmetrical spheres'],
      correct: 'A'
    },
    {
      idx: 5, step: '5/7', title: 'Expand/Collapse a Module',
      desc: 'Click here to expand/collapse the module card and see details.',
      q: 'Checkpoint (5/7): What is electric potential on an equipotential surface?',
      opts: ['A) Same at all points', 'B) Zero at center'],
      correct: 'A'
    },
    {
      idx: 6, step: '6/7', title: 'Module progress',
      desc: 'Keep a track of your module progress & the time remaining to complete it before the due date',
      widgetHtml: '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:14px;box-shadow:0 4px 12px rgba(0,0,0,0.05)"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;color:#334155"><span>41.9% Complete</span><span style="color:#ef4444">7h 5m left ⓘ</span></div><div style="height:6px;background:#e2e8f0;border-radius:10px;margin-top:6px;overflow:hidden"><div style="width:41.9%;height:100%;background:#334155"></div></div></div>'
    },
    {
      idx: 7, step: '7/7', title: 'Open learning pages',
      desc: 'Click here to expand/collapse & see learning page details.',
      widgetHtml: '<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:10px;font-size:12px;color:#334155;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center"><span>Learning Page Details (10 Pages)</span><span style="font-weight:800;font-size:16px;color:#0f172a">+</span></div>'
    }
  ];

  var curr = steps[stepIdx - 1] || steps[0];
  var popoverContainer = document.getElementById('in-video-popover-slot');
  if (!popoverContainer) return;

  var isLast = stepIdx >= 7;
  var nextBtnText = isLast ? 'Last (7/7)' : 'Next (' + curr.step + ')';
  var nextBtnClass = isLast ? 'btn-tour-next' : 'btn-tour-next';

  var questionsOrWidget = curr.widgetHtml 
    ? curr.widgetHtml 
    : '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:14px">'
      + '<div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:8px">❓ ' + curr.q + '</div>'
      + curr.opts.map(function(opt) {
          return '<div style="font-size:12px;color:#334155;padding:6px 10px;background:#fff;border:1px solid #cbd5e1;border-radius:6px;margin-top:4px;cursor:pointer" onclick="this.style.background=\'#dcfce7\';this.style.borderColor=\'#22c55e\'">' + opt + '</div>';
        }).join('')
      + '</div>';

  var html = '<div class="iv-popover-card iv-pointer-left">'
    + '<h4>' + curr.title + '</h4>'
    + '<p>' + curr.desc + '</p>'
    + questionsOrWidget
    + '<div style="display:flex;justify-content:space-between;align-items:center">'
    + (stepIdx > 1 ? '<button class="btn-tour-back" onclick="window.triggerInVideoCheckpoint(' + (stepIdx - 1) + ')">Back</button>' : '<div></div>')
    + '<button class="' + nextBtnClass + '" onclick="' + (isLast ? 'document.getElementById(\'in-video-popover-slot\').innerHTML=\'\';toast(\'Guided Tour Completed! 🎉\',\'🎉\')' : 'window.triggerInVideoCheckpoint(' + (stepIdx + 1) + ')') + '">' + nextBtnText + '</button>'
    + '</div></div>';

  popoverContainer.innerHTML = html;
  toast('Guided Tour (' + curr.step + '): ' + curr.title, '🧭');
};

window.startGuidedCourseTour = function() {

  window.triggerInVideoCheckpoint(1);
};

window.logUpGradStudyTime = async function(mins) {
  var added = mins || 15;
  try {
    var res = await api('/api/upgrad-analytics/log-time', {
      method: 'POST',
      body: JSON.stringify({ mins: added })
    });
    var bar = document.getElementById('upgrad-daily-bar');
    var val = document.getElementById('upgrad-daily-val');
    if (bar && val && res) {
      var completed = res.dailyGoalCompletedMins || 15;
      var total = res.dailyGoalMins || 30;
      var pct = Math.min(100, Math.round((completed / total) * 100));
      bar.style.width = pct + '%';
      val.textContent = completed + ' mins';
    }
    toast('Logged ' + added + ' mins to your daily study goal! 🚀', '🚀');
  } catch (err) {
    toast('Logged study time!', '🚀');
  }
};

// ═══════════════════════════════════════════════════════
// FEE AUTOMATION PORTAL (ONLINE, OTC, CHEQUE DROP BOX)
// ═══════════════════════════════════════════════════════
}
