// Module: PAGES['admin_courses']
export function registerPage(PAGES) {
  PAGES['admin_courses'] = function() {
  var notice = '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;padding:12px;background:rgba(108,71,255,.05);border:1px solid rgba(108,71,255,.15);border-radius:10px;align-items:center">'
    + '<div style="font-weight:700;color:var(--purple);font-size:12px;margin-right:8px">Builder Flow:</div>'
    + '<div class="flow-step" onclick="openCreateCourseModal()" style="cursor:pointer;padding:4px 8px;border-radius:6px;background:rgba(108,71,255,.1);border:1px solid rgba(108,71,255,.2);font-size:11px;font-weight:600;transition:all 0.2s" onmouseover="this.style.background=\'var(--purple)\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'rgba(108,71,255,.1)\';this.style.color=\'inherit\'">1. Create Course</div>'
    + '<span style="color:var(--muted);font-size:11px">→</span>'
    + '<div class="flow-step" onclick="triggerFlowStep(\'subjects\')" style="cursor:pointer;padding:4px 8px;border-radius:6px;background:rgba(108,71,255,.1);border:1px solid rgba(108,71,255,.2);font-size:11px;font-weight:600;transition:all 0.2s" onmouseover="this.style.background=\'var(--purple)\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'rgba(108,71,255,.1)\';this.style.color=\'inherit\'">2. Add Subjects</div>'
    + '<span style="color:var(--muted);font-size:11px">→</span>'
    + '<div class="flow-step" onclick="triggerFlowStep(\'chapters\')" style="cursor:pointer;padding:4px 8px;border-radius:6px;background:rgba(108,71,255,.1);border:1px solid rgba(108,71,255,.2);font-size:11px;font-weight:600;transition:all 0.2s" onmouseover="this.style.background=\'var(--purple)\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'rgba(108,71,255,.1)\';this.style.color=\'inherit\'">3. Add Chapters</div>'
    + '<span style="color:var(--muted);font-size:11px">→</span>'
    + '<div class="flow-step" onclick="loadPage(\'media\')" style="cursor:pointer;padding:4px 8px;border-radius:6px;background:rgba(108,71,255,.1);border:1px solid rgba(108,71,255,.2);font-size:11px;font-weight:600;transition:all 0.2s" onmouseover="this.style.background=\'var(--purple)\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'rgba(108,71,255,.1)\';this.style.color=\'inherit\'">4. Link Content</div>'
    + '<span style="color:var(--muted);font-size:11px">→</span>'
    + '<div class="flow-step" onclick="triggerFlowStep(\'faculty\')" style="cursor:pointer;padding:4px 8px;border-radius:6px;background:rgba(108,71,255,.1);border:1px solid rgba(108,71,255,.2);font-size:11px;font-weight:600;transition:all 0.2s" onmouseover="this.style.background=\'var(--purple)\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'rgba(108,71,255,.1)\';this.style.color=\'inherit\'">5. Assign Faculty</div>'
    + '<span style="color:var(--muted);font-size:11px">→</span>'
    + '<div class="flow-step" onclick="triggerFlowStep(\'publish\')" style="cursor:pointer;padding:4px 8px;border-radius:6px;background:rgba(108,71,255,.1);border:1px solid rgba(108,71,255,.2);font-size:11px;font-weight:600;transition:all 0.2s" onmouseover="this.style.background=\'var(--purple)\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'rgba(108,71,255,.1)\';this.style.color=\'inherit\'">6. Activate / Publish</div>'
    + '</div>';

  var grid = '<div class="grid-2">' + COURSE_DB.map(function(cr,idx) {
    return '<div class="card" style="border-color:color-mix(in srgb,' + cr.col + ' 22%,var(--border))">'
      + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:9px">'
      + '<div style="display:flex;gap:10px;align-items:center">'
      + '<div style="width:42px;height:42px;border-radius:10px;background:color-mix(in srgb,' + cr.col + ' 10%,var(--surface2));display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer" onclick="openCourseEditModal(' + idx + ')">' + cr.e + '</div>'
      + '<div><div style="font-weight:700;font-size:13px;cursor:pointer" onclick="openCourseEditModal(' + idx + ')">' + cr.n + '</div>'
      + '<div style="font-size:11px;color:var(--muted)">' + cr.cat + ' • ' + cr.dur + ' • ₹' + cr.fee.toLocaleString() + '</div></div></div>'
      + '<span class="badge ' + (cr.pub?'badge-green':'badge-yellow') + '">' + (cr.pub?'Active':'Draft') + '</span></div>'
      + '<div style="font-size:12px;color:var(--muted);margin-bottom:3px">'
      + '<span style="cursor:pointer;text-decoration:underline;color:color-mix(in srgb,' + cr.col + ' 85%,#fff)" onclick="openCourseEnrollDetail(\'' + cr.n.replace(/'/g,"\\'") + '\',' + cr.enrolled + ',' + cr.maxSt + ',\'' + cr.col + '\')">👨‍🎓 ' + cr.enrolled + ' / ' + cr.maxSt + ' enrolled</span> &nbsp;•&nbsp; '
      + '<span style="cursor:pointer;text-decoration:underline" onclick="openCourseEditModalForStep(' + idx + ',\'faculty\')">👨‍🏫 ' + cr.faculty + '</span></div>'
      + '<div style="font-size:12px;color:var(--muted);margin-bottom:11px;cursor:pointer" onclick="openCourseEditModalForStep(' + idx + ',\'subjects\')">📚 ' + cr.subjects.join(', ') + '</div>'
      + '<div style="display:flex;gap:7px">'
      + '<button class="btn btn-sm btn-purple" style="flex:1" onclick="openCourseEditModal(' + idx + ')">✏️ Edit</button>'
      + '<button class="btn btn-sm ' + (cr.pub?'btn-red':'btn-green') + '" onclick="toggleCourseStatus(' + idx + ')">' + (cr.pub?'Deactivate':'Activate') + '</button>'
      + '</div></div>';
  }).join('') + '</div>';

  return '<div style="display:flex;justify-content:flex-end;margin-bottom:14px">'
    + '<button class="btn btn-red" onclick="openCreateCourseModal()">🏗️ Create Course</button></div>'
    + notice + grid;
};

window.triggerFlowStep = function(step) {
  var body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">Select a course to configure:</div>'
    + '<div style="display:flex;flex-direction:column;gap:8px">';
  
  window.COURSE_DB.forEach(function(cr, idx) {
    body += '<button class="btn btn-outline" style="text-align:left;display:flex;align-items:center;gap:10px;justify-content:flex-start;width:100%;padding:10px 14px" onclick="closeModal(\'modal-detail\'); openCourseEditModalForStep(' + idx + ', \'' + step + '\')">'
      + '<span style="font-size:18px">' + cr.e + '</span>'
      + '<div><div style="font-weight:700;font-size:13px">' + cr.n + '</div><div style="font-size:10px;color:var(--muted)">' + cr.cat + ' • Lead: ' + cr.faculty + '</div></div>'
      + '</button>';
  });
  
  body += '</div>';
  
  openDetail('📋 Select Course', body, '<button class="btn btn-purple" onclick="closeModal(\'modal-detail\')">Cancel</button>');
};

window.openCourseEditModalForStep = function(idx, step) {
  window.openCourseEditModal(idx);
  
  setTimeout(function() {
    var fieldId = '';
    if (step === 'subjects') fieldId = 'cef-subs';
    else if (step === 'chapters') fieldId = 'cef-curr';
    else if (step === 'faculty') fieldId = 'cef-fac';
    else if (step === 'publish') {
      var statusBtn = document.querySelector('#modal-detail button.btn-red, #modal-detail button.btn-green');
      if (statusBtn) {
        statusBtn.focus();
        statusBtn.style.outline = '3px solid var(--purple)';
        statusBtn.style.outlineOffset = '2px';
        setTimeout(function() { statusBtn.style.outline = 'none'; }, 2500);
      }
      return;
    }
    
    if (fieldId) {
      var field = document.getElementById(fieldId);
      if (field) {
        field.focus();
        field.style.outline = '3px solid var(--purple)';
        field.style.outlineOffset = '1px';
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function() {
          field.style.outline = '';
          field.style.outlineOffset = '';
        }, 2500);
      }
    }
  }, 150);
};

window.toggleCourseStatus = async function(idx) {
  var cr = window.COURSE_DB[idx];
  try {
    await api('/api/courses/' + cr._id + '/status', {
      method: 'PUT'
    });
    toast(cr.n + (!cr.pub ? ' activated!' : ' deactivated!'), !cr.pub ? '✅' : '🚫');
    await syncLMSData();
    loadPage('courses');
  } catch (err) {
    toast('Failed to toggle course status: ' + err.message, '❌');
  }
};

window.openCourseEditModal = function(idx) {
  var cr = window.COURSE_DB[idx];
  var cats = ['JEE','NEET','Commerce','Foundation'];
  var durs = ['1 Year','2 Years','6 Months','3 Months (Crash)'];
  var facs = ['Dr. Priya Mehta','Prof. Amit Singh','Mr. Raj Sharma','Dr. Kavya R.','Prof. Neha K.'];
  var body = '<div id="cef-wrap">'
    + '<div class="inp-group"><label>Course Name</label><input class="inp-field" id="cef-name" value="' + cr.n.replace(/"/g,'&quot;') + '"></div>'
    + '<div class="inp-row">'
    + '<div class="inp-group"><label>Category</label><select class="inp-field" id="cef-cat">' + cats.map(function(o){return '<option'+(cr.cat===o?' selected':'')+'>'+o+'</option>';}).join('') + '</select></div>'
    + '<div class="inp-group"><label>Duration</label><select class="inp-field" id="cef-dur">' + durs.map(function(o){return '<option'+(cr.dur===o?' selected':'')+'>'+o+'</option>';}).join('') + '</select></div>'
    + '</div>'
    + '<div class="inp-row">'
    + '<div class="inp-group"><label>Fee (₹)</label><input class="inp-field" id="cef-fee" type="number" value="' + cr.fee + '"></div>'
    + '<div class="inp-group"><label>Max Students</label><input class="inp-field" id="cef-max" type="number" value="' + cr.maxSt + '"></div>'
    + '</div>'
    + '<div class="inp-group"><label>Lead Faculty</label><select class="inp-field" id="cef-fac">' + facs.map(function(o){return '<option'+(cr.faculty===o?' selected':'')+'>'+o+'</option>';}).join('') + '</select></div>'
    + '<div class="inp-group"><label>Subjects (comma separated)</label><input class="inp-field" id="cef-subs" value="' + cr.subjects.join(', ') + '"></div>'
    + '<div class="inp-group"><label>Description</label><textarea class="inp-field" id="cef-desc" rows="3">' + cr.desc + '</textarea></div>'
    + '<div class="inp-group"><label>Curriculum Overview</label><textarea class="inp-field" id="cef-curr" rows="3">' + cr.curriculum + '</textarea></div>'
    + '<div style="padding:10px;background:rgba(0,0,0,.2);border-radius:8px;margin-top:4px">'
    + '<div style="font-size:12px;color:var(--muted);margin-bottom:7px">Course Status</div>'
    + '<button class="btn ' + (cr.pub?'btn-red':'btn-green') + '" onclick="toggleCourseStatus('+idx+');closeModal(\'modal-detail\')">' + (cr.pub?'🚫 Deactivate Course':'✅ Activate Course') + '</button>'
    + '</div></div>';
  openDetail('✏️ Edit — ' + cr.n, body,
    '<button class="btn btn-solid" onclick="saveCourseEdit(' + idx + ')">💾 Save Changes</button>');
};

window.saveCourseEdit = async function(idx) {
  var cr = window.COURSE_DB[idx];
  var n   = document.getElementById('cef-name');
  var cat = document.getElementById('cef-cat');
  var dur = document.getElementById('cef-dur');
  var fee = document.getElementById('cef-fee');
  var mx  = document.getElementById('cef-max');
  var fac = document.getElementById('cef-fac');
  var sb  = document.getElementById('cef-subs');
  var ds  = document.getElementById('cef-desc');
  var cu  = document.getElementById('cef-curr');

  try {
    await api('/api/courses/' + cr._id, {
      method: 'PUT',
      body: JSON.stringify({
        title: n ? n.value : cr.n,
        cat: cat ? cat.value : cr.cat,
        dur: dur ? dur.value : cr.dur,
        fee: fee ? parseInt(fee.value) : cr.fee,
        maxSt: mx ? parseInt(mx.value) : cr.maxSt,
        fac: fac ? fac.value : cr.faculty,
        subjects: sb ? sb.value.split(',').map(function(s){return s.trim();}).filter(Boolean) : cr.subjects,
        desc: ds ? ds.value : cr.desc,
        curriculum: cu ? cu.value : cr.curriculum
      })
    });
    closeModal('modal-detail');
    toast('Course saved successfully!', '✅');
    await syncLMSData();
    loadPage('courses');
  } catch (err) {
    toast('Failed to save course: ' + err.message, '❌');
  }
};

window.openCreateCourseModal = function() {
  var cats = ['JEE','NEET','Commerce','Foundation'];
  var durs = ['1 Year','2 Years','6 Months','3 Months (Crash)'];
  var facs = ['Dr. Priya Mehta','Prof. Amit Singh','Mr. Raj Sharma','Dr. Kavya R.','Prof. Neha K.'];
  var body = '<div id="ccf-wrap">'
    + '<div class="inp-group"><label>Course Name <span style="color:var(--admin)">*</span></label><input class="inp-field" id="ccf-name" placeholder="e.g. JEE Advanced 2026"></div>'
    + '<div class="inp-row">'
    + '<div class="inp-group"><label>Category</label><select class="inp-field" id="ccf-cat">' + cats.map(function(o){return '<option>'+o+'</option>';}).join('') + '</select></div>'
    + '<div class="inp-group"><label>Duration</label><select class="inp-field" id="ccf-dur">' + durs.map(function(o){return '<option>'+o+'</option>';}).join('') + '</select></div>'
    + '</div>'
    + '<div class="inp-row">'
    + '<div class="inp-group"><label>Fee (₹)</label><input class="inp-field" id="ccf-fee" type="number" placeholder="e.g. 45000"></div>'
    + '<div class="inp-group"><label>Max Students</label><input class="inp-field" id="ccf-max" type="number" placeholder="e.g. 150"></div>'
    + '</div>'
    + '<div class="inp-group"><label>Lead Faculty</label><select class="inp-field" id="ccf-fac">' + facs.map(function(o){return '<option>'+o+'</option>';}).join('') + '</select></div>'
    + '<div class="inp-group"><label>Subjects (comma separated)</label><input class="inp-field" id="ccf-subs" placeholder="e.g. Physics, Chemistry, Mathematics"></div>'
    + '<div class="inp-group"><label>Description</label><textarea class="inp-field" id="ccf-desc" rows="3" placeholder="Course description..."></textarea></div>'
    + '<div class="inp-group"><label>Curriculum Overview</label><textarea class="inp-field" id="ccf-curr" rows="3" placeholder="Curriculum overview..."></textarea></div>'
    + '</div>';
  openDetail('🏗️ Create New Course', body,
    '<button class="btn btn-solid" onclick="submitCreateCourse()">🏗️ Create Course</button>');
};

async function submitCreateCourse() {
  var nm = document.getElementById('ccf-name');
  if (!nm || !nm.value.trim()) { toast('Course name is required!', '⚠️'); return; }
  
  var titleVal = nm.value.trim();
  var descVal = document.getElementById('ccf-desc').value;
  var facultyVal = document.getElementById('ccf-fac').value;
  var totalVal = parseInt(document.getElementById('ccf-max').value)||150;
  var feeVal = parseInt(document.getElementById('ccf-fee').value)||0;
  var catVal = document.getElementById('ccf-cat').value;
  var durVal = document.getElementById('ccf-dur').value;
  var subVal = document.getElementById('ccf-subs').value;
  var currVal = document.getElementById('ccf-curr').value;
  
  try {
    await api('/api/courses', {
      method: 'POST',
      body: JSON.stringify({
        title: titleVal,
        e: '📚',
        desc: descVal,
        fac: facultyVal,
        total: totalVal,
        fee: feeVal,
        cat: catVal,
        dur: durVal,
        subjects: subVal ? subVal.split(',').map(function(s){return s.trim();}).filter(Boolean) : [],
        curriculum: currVal
      })
    });
    closeModal('modal-detail');
    toast('Course "' + titleVal + '" created successfully!', '🏗️');
    await syncLMSData();
    loadPage('courses');
  } catch (err) {
    toast('Failed to create course: ' + err.message, '❌');
  }
}

// ── FEE DATABASE ──
var FEE_STUDENTS = [
  { n:'Sneha Patel',  roll:'RV2024002', course:'JEE Advanced (Main + KCET Decoded)', amount:45000, paid:45000, pending:0,    due:'Mar 1',  method:'UPI',   date:'Mar 12', st:'paid',    campus:'RV Rajajinagar' },
  { n:'Kavya Reddy',  roll:'RV2024015', course:'NEET UG Decoded',                   amount:38000, paid:38000, pending:0,    due:'Mar 1',  method:'Card',  date:'Mar 12', st:'paid',    campus:'RV Electronic City' },
  { n:'Aman Joshi',   roll:'RV2024010', course:'Commerce Decoded Programme',         amount:28000, paid:28000, pending:0,    due:'Mar 1',  method:'Cash',  date:'Mar 11', st:'paid',    campus:'RV Jayanagar' },
  { n:'Arjun Sharma', roll:'RV2024001', course:'JEE Advanced (Main + KCET Decoded)', amount:45000, paid:22500, pending:22500,due:'Mar 31', method:'—',     date:'—',      st:'pending', campus:'RV Jayanagar' },
  { n:'Rohan Gupta',  roll:'RV2024003', course:'JEE (Main + KCET Decoded)',          amount:30000, paid:15000, pending:15000,due:'Mar 20', method:'—',     date:'—',      st:'pending', campus:'RV Jayanagar' },
  { n:'Meera Shah',   roll:'RV2024008', course:'JEE Advanced (Main + KCET Decoded)', amount:45000, paid:30000, pending:15000,due:'Mar 10', method:'—',     date:'—',      st:'overdue', campus:'RV Rajajinagar' },
  { n:'Dev Verma',    roll:'RV2024020', course:'Commerce Decoded Programme',          amount:28000, paid:0,     pending:28000,due:'Mar 1',  method:'—',     date:'—',      st:'overdue', campus:'RV Rajajinagar' },
  { n:'Ravi Kumar',   roll:'RV2024012', course:'NEET UG Decoded',                   amount:38000, paid:19000, pending:19000,due:'Mar 15', method:'—',     date:'—',      st:'overdue', campus:'RV Electronic City' },
];
var FEE_COURSE_DATA = [
  { n:'JEE Advanced (Main + KCET Decoded)', students:142, fee:45000, collected:4230000, pending:375000, col:'#ff2d6b' },
  { n:'JEE (Main + KCET Decoded)',          students:98,  fee:30000, collected:2205000, pending:150000, col:'#6c47ff' },
  { n:'NEET UG Decoded',                    students:72,  fee:38000, collected:2166000, pending:190000, col:'#4ade80' },
  { n:'Commerce Decoded Programme',         students:56,  fee:28000, collected:1372000, pending:84000,  col:'#fbbf24' },
];
}
