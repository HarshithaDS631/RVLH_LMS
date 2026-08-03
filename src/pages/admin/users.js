// Module: PAGES['admin_users']
export function registerPage(PAGES) {
  PAGES['admin_users'] = function() {
  var students = window.ADMIN_STUDENTS || ADMIN_STUDENTS;
  var faculty   = window.ADMIN_FACULTY || ADMIN_FACULTY;
  var batches = [
    { n:'JEE Advanced (Main + KCET Decoded)', e:'⚛️', s:142, fac:'Dr. Priya Mehta',  col:'#ff2d6b', course:'JEE Advanced (Main + KCET Decoded)' },
    { n:'JEE (Main + KCET Decoded)',          e:'⚛️', s:98,  fac:'Dr. Priya Mehta',  col:'#6c47ff', course:'JEE (Main + KCET Decoded)' },
    { n:'NEET UG Decoded',                    e:'🔬', s:72,  fac:'Dr. Kavya R.',     col:'#4ade80', course:'NEET UG Decoded' },
    { n:'Commerce Decoded Programme',         e:'💼', s:56,  fac:'Multi-faculty',    col:'#fbbf24', course:'Commerce Decoded Programme' },
  ];

  // ── STUDENTS TAB ──
  var stHtml = '<div class="card">'
    + '<div style="display:flex;gap:8px;margin-bottom:13px;flex-wrap:wrap">'
    + '<input class="inp-field" id="st-search" placeholder="🔍 Search students..." style="flex:1;min-width:160px" oninput="filterStudentTable()">'
    + '<select class="inp-field" id="st-filter-course" style="width:220px" onchange="filterStudentTable()">'
    + '<option value="">All Courses</option>'
    + '<option>JEE Advanced (Main + KCET Decoded)</option>'
    + '<option>JEE (Main + KCET Decoded)</option>'
    + '<option>NEET UG Decoded</option>'
    + '<option>Commerce Decoded Programme</option>'
    + '</select>'
    + '<select class="inp-field" id="st-filter-campus" style="width:160px" onchange="filterStudentTable()">'
    + '<option value="">All Campuses</option>'
    + '<option>RV Jayanagar</option><option>RV Rajajinagar</option><option>RV Electronic City</option>'
    + '</select>'
    + '<button class="btn btn-red" onclick="openAddStudentModal()">➕ Add Student</button></div>'
    + '<div class="tbl-wrap"><table id="st-table"><thead><tr><th>Student</th><th>Roll No</th><th>Mail ID</th><th>Course</th><th>Campus</th><th>Fee</th><th>Status</th><th>Actions</th></tr></thead><tbody>'
    + students.map(function(s, idx) {
        const feeBadge = s.fee==='Paid'?'badge-green':s.fee==='Due'?'badge-yellow':'badge-red';
        const stBadge = s.st==='active'?'badge-teal':'badge-red';
        return '<tr data-name="' + s.n.toLowerCase() + '" data-course="' + s.course + '" data-campus="' + s.campus + '">'
          + '<td><div style="display:flex;align-items:center;gap:7px">' + makeAv(s.n.charAt(0), 'rgba(255,45,107,.1)') + '<div><div style="font-weight:600">' + s.n + '</div><div style="font-size:11px;color:var(--muted)">' + s.gender + ' • ' + s.mobile + '</div></div></div></td>'
          + '<td style="color:var(--muted)">' + s.roll + '</td>'
          + '<td style="color:var(--muted);font-size:12px">' + s.email + '</td>'
          + '<td>' + s.course + '</td>'
          + '<td style="font-size:12px">' + s.campus + '</td>'
          + '<td><span class="badge ' + feeBadge + '">' + s.fee + '</span></td>'
          + '<td><span class="badge ' + stBadge + '">' + s.st + '</span></td>'
          + '<td><div style="display:flex;gap:5px">'
          + '<button class="btn btn-sm btn-purple" onclick="event.stopPropagation();openStudentEditModal(' + idx + ')">✏️ Edit</button>'
          + '<button class="btn btn-sm btn-red" onclick="event.stopPropagation();deactivateStudent(' + idx + ',this)">🚫</button></div></td></tr>';
      }).join('') + '</tbody></table></div></div>';

  // ── FACULTY TAB ──
  var facHtml = '<div style="display:flex;gap:8px;margin-bottom:11px;flex-wrap:wrap">'
    + '<input class="inp-field" id="fac-search" placeholder="🔍 Search faculty..." style="flex:1;min-width:160px" oninput="filterFacultyTable()">'
    + '<select class="inp-field" id="fac-filter-sub" style="width:160px" onchange="filterFacultyTable()">'
    + '<option value="">All Subjects</option>'
    + '<option>Physics</option><option>Chemistry</option><option>Mathematics</option><option>Biology</option>'
    + '</select>'
    + '<select class="inp-field" id="fac-filter-course" style="width:220px" onchange="filterFacultyTable()">'
    + '<option value="">All Courses</option>'
    + '<option>JEE Advanced (Main + KCET Decoded)</option>'
    + '<option>JEE (Main + KCET Decoded)</option>'
    + '<option>NEET UG Decoded</option>'
    + '<option>Commerce Decoded Programme</option>'
    + '</select>'
    + '<button class="btn btn-teal" onclick="openAddFacultyModal()">➕ Add Faculty</button></div>'
    + '<div class="card"><div class="tbl-wrap"><table id="fac-table"><thead><tr><th>Faculty</th><th>Emp ID</th><th>Office Mail</th><th>Campus</th><th>Course</th><th>Subject</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead><tbody>'
    + faculty.map(function(f, idx) {
        return '<tr data-name="' + f.n.toLowerCase() + '" data-sub="' + f.sub + '" data-course="' + f.course + '">'
          + '<td><div style="display:flex;align-items:center;gap:7px">' + makeAv(f.n.charAt(0), 'rgba(0,212,200,.1)') + f.n + '</div></td>'
          + '<td style="color:var(--muted)">' + f.id + '</td>'
          + '<td style="color:var(--muted);font-size:12px">' + f.email + '</td>'
          + '<td style="font-size:12px">' + f.campus + '</td>'
          + '<td style="font-size:12px">' + f.course + '</td>'
          + '<td>' + f.sub + '</td>'
          + '<td><span style="color:var(--yellow);font-weight:700">⭐ ' + f.rat + '</span></td>'
          + '<td><span class="badge ' + (f.st==='active'?'badge-green':'badge-red') + '">' + f.st + '</span></td>'
          + '<td><div style="display:flex;gap:4px">'
          + '<button class="btn btn-sm btn-purple" onclick="event.stopPropagation();openFacultyEditModal(' + idx + ')">✏️</button>'
          + '<button class="btn btn-sm ' + (f.st==='active'?'btn-red':'btn-green') + '" id="fac-toggle-' + idx + '" onclick="event.stopPropagation();toggleFacultyStatus(' + idx + ')">' + (f.st==='active'?'Deactivate':'Activate') + '</button>'
          + '</div></td></tr>';
      }).join('') + '</tbody></table></div></div>';

  // ── BATCHES TAB ──
  var batHtml = '<div class="grid-2">' + batches.map(function(b) {
    return '<div class="card" style="border-color:color-mix(in srgb,' + b.col + ' 20%,var(--border))">'
      + '<div style="display:flex;gap:10px;align-items:center;margin-bottom:12px">'
      + '<div style="width:42px;height:42px;border-radius:10px;background:color-mix(in srgb,' + b.col + ' 10%,var(--surface2));display:flex;align-items:center;justify-content:center;font-size:22px">' + b.e + '</div>'
      + '<div><div style="font-weight:700;font-size:13px">' + b.n + '</div><div style="font-size:12px;color:var(--muted)">' + b.fac + '</div></div></div>'
      + '<div style="font-size:13px;color:var(--muted);margin-bottom:11px">👨‍🎓 ' + b.s + ' students enrolled</div>'
      + '<button class="btn btn-sm btn-teal" style="width:100%;justify-content:center" onclick="openBatchManageModal(\'' + b.course.replace(/'/g,"\\'") + '\',\'' + b.n.replace(/'/g,"\\'") + '\',\'' + b.col + '\',\'' + b.fac + '\')">📋 Manage Students</button></div>';
  }).join('') + '</div>';

  var _ut = window._usersTab||'st';
  return '<div class="inner-tabs">'
    + '<button class="itab'+(_ut!=='fa'&&_ut!=='ba'?' active':'')+'" onclick="itab(this,\'st\');window._usersTab=\'st\'">Students</button>'
    + '<button class="itab'+(_ut==='fa'?' active':'')+'" onclick="itab(this,\'fa\');window._usersTab=\'fa\'">Faculty</button>'
    + '<button class="itab'+(_ut==='ba'?' active':'')+'" onclick="itab(this,\'ba\');window._usersTab=\'ba\'">Batches</button>'
    + '</div>'
    + '<div data-tab="st"'+(_ut==='fa'||_ut==='ba'?' style="display:none"':'')+'>'+stHtml+'</div>'
    + '<div data-tab="fa"'+(_ut==='fa'?'':' style="display:none"')+'>'+facHtml+'</div>'
    + '<div data-tab="ba"'+(_ut==='ba'?'':' style="display:none"')+'>'+batHtml+'</div>';
};

// ── FILTER HELPERS ──
window.filterStudentTable = function() {
  var q = (document.getElementById('st-search')||{value:''}).value.toLowerCase();
  var fc = (document.getElementById('st-filter-course')||{value:''}).value;
  var fp = (document.getElementById('st-filter-campus')||{value:''}).value;
  var rows = document.querySelectorAll('#st-table tbody tr');
  rows.forEach(function(r) {
    var match = (!q || r.dataset.name.includes(q)) && (!fc || r.dataset.course===fc) && (!fp || r.dataset.campus===fp);
    r.style.display = match ? '' : 'none';
  });
}

window.filterFacultyTable = function() {
  var q  = (document.getElementById('fac-search')||{value:''}).value.toLowerCase();
  var fs = (document.getElementById('fac-filter-sub')||{value:''}).value;
  var fc = (document.getElementById('fac-filter-course')||{value:''}).value;
  var rows = document.querySelectorAll('#fac-table tbody tr');
  rows.forEach(function(r) {
    var match = (!q || r.dataset.name.includes(q)) && (!fs || r.dataset.sub===fs) && (!fc || r.dataset.course===fc);
    r.style.display = match ? '' : 'none';
  });
}

window.deactivateStudent = async function(idx, btn) {
  var s = window.ADMIN_STUDENTS[idx];
  try {
    const updated = await api('/api/auth/users/' + s._id + '/status', {
      method: 'PUT'
    });
    toast(updated.name + (updated.st === 'active' ? ' activated' : ' deactivated'), updated.st === 'active' ? 'OK' : 'X');
    window._usersTab = 'st';
    await syncLMSData();
    loadPage('users');
  } catch (err) {
    toast('Failed to change status: ' + err.message, '❌');
  }
}

window.toggleFacultyStatus = async function(idx) {
  var f = window.ADMIN_FACULTY[idx];
  try {
    const updated = await api('/api/auth/users/' + f._id + '/status', {
      method: 'PUT',
      body: JSON.stringify({
        st: f.st === 'active' ? 'inactive' : 'active'
      })
    });
    toast(updated.name + (updated.st === 'active' ? ' activated' : ' deactivated'), updated.st === 'active' ? 'OK' : 'X');
    window._usersTab = 'fa';
    await syncLMSData();
    loadPage('users');
  } catch (err) {
    toast('Failed to change status: ' + err.message, '❌');
  }
}

// ── BATCH MANAGE MODAL ──
window.removeStudentFromBatch = async function(roll) {
  var s = (window.ADMIN_STUDENTS || []).find(function(x){return x.roll===roll;});
  if (!s) return;
  if (!confirm('Are you sure you want to remove ' + s.n + ' from this batch?')) return;
  try {
    await api('/api/auth/users/' + s._id, {
      method: 'PUT',
      body: JSON.stringify({
        batch: '—'
      })
    });
    toast(s.n + ' removed from batch!', '✅');
    await syncLMSData();
    openBatchManageModal(window._batchCourse, window._batchName, window._batchCol, window._batchFac);
  } catch(err) {
    toast('Error: ' + err.message, '❌');
  }
};

window.addStudentToBatch = async function() {
  var rollSelect = document.getElementById('add-st-batch-sel');
  if (!rollSelect || !rollSelect.value) { toast('Select student!', '⚠️'); return; }
  var roll = rollSelect.value;
  var s = (window.ADMIN_STUDENTS || []).find(function(x){return x.roll===roll;});
  if (!s) return;
  try {
    await api('/api/auth/users/' + s._id, {
      method: 'PUT',
      body: JSON.stringify({
        batch: window._batchCourse
      })
    });
    toast(s.n + ' added to batch!', '✅');
    await syncLMSData();
    batchShowStudents();
  } catch(err) {
    toast('Error: ' + err.message, '❌');
  }
};

window.removeFacultyFromBatch = async function(empId) {
  var f = (window.ADMIN_FACULTY || []).find(function(x){return x.id===empId;});
  if (!f) return;
  if (!confirm('Are you sure you want to remove ' + f.n + ' from this batch?')) return;
  try {
    await api('/api/auth/users/' + f._id, {
      method: 'PUT',
      body: JSON.stringify({
        batch: '—'
      })
    });
    toast(f.n + ' removed from batch!', '✅');
    await syncLMSData();
    batchShowFaculty();
  } catch(err) {
    toast('Error: ' + err.message, '❌');
  }
};

window.addFacultyToBatch = async function() {
  var facSelect = document.getElementById('add-fac-batch-sel');
  if (!facSelect || !facSelect.value) { toast('Select faculty!', '⚠️'); return; }
  var empId = facSelect.value;
  var f = (window.ADMIN_FACULTY || []).find(function(x){return x.id===empId;});
  if (!f) return;
  try {
    await api('/api/auth/users/' + f._id, {
      method: 'PUT',
      body: JSON.stringify({
        batch: window._batchCourse
      })
    });
    toast(f.n + ' assigned to batch!', '✅');
    await syncLMSData();
    batchShowFaculty();
  } catch(err) {
    toast('Error: ' + err.message, '❌');
  }
};

window.openBatchManageModal = function(course, batchName, col, fac) {
  var enrolled = (window.ADMIN_STUDENTS || []).filter(function(s) { return s.course === course; });
  window._batchCourse = course; window._batchName = batchName; window._batchCol = col; window._batchFac = fac;
  var header = '<div style="display:flex;gap:9px;margin-bottom:14px;flex-wrap:wrap">'
    + '<div style="flex:1;min-width:110px;background:color-mix(in srgb,' + col + ' 8%,var(--surface2));border:1px solid color-mix(in srgb,' + col + ' 20%,transparent);border-radius:10px;padding:12px;text-align:center">'
    + '<div style="font-family:Syne,sans-serif;font-size:26px;font-weight:800;color:' + col + '">' + enrolled.length + '</div>'
    + '<div style="font-size:11px;color:var(--muted)">Students</div></div>'
    + '<div style="flex:1;min-width:110px;background:var(--surface2);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:12px;text-align:center">'
    + '<div style="font-size:12px;font-weight:600;margin-bottom:2px">' + fac + '</div>'
    + '<div style="font-size:11px;color:var(--muted)">Lead Faculty</div></div></div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">'
    + '<button class="btn btn-purple" onclick="batchShowStudents()">Manage Students</button>'
    + '<button class="btn btn-teal" onclick="batchShowFaculty()">Manage Faculty</button>'
    + '<button class="btn btn-yellow" onclick="batchExport()">Batch Report</button></div>';
  var rows = enrolled.length ? '<div class="tbl-wrap"><table><thead><tr><th>Student</th><th>Roll</th><th>Fee</th><th>Status</th><th>Action</th></tr></thead><tbody>'
    + enrolled.map(function(s){
        return '<tr><td style="font-weight:600">' + s.n + '</td><td style="color:var(--muted);font-size:12px">' + s.roll + '</td>'
          + '<td><span class="badge ' + (s.fee==='Paid'?'badge-green':s.fee==='Due'?'badge-yellow':'badge-red') + '">' + s.fee + '</span></td>'
          + '<td><span class="badge ' + (s.st==='active'?'badge-teal':'badge-red') + '">' + s.st + '</span></td>'
          + '<td><button class="btn btn-sm btn-red" onclick="removeStudentFromBatch(\'' + s.roll + '\')">Remove</button></td></tr>';
      }).join('') + '</tbody></table></div>'
    : '<div style="text-align:center;padding:20px;color:var(--muted)">No students enrolled yet.</div>';
  openDetail('Manage: ' + batchName, header + rows,
    '<button class="btn btn-purple" onclick="openAddStudentModal();closeModal(\'modal-detail\')">Add Student</button>');
};

window.batchShowStudents = function() {
  var enrolled = (window.ADMIN_STUDENTS || []).filter(function(s){return s.course===window._batchCourse;});
  var body = '<div style="margin-bottom:12px;font-weight:700">Enrolled Students</div>'
    + (enrolled.length ? '<div class="tbl-wrap"><table><thead><tr><th>Name</th><th>Roll</th><th>Action</th></tr></thead><tbody>'
      + enrolled.map(function(s){return '<tr><td>'+s.n+'</td><td style="color:var(--muted)">'+s.roll+'</td><td><button class="btn btn-sm btn-red" onclick="removeStudentFromBatch(\''+s.roll+'\')">Remove</button></td></tr>';}).join('')
      + '</tbody></table></div>' : '<p style="color:var(--muted)">No students.</p>')
    + '<div style="margin-top:14px;font-weight:700;margin-bottom:8px">Add Student</div>'
    + '<div style="display:flex;gap:8px"><select class="inp-field" id="add-st-batch-sel" style="flex:1">'
    + '<option value="">-- Select student --</option>'
    + (window.ADMIN_STUDENTS || []).map(function(s){return '<option value="'+s.roll+'">'+s.n+' ('+s.roll+')</option>';}).join('')
    + '</select><button class="btn btn-green" onclick="addStudentToBatch()">Add</button></div>';
  document.getElementById('detail-body').innerHTML = body;
};

window.batchShowFaculty = function() {
  var assigned = (window.ADMIN_FACULTY || []).filter(function(f){return f.course===window._batchCourse;});
  var body = '<div style="margin-bottom:12px;font-weight:700">Assigned Faculty</div>'
    + (assigned.length ? '<div class="tbl-wrap"><table><thead><tr><th>Name</th><th>Subject</th><th>Action</th></tr></thead><tbody>'
      + assigned.map(function(f){return '<tr><td>'+f.n+'</td><td>'+f.sub+'</td><td><button class="btn btn-sm btn-red" onclick="removeFacultyFromBatch(\''+f.id+'\')">Remove</button></td></tr>';}).join('')
      + '</tbody></table></div>' : '<p style="color:var(--muted)">No faculty assigned.</p>')
    + '<div style="margin-top:14px;font-weight:700;margin-bottom:8px">Assign Faculty</div>'
    + '<div style="display:flex;gap:8px"><select class="inp-field" id="add-fac-batch-sel" style="flex:1">'
    + '<option value="">-- Select faculty --</option>'
    + (window.ADMIN_FACULTY || []).map(function(f){return '<option value="'+f.id+'">'+f.n+' ('+f.sub+')</option>';}).join('')
    + '</select><button class="btn btn-teal" onclick="addFacultyToBatch()">Assign</button></div>';
  document.getElementById('detail-body').innerHTML = body;
};

window.batchExport = function() {
  var students = (window.ADMIN_STUDENTS || []).filter(function(s){return s.course===window._batchCourse;});
  var rows = ['Name,Roll No,Email,Campus,Fee Status,Status'].concat(students.map(function(s){return [s.n,s.roll,s.email,s.campus,s.fee,s.st].join(',');}));
  var blob = new Blob([rows.join('\n')],{type:'text/csv'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download=(window._batchName||'batch')+'_students.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  toast('Student list exported!','OK');
};

window.openStudentEditModal = function(idx) {
  var s = window.ADMIN_STUDENTS[idx];
  var body = '<div class="inp-row">'
    + '<div class="inp-group"><label>First Name</label><input class="inp-field" id="se-fn" value="' + s.n.split(' ')[0] + '"></div>'
    + '<div class="inp-group"><label>Last Name</label><input class="inp-field" id="se-ln" value="' + (s.n.split(' ')[1]||'') + '"></div>'
    + '</div><div class="inp-row">'
    + '<div class="inp-group"><label>Mail ID</label><input class="inp-field" id="se-email" type="email" value="' + s.email + '"></div>'
    + '<div class="inp-group"><label>Student ID (Roll)</label><input class="inp-field" id="se-roll" value="' + s.roll + '"></div>'
    + '</div><div class="inp-row">'
    + '<div class="inp-group"><label>Mobile Number</label><input class="inp-field" id="se-mobile" type="tel" value="' + s.mobile + '"></div>'
    + '<div class="inp-group"><label>Gender</label><select class="inp-field" id="se-gender"><option' + (s.gender==='Male'?' selected':'') + '>Male</option><option' + (s.gender==='Female'?' selected':'') + '>Female</option><option' + (s.gender==='Other'?' selected':'') + '>Other</option></select></div>'
    + '</div>'
    + '<div class="inp-group"><label>Course</label><select class="inp-field" id="se-course">'
    + ['JEE Advanced (Main + KCET Decoded)','JEE (Main + KCET Decoded)','NEET UG Decoded','Commerce Decoded Programme'].map(function(c) { return '<option' + (s.course===c?' selected':'') + '>' + c + '</option>'; }).join('')
    + '</select></div>'
    + '<div class="inp-row">'
    + '<div class="inp-group"><label>Campus</label><select class="inp-field" id="se-campus">'
    + ['RV Jayanagar','RV Rajajinagar','RV Electronic City'].map(function(c) { return '<option' + (s.campus===c?' selected':'') + '>' + c + '</option>'; }).join('')
    + '</select></div>'
    + '<div class="inp-group"><label>Fee Status</label><select class="inp-field" id="se-fee"><option' + (s.fee==='Paid'?' selected':'') + '>Paid</option><option' + (s.fee==='Due'?' selected':'') + '>Due</option><option' + (s.fee==='Overdue'?' selected':'') + '>Overdue</option></select></div>'
    + '</div>';
  openDetail('✏️ Edit Student — ' + s.n, body,
    '<button class="btn btn-solid" onclick="saveStudentEdit(' + idx + ')">💾 Save Changes</button>'
  );
}

window.saveStudentEdit = async function(idx) {
  var s = window.ADMIN_STUDENTS[idx];
  var n = (document.getElementById('se-fn').value + ' ' + document.getElementById('se-ln').value).trim();
  var email = document.getElementById('se-email').value;
  var roll = document.getElementById('se-roll').value;
  var mobile = document.getElementById('se-mobile').value;
  var gender = document.getElementById('se-gender').value;
  var course = document.getElementById('se-course').value;
  var campus = document.getElementById('se-campus').value;
  var fee = document.getElementById('se-fee').value;
  
  try {
    await api('/api/auth/users/' + s._id, {
      method: 'PUT',
      body: JSON.stringify({
        name: n,
        email: email,
        roll: roll,
        phone: mobile,
        gender: gender,
        batch: course,
        campus: campus,
        feeStatus: fee,
        feeAmount: fee === 'Paid' ? 45000 : s.feeAmount,
        feePaid: fee === 'Paid' ? s.feeAmount : s.feePaid,
        feePending: fee === 'Paid' ? 0 : s.feePending
      })
    });
    closeModal('modal-detail');
    toast('Student updated successfully!', '✅');
    await syncLMSData();
    loadPage('users');
  } catch (err) {
    toast('Failed to update student: ' + err.message, '❌');
  }
}

window.openAddStudentModal = function() {
  var body = '<div class="inp-row">'
    + '<div class="inp-group"><label>First Name</label><input class="inp-field" id="add-st-fn" placeholder="e.g. Arjun"></div>'
    + '<div class="inp-group"><label>Last Name</label><input class="inp-field" id="add-st-ln" placeholder="e.g. Sharma"></div>'
    + '</div><div class="inp-row">'
    + '<div class="inp-group"><label>Mail ID</label><input class="inp-field" id="add-st-email" type="email" placeholder="student@email.com"></div>'
    + '<div class="inp-group"><label>Student ID (Roll)</label><input class="inp-field" id="add-st-roll" placeholder="e.g. RV2024099"></div>'
    + '</div><div class="inp-row">'
    + '<div class="inp-group"><label>Mobile Number</label><input class="inp-field" id="add-st-mobile" type="tel" placeholder="+91 XXXXX XXXXX"></div>'
    + '<div class="inp-group"><label>Gender</label><select class="inp-field" id="add-st-gender"><option>Male</option><option>Female</option><option>Other</option></select></div>'
    + '</div>'
    + '<div class="inp-group"><label>Course</label><select class="inp-field" id="add-st-course">'
    + '<option>JEE Advanced (Main + KCET Decoded)</option><option>JEE (Main + KCET Decoded)</option><option>NEET UG Decoded</option><option>Commerce Decoded Programme</option>'
    + '</select></div>'
    + '<div class="inp-row">'
    + '<div class="inp-group"><label>Campus</label><select class="inp-field" id="add-st-campus"><option>RV Jayanagar</option><option>RV Rajajinagar</option><option>RV Electronic City</option></select></div>'
    + '<div class="inp-group"><label>Target Year</label><select class="inp-field" id="add-st-year"><option>2025</option><option>2026</option><option>2027</option></select></div>'
    + '</div>'
    + '<div style="border-top:1px solid var(--border);padding-top:13px;margin-top:4px">'
    + '<div style="font-size:12px;font-weight:700;color:var(--admin);margin-bottom:10px;display:flex;align-items:center;gap:6px">🔑 Create Login Password</div>'
    + '<div class="inp-row">'
    + '<div class="inp-group"><label>Password</label><div style="position:relative"><input type="password" class="inp-field" id="add-st-pass" placeholder="Min 8 • 1 Uppercase • 1 Special" style="padding-right:38px" oninput="validateStPass()"><button type="button" onclick="toggleFieldPw(\'add-st-pass\',\'toggle-st-pw\')" id="toggle-st-pw" style="position:absolute;right:9px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:15px;color:var(--muted)">👁️</button></div>'
    + '<div id="st-pass-hint" style="font-size:10px;margin-top:4px;color:var(--muted)">Min 8 chars • 1 uppercase • 1 special character</div></div>'
    + '<div class="inp-group"><label>Confirm Password</label><div style="position:relative"><input type="password" class="inp-field" id="add-st-cpass" placeholder="Re-enter password" style="padding-right:38px"><button type="button" onclick="toggleFieldPw(\'add-st-cpass\',\'toggle-st-cpw\')" id="toggle-st-cpw" style="position:absolute;right:9px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:15px;color:var(--muted)">👁️</button></div></div>'
    + '</div></div>';
  openDetail('➕ Add New Student', body, '<button class="btn btn-solid" onclick="submitAddStudent()">✅ Add Student</button>');
}

window.validateStPass = function() {
  var pw = (document.getElementById('add-st-pass')||{}).value||'';
  var ok = pw.length>=8 && /[A-Z]/.test(pw) && /[^a-zA-Z0-9]/.test(pw);
  var hint = document.getElementById('st-pass-hint');
  if (hint) { hint.textContent = ok ? '✅ Password meets requirements' : 'Min 8 chars • 1 uppercase • 1 special character'; hint.style.color = ok ? 'var(--student)' : 'var(--muted)'; }
}

window.submitAddStudent = async function() {
  var pw = (document.getElementById('add-st-pass')||{}).value||'';
  var cpw = (document.getElementById('add-st-cpass')||{}).value||'';
  if (pw.length<8 || !/[A-Z]/.test(pw) || !/[^a-zA-Z0-9]/.test(pw)) { toast('Password must be min 8 chars, 1 uppercase, 1 special character','⚠️'); return; }
  if (pw !== cpw) { toast('Passwords do not match','⚠️'); return; }
  
  var firstName = document.getElementById('add-st-fn').value.trim();
  var lastName = document.getElementById('add-st-ln').value.trim();
  var email = document.getElementById('add-st-email').value.trim();
  var roll = document.getElementById('add-st-roll').value.trim();
  var phone = document.getElementById('add-st-mobile').value.trim();
  var gender = document.getElementById('add-st-gender').value;
  var course = document.getElementById('add-st-course').value;
  var campus = document.getElementById('add-st-campus').value;

  if (!firstName || !lastName || !email) { toast('First Name, Last Name, and Email are required!','⚠️'); return; }
  
  try {
    await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: firstName + ' ' + lastName,
        email: email,
        phone: phone,
        password: pw,
        role: 'student',
        roll: roll,
        batch: course,
        campus: campus,
        gender: gender,
        feeStatus: 'Paid',
        feeAmount: 45000,
        feePaid: 0,
        feePending: 45000
      })
    });
    toast('Student added successfully!','✅');
    closeModal('modal-detail');
    await syncLMSData();
    loadPage('users');
  } catch (err) {
    toast('Failed to add student: ' + err.message, '❌');
  }
}

window.openFacultyEditModal = function(idx) {
  var f = window.ADMIN_FACULTY[idx];
  var body = '<div class="inp-row">'
    + '<div class="inp-group"><label>First Name</label><input class="inp-field" id="fe-fn" value="' + f.n.split(' ').slice(0,-1).join(' ') + '"></div>'
    + '<div class="inp-group"><label>Last Name</label><input class="inp-field" id="fe-ln" value="' + (f.n.split(' ').slice(-1)[0]||'') + '"></div>'
    + '</div><div class="inp-row">'
    + '<div class="inp-group"><label>Office Mail ID</label><input class="inp-field" id="fe-email" type="email" value="' + f.email + '"></div>'
    + '<div class="inp-group"><label>Faculty ID</label><input class="inp-field" id="fe-id" value="' + f.id + '"></div>'
    + '</div><div class="inp-row">'
    + '<div class="inp-group"><label>Mobile Number</label><input class="inp-field" id="fe-mobile" type="tel" placeholder="+91 XXXXX XXXXX"></div>'
    + '<div class="inp-group"><label>Gender</label><select class="inp-field" id="fe-gender"><option>Male</option><option>Female</option><option>Other</option></select></div>'
    + '</div>'
    + '<div class="inp-group"><label>Subject</label><select class="inp-field" id="fe-sub">'
    + ['Physics','Chemistry','Mathematics','Biology','Commerce','Accountancy'].map(function(s){ return '<option' + (f.sub===s?' selected':'') + '>' + s + '</option>'; }).join('')
    + '</select></div>'
    + '<div class="inp-group"><label>Course</label><select class="inp-field" id="fe-course">'
    + ['JEE Advanced (Main + KCET Decoded)','JEE (Main + KCET Decoded)','NEET UG Decoded','Commerce Decoded Programme'].map(function(c){ return '<option' + (f.course===c?' selected':'') + '>' + c + '</option>'; }).join('')
    + '</select></div>'
    + '<div class="inp-group"><label>Campus</label><select class="inp-field" id="fe-campus">'
    + ['RV Jayanagar','RV Rajajinagar','RV Electronic City'].map(function(c){ return '<option' + (f.campus===c?' selected':'') + '>' + c + '</option>'; }).join('')
    + '</select></div>';
  openDetail('✏️ Edit Faculty — ' + f.n, body,
    '<button class="btn btn-solid" onclick="saveFacultyEdit(' + idx + ')">💾 Save Changes</button>'
  );
}

window.saveFacultyEdit = async function(idx) {
  var f = window.ADMIN_FACULTY[idx];
  var fn = document.getElementById('fe-fn').value;
  var ln = document.getElementById('fe-ln').value;
  var n = (fn + ' ' + ln).trim();
  var email = document.getElementById('fe-email').value;
  var emp = document.getElementById('fe-id').value;
  var mobile = document.getElementById('fe-mobile').value;
  var gender = document.getElementById('fe-gender').value;
  var subject = document.getElementById('fe-sub').value;
  var course = document.getElementById('fe-course').value;
  var campus = document.getElementById('fe-campus').value;
  
  try {
    await api('/api/auth/users/' + f._id, {
      method: 'PUT',
      body: JSON.stringify({
        name: n,
        email: email,
        emp: emp,
        phone: mobile,
        gender: gender,
        subject: subject,
        batch: course,
        campus: campus
      })
    });
    closeModal('modal-detail');
    toast('Faculty updated successfully!', '✅');
    await syncLMSData();
    loadPage('users');
  } catch (err) {
    toast('Failed to update faculty: ' + err.message, '❌');
  }
}

window.openAddFacultyModal = function() {
  var body = '<div class="inp-row">'
    + '<div class="inp-group"><label>First Name</label><input class="inp-field" id="add-fac-fn" placeholder="e.g. Dr. Priya"></div>'
    + '<div class="inp-group"><label>Last Name</label><input class="inp-field" id="add-fac-ln" placeholder="e.g. Mehta"></div>'
    + '</div><div class="inp-row">'
    + '<div class="inp-group"><label>Office Mail ID</label><input class="inp-field" id="add-fac-email" type="email" placeholder="faculty@rvhub.com"></div>'
    + '<div class="inp-group"><label>Faculty ID</label><input class="inp-field" id="add-fac-emp" placeholder="e.g. RVF005"></div>'
    + '</div><div class="inp-row">'
    + '<div class="inp-group"><label>Mobile Number</label><input class="inp-field" id="add-fac-mobile" type="tel" placeholder="+91 XXXXX XXXXX"></div>'
    + '<div class="inp-group"><label>Gender</label><select class="inp-field" id="add-fac-gender"><option>Male</option><option>Female</option><option>Other</option></select></div>'
    + '</div>'
    + '<div class="inp-group"><label>Subject</label><select class="inp-field" id="add-fac-sub"><option>Physics</option><option>Chemistry</option><option>Mathematics</option><option>Biology</option><option>Commerce</option><option>Accountancy</option></select></div>'
    + '<div class="inp-group"><label>Course</label><select class="inp-field" id="add-fac-course"><option>JEE Advanced (Main + KCET Decoded)</option><option>JEE (Main + KCET Decoded)</option><option>NEET UG Decoded</option><option>Commerce Decoded Programme</option></select></div>'
    + '<div class="inp-group"><label>Campus</label><select class="inp-field" id="add-fac-campus"><option>RV Jayanagar</option><option>RV Rajajinagar</option><option>RV Electronic City</option></select></div>'
    + '<div style="border-top:1px solid var(--border);padding-top:13px;margin-top:4px">'
    + '<div style="font-size:12px;font-weight:700;color:var(--faculty);margin-bottom:10px;display:flex;align-items:center;gap:6px">🔑 Create Login Password</div>'
    + '<div class="inp-row">'
    + '<div class="inp-group"><label>Password</label><div style="position:relative"><input type="password" class="inp-field" id="add-fac-pass" placeholder="Min 8 • 1 Uppercase • 1 Special" style="padding-right:38px" oninput="validateFacPass()"><button type="button" onclick="toggleFieldPw(\'add-fac-pass\',\'toggle-fac-pw\')" id="toggle-fac-pw" style="position:absolute;right:9px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:15px;color:var(--muted)">👁️</button></div>'
    + '<div id="fac-pass-hint" style="font-size:10px;margin-top:4px;color:var(--muted)">Min 8 chars • 1 uppercase • 1 special character</div></div>'
    + '<div class="inp-group"><label>Confirm Password</label><div style="position:relative"><input type="password" class="inp-field" id="add-fac-cpass" placeholder="Re-enter password" style="padding-right:38px"><button type="button" onclick="toggleFieldPw(\'add-fac-cpass\',\'toggle-fac-cpw\')" id="toggle-fac-cpw" style="position:absolute;right:9px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:15px;color:var(--muted)">👁️</button></div></div>'
    + '</div>'
    + '<div style="font-size:11px;color:var(--muted);margin-top:4px">💡 Faculty will receive login credentials via email and can update their password from profile settings.</div>'
    + '</div>';
  openDetail('👨‍🏫 Add New Faculty', body, '<button class="btn btn-solid" onclick="submitAddFaculty()">✅ Add Faculty</button>');
}

window.validateFacPass = function() {
  var pw = (document.getElementById('add-fac-pass')||{}).value||'';
  var ok = pw.length>=8 && /[A-Z]/.test(pw) && /[^a-zA-Z0-9]/.test(pw);
  var hint = document.getElementById('fac-pass-hint');
  if (hint) { hint.textContent = ok ? '✅ Password meets requirements' : 'Min 8 chars • 1 uppercase • 1 special character'; hint.style.color = ok ? 'var(--faculty)' : 'var(--muted)'; }
}

window.submitAddFaculty = async function() {
  var pw = (document.getElementById('add-fac-pass')||{}).value||'';
  var cpw = (document.getElementById('add-fac-cpass')||{}).value||'';
  if (pw.length<8 || !/[A-Z]/.test(pw) || !/[^a-zA-Z0-9]/.test(pw)) { toast('Password must be min 8 chars, 1 uppercase, 1 special character','⚠️'); return; }
  if (pw !== cpw) { toast('Passwords do not match','⚠️'); return; }
  
  var firstName = document.getElementById('add-fac-fn').value.trim();
  var lastName = document.getElementById('add-fac-ln').value.trim();
  var email = document.getElementById('add-fac-email').value.trim();
  var emp = document.getElementById('add-fac-emp').value.trim();
  var phone = document.getElementById('add-fac-mobile').value.trim();
  var gender = document.getElementById('add-fac-gender').value;
  var subject = document.getElementById('add-fac-sub').value;
  var course = document.getElementById('add-fac-course').value;
  var campus = document.getElementById('add-fac-campus').value;

  if (!firstName || !lastName || !email) { toast('First Name, Last Name, and Email are required!','⚠️'); return; }
  
  try {
    await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: firstName + ' ' + lastName,
        email: email,
        phone: phone,
        password: pw,
        role: 'faculty',
        emp: emp,
        subject: subject,
        batch: course,
        campus: campus,
        gender: gender
      })
    });
    toast('Faculty member added successfully!','✅');
    closeModal('modal-detail');
    await syncLMSData();
    loadPage('users');
  } catch (err) {
    toast('Failed to add faculty: ' + err.message, '❌');
  }
}

// ── COURSE DATABASE ──
var COURSE_DB = [
  { id:1, n:'JEE Advanced (Main + KCET Decoded)', e:'⚛️', cat:'JEE',      dur:'2 Years',   fee:45000, maxSt:150, enrolled:142, pub:true,  col:'#ff2d6b',
    faculty:'Dr. Priya Mehta',  desc:'Comprehensive 2-year program covering full JEE Advanced + Mains syllabus with KCET integration.',
    subjects:['Physics','Chemistry','Mathematics'], curriculum:'Chapter-wise DPPs, weekly tests, mock series, dedicated doubt sessions.' },
  { id:2, n:'JEE (Main + KCET Decoded)',           e:'⚛️', cat:'JEE',      dur:'1 Year',    fee:30000, maxSt:150, enrolled:98,  pub:true,  col:'#6c47ff',
    faculty:'Prof. Amit Singh', desc:'Focused 1-year JEE Mains preparation with KCET decoded strategy.',
    subjects:['Physics','Chemistry','Mathematics'], curriculum:'Subject-wise modules, weekly mocks, previous year papers.' },
  { id:3, n:'NEET UG Decoded',                     e:'🔬', cat:'NEET',     dur:'1 Year',    fee:38000, maxSt:120, enrolled:72,  pub:true,  col:'#4ade80',
    faculty:'Dr. Kavya R.',    desc:'Complete NEET UG preparation covering Biology, Physics & Chemistry.',
    subjects:['Biology','Physics','Chemistry'], curriculum:'NCERT-based modules, MCQ practice, full mock tests.' },
  { id:4, n:'Commerce Decoded Programme',          e:'💼', cat:'Commerce', dur:'1 Year',    fee:28000, maxSt:100, enrolled:56,  pub:true,  col:'#fbbf24',
    faculty:'Prof. Neha K.',   desc:'XI & XII Commerce covering Accountancy, Economics, Business Studies.',
    subjects:['Accountancy','Economics','Business Studies','Mathematics'], curriculum:'Board + competitive exam focus, case studies.' },
  { id:5, n:'NEET Biology Special',                e:'🧬', cat:'NEET',     dur:'6 Months',  fee:12000, maxSt:80,  enrolled:0,   pub:false, col:'#00d4c8',
    faculty:'Dr. Kavya R.',    desc:'Intensive Biology revision for NEET aspirants.',
    subjects:['Biology'], curriculum:'Topic-wise revision, high-yield MCQs, previous year analysis.' },
];
}
