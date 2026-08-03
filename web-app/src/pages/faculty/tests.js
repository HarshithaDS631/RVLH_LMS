// Module: PAGES['faculty_tests']
export function registerPage(PAGES) {
  PAGES['faculty_tests'] = function() {
  var tests = window.mockTests || [];
  var html = '<div style="display:flex;justify-content:flex-end;margin-bottom:14px">'
    + '<button class="btn btn-teal" onclick="window.openCreateTestModal()">➕ Create Test</button></div>'
    + '<div class="card"><div class="tbl-wrap"><table><thead><tr><th>Test</th><th>Type</th><th>Batch</th><th>Qs</th><th>Deadline</th><th>Attempts</th><th>Action</th></tr></thead><tbody>'
    + tests.map(function(t) {
        return '<tr onclick="window.openTestResultsModal(\'' + t.n.replace(/'/g,"\\'") + '\',\'' + t.att + '\')">'
          + '<td>' + t.n + '</td><td><span class="badge badge-purple">' + t.type + '</span></td><td>' + t.batch + '</td><td>' + t.qs + '</td><td>' + t.deadline + '</td>'
          + '<td>' + (t.att>0 ? '<span style="color:var(--faculty);font-weight:700">' + t.att + '</span>' : '<span style="color:var(--muted)">Draft</span>') + '</td>'
          + '<td><div style="display:flex;gap:5px">'
          + '<button class="btn btn-sm btn-teal" onclick="event.stopPropagation();window.openTestResultsModal(\'' + t.n.replace(/'/g,"\\'") + '\',\'' + t.att + '\')">📊 Results</button>'
          + '<button class="btn btn-sm btn-purple" onclick="event.stopPropagation();window.openEditTestModal(\'' + t.id + '\')">✏️</button></div></td></tr>';
      }).join('') + '</tbody></table></div></div>';
  return html;
};

function makeTestFormHtml(testData) {
  var t = testData || { n: '', type: 'DPP', subject: 'Physics', qs: '20', duration: '60 min', marksCorrect: '+4', marksWrong: '-1', batch: 'JEE Advanced A', startDate: '', endDate: '' };
  
  var html = '<div style="display:flex;flex-direction:column;gap:12px">'
    + '<div class="inp-group"><label>Test Title</label><input type="text" id="test-title" class="inp-field" placeholder="e.g. Chapter 6 — Optics DPP" value="' + t.n.replace(/"/g,'&quot;') + '"></div>'
    + '<div class="inp-row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + '<div class="inp-group"><label>Test Type</label><select id="test-type" class="inp-field">'
      + ['DPP', 'Chapter Test', 'Weekly Test', 'Full Mock'].map(function(o) { return '<option ' + (o === t.type ? 'selected' : '') + '>' + o + '</option>'; }).join('')
      + '</select></div>'
    + '<div class="inp-group"><label>Subject</label><select id="test-subject" class="inp-field">'
      + ['Physics', 'Chemistry', 'Maths', 'All'].map(function(o) { return '<option ' + (o === t.subject ? 'selected' : '') + '>' + o + '</option>'; }).join('')
      + '</select></div>'
    + '</div>'
    + '<div class="inp-row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + '<div class="inp-group"><label>Questions</label><input type="text" id="test-qs" class="inp-field" value="' + t.qs + '"></div>'
    + '<div class="inp-group"><label>Duration</label><select id="test-duration" class="inp-field">'
      + ['30 min', '45 min', '60 min', '90 min', '3 hours'].map(function(o) { return '<option ' + (o === t.duration ? 'selected' : '') + '>' + o + '</option>'; }).join('')
      + '</select></div>'
    + '</div>'
    + '<div class="inp-row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + '<div class="inp-group"><label>Correct Marks</label><input type="text" id="test-correct" class="inp-field" value="' + t.marksCorrect + '"></div>'
    + '<div class="inp-group"><label>Wrong Marks</label><input type="text" id="test-wrong" class="inp-field" value="' + t.marksWrong + '"></div>'
    + '</div>'
    + '<div class="inp-group"><label>Assign to Batch</label><select id="test-batch" class="inp-field">'
      + ['JEE Advanced A', 'JEE Advanced B', 'NEET Batch', 'All Batches'].map(function(o) { return '<option ' + (o === t.batch ? 'selected' : '') + '>' + o + '</option>'; }).join('')
      + '</select></div>'
    + '<div class="inp-row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + '<div class="inp-group"><label>Start Date</label><input type="date" id="test-start" class="inp-field" value="' + t.startDate + '"></div>'
    + '<div class="inp-group"><label>End Date</label><input type="date" id="test-end" class="inp-field" value="' + t.endDate + '"></div>'
    + '</div>'
    + '</div>';
  return html;
}

window.openCreateTestModal = function() {
  var body = makeTestFormHtml();
  openDetail('📝 Create New Test', body, '<button class="btn btn-solid" onclick="window.saveCreatedTest()">📤 Publish Test</button>');
};

window.openEditTestModal = function(id) {
  var t = window.mockTests.find(function(item) { return item.id === id; });
  if (!t) {
    toast('Test not found', '⚠️');
    return;
  }
  var body = makeTestFormHtml(t);
  openDetail('✏️ Edit Test: ' + t.n, body, '<button class="btn btn-solid" onclick="window.saveEditedTest(\'' + id + '\')">💾 Save Changes</button>');
};

window.saveCreatedTest = function() {
  var titleInput = document.getElementById('test-title');
  var typeSelect = document.getElementById('test-type');
  var subjectSelect = document.getElementById('test-subject');
  var qsInput = document.getElementById('test-qs');
  var durSelect = document.getElementById('test-duration');
  var correctInput = document.getElementById('test-correct');
  var wrongInput = document.getElementById('test-wrong');
  var batchSelect = document.getElementById('test-batch');
  var startInput = document.getElementById('test-start');
  var endInput = document.getElementById('test-end');
  
  if (!titleInput || !titleInput.value.trim()) {
    toast('Test Title is required!', '⚠️');
    return;
  }
  
  var newTest = {
    id: 'test-' + (window.mockTests.length + 1),
    n: titleInput.value.trim(),
    type: typeSelect ? typeSelect.value : 'DPP',
    subject: subjectSelect ? subjectSelect.value : 'Physics',
    qs: qsInput ? parseInt(qsInput.value) || 20 : 20,
    duration: durSelect ? durSelect.value : '60 min',
    marksCorrect: correctInput ? correctInput.value : '+4',
    marksWrong: wrongInput ? wrongInput.value : '-1',
    batch: batchSelect ? batchSelect.value : 'JEE Advanced A',
    startDate: startInput ? startInput.value : '',
    endDate: endInput ? endInput.value : '',
    deadline: endInput && endInput.value ? new Date(endInput.value).toLocaleDateString('en-US', {month:'short', day:'numeric'}) : 'Mar 25',
    att: 0,
    pub: true
  };
  
  window.mockTests.push(newTest);
  closeModal('modal-detail');
  toast('Test created and published!', '📝');
  loadPage('faculty_tests');
};

window.saveEditedTest = function(id) {
  var titleInput = document.getElementById('test-title');
  var typeSelect = document.getElementById('test-type');
  var subjectSelect = document.getElementById('test-subject');
  var qsInput = document.getElementById('test-qs');
  var durSelect = document.getElementById('test-duration');
  var correctInput = document.getElementById('test-correct');
  var wrongInput = document.getElementById('test-wrong');
  var batchSelect = document.getElementById('test-batch');
  var startInput = document.getElementById('test-start');
  var endInput = document.getElementById('test-end');
  
  if (!titleInput || !titleInput.value.trim()) {
    toast('Test Title is required!', '⚠️');
    return;
  }
  
  var t = window.mockTests.find(function(item) { return item.id === id; });
  if (t) {
    t.n = titleInput.value.trim();
    t.type = typeSelect ? typeSelect.value : 'DPP';
    t.subject = subjectSelect ? subjectSelect.value : 'Physics';
    t.qs = qsInput ? parseInt(qsInput.value) || 20 : 20;
    t.duration = durSelect ? durSelect.value : '60 min';
    t.marksCorrect = correctInput ? correctInput.value : '+4';
    t.marksWrong = wrongInput ? wrongInput.value : '-1';
    t.batch = batchSelect ? batchSelect.value : 'JEE Advanced A';
    t.startDate = startInput ? startInput.value : '';
    t.endDate = endInput ? endInput.value : '';
    if (endInput && endInput.value) {
      t.deadline = new Date(endInput.value).toLocaleDateString('en-US', {month:'short', day:'numeric'});
    }
  }
  
  closeModal('modal-detail');
  toast('Test updated successfully!', '✅');
  loadPage('faculty_tests');
};

function openTestResultsModal(title, attempts) {
  var body = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:18px">'
    + [['Attempts',attempts,'var(--faculty)'],['Avg Score','74%','var(--student)'],['Pass Rate','68%','var(--purple)']].map(function(x) {
        return '<div class="fee-card" style="text-align:center"><div style="font-size:20px;font-weight:800;color:' + x[2] + ';font-family:Syne,sans-serif">' + x[1] + '</div><div style="font-size:11px;color:var(--muted);margin-top:3px">' + x[0] + '</div></div>';
      }).join('') + '</div>'
    + '<div class="tbl-wrap"><table><thead><tr><th>Rank</th><th>Student</th><th>Score</th><th>Time</th></tr></thead><tbody>'
    + [[1,'Sneha Patel','72/80 (90%)','24 min'],[2,'Rohan Gupta','68/80 (85%)','27 min'],[3,'Ananya Singh','65/80 (81%)','29 min']].map(function(r) {
        return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td style="color:var(--student);font-weight:700">' + r[2] + '</td><td>' + r[3] + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  openDetail('📊 Results — ' + title, body, '<button class="btn btn-teal" onclick="window.exportTestResults(\'' + title.replace(/'/g,"\\'") + '\');closeModal(\'modal-detail\')">⬇ Export</button>');
}
}
