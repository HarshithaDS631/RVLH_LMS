// Module: PAGES['admin_fees']
export function registerPage(PAGES) {
  PAGES['admin_fees'] = function() {
  var totalCollected = FEE_STUDENTS.filter(function(s){return s.st==='paid';}).reduce(function(a,s){return a+s.paid;},0);
  var totalRevenue   = FEE_COURSE_DATA.reduce(function(a,c){return a+c.collected;},0);
  var annualRevenue  = totalRevenue;
  var totalPending   = FEE_STUDENTS.filter(function(s){return s.st!=='paid';}).reduce(function(a,s){return a+s.pending;},0);
  var totalOverdue   = FEE_STUDENTS.filter(function(s){return s.st==='overdue';}).reduce(function(a,s){return a+s.pending;},0);

  function fmt(n){return '₹'+n.toLocaleString('en-IN');}

  // 1. Stats Grid (5 KPI Cards)
  var stats = '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:20px">'
    + [
      { icon:'🪙', val:fmt(totalCollected), label:'Fees Collected', col:'#4ade80' },
      { icon:'📈', val:fmt(totalRevenue),   label:'Total Revenue',   col:'#fbbf24' },
      { icon:'📅', val:fmt(annualRevenue),  label:'Annual Revenue',  col:'#6c47ff' },
      { icon:'⏳', val:fmt(totalPending),   label:'Fees Pending',   col:'#fb923c' },
      { icon:'⚠️', val:fmt(totalOverdue),   label:'Overdue',        col:'#ff2d6b' }
    ].map(function(s) {
      return '<div class="stat-card" style="border-color:color-mix(in srgb,' + s.col + ' 28%,var(--border))">'
        + '<div class="stat-icon" style="background:color-mix(in srgb,' + s.col + ' 10%,var(--surface2));color:' + s.col + '">' + s.icon + '</div>'
        + '<div class="stat-val" style="font-size:18px;color:' + s.col + ';font-weight:800;font-family:Syne,sans-serif;background:none;-webkit-text-fill-color:' + s.col + ';text-fill-color:' + s.col + '">' + s.val + '</div>'
        + '<div class="stat-label" style="font-size:11px;color:var(--muted)">' + s.label + '</div></div>';
    }).join('') + '</div>';

  // 2. Tabs (4 Filter Tabs + Record Payment Button)
  var activeTab = window._activeFeeTab || 'all';
  window._activeFeeTab = activeTab;
  
  var tabs = '<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">'
    + [
      ['all','All'],
      ['collected','💳 Collected'],
      ['pending','⏳ Pending'],
      ['overdue','⚠️ Overdue']
    ].map(function(t) {
        var active = t[0]===activeTab;
        return '<button class="btn btn-sm" id="ftab-'+t[0]+'" onclick="switchFeeTab(\''+t[0]+'\')" style="'+(active?'background:var(--admin);color:#fff;':'')+'">'+t[1]+'</button>';
      }).join('')
    + '<button class="btn btn-sm btn-teal" onclick="openRecordPaymentModal()" style="margin-left:auto; display:flex; align-items:center; gap:5px">+ Record Payment</button>'
    + '</div>';

  // Course Filter Dropdown
  var feeCourseFilter = window._feeCourseFilter || '';
  window._feeCourseFilter = feeCourseFilter;
  var feeCoursesList = [''].concat(FEE_STUDENTS.map(function(s){return s.course;}).filter(function(v,i,a){return a.indexOf(v)===i;}));
  var courseFilterHtml = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">'
    + '<label style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;white-space:nowrap">Filter by Course:</label>'
    + '<select class="inp-field" style="max-width:280px;height:34px;padding:4px 10px;" id="fee-course-filter" onchange="window._feeCourseFilter=this.value;window.renderFeeTableBody()">'
    + feeCoursesList.map(function(fc){return '<option value="'+fc+'"'+(feeCourseFilter===fc?' selected':'')+'>'
        +(fc?fc.replace(' (Main + KCET Decoded)','').replace(' Decoded','').replace(' Programme',''):'All Courses')+'</option>';}).join('')
    + '</select>'
    + '</div>';

  // 3. Students Table
  var tableHtml = '<div class="card"><div class="card-header"><div class="card-title" id="fee-table-title">💳 Fee Details — All Students</div>'
    + '<button class="btn btn-sm btn-purple" onclick="exportFeeData()">⬇ Export</button></div>'
    + courseFilterHtml
    + '<div class="tbl-wrap"><table id="fee-student-table"><thead><tr><th>STUDENT</th><th>COURSE</th><th>TOTAL FEE</th><th>PAID</th><th>PENDING</th><th>DUE DATE</th><th>PAYMENT MODE</th><th>TYPE</th><th>STATUS</th><th>ACTIONS</th></tr></thead>'
    + '<tbody id="fee-tbody"></tbody></table></div></div>';

  // 4. Fee by Course Table
  var courseTable = '<div class="card" style="margin-top:16px"><div class="card-header"><div class="card-title">📊 Fee Collection by Course</div></div>'
    + '<div class="tbl-wrap"><table><thead><tr><th>COURSE</th><th>STUDENTS</th><th>FEE/STUDENT</th><th>COLLECTED</th><th>PENDING</th><th>% COLLECTED</th><th>DOWNLOAD</th></tr></thead><tbody>'
    + FEE_COURSE_DATA.map(function(cd) {
        var totalPossible = cd.collected + cd.pending;
        var pct = totalPossible > 0 ? Math.round(cd.collected / totalPossible * 100) : 0;
        return '<tr>'
          + '<td><div style="display:flex;align-items:center;gap:7px"><div style="width:10px;height:10px;border-radius:50%;background:'+cd.col+'"></div><span style="font-weight:600;font-size:12px">'+cd.n.replace(' (Main + KCET Decoded)','').replace(' Decoded','').replace(' Programme','')+'</span></div></td>'
          + '<td><span style="font-weight:700;color:var(--purple)">'+cd.students+'</span></td>'
          + '<td style="font-weight:600">'+fmt(cd.fee)+'</td>'
          + '<td style="color:#4ade80;font-weight:600">'+fmt(cd.collected)+'</td>'
          + '<td style="color:#ff2d6b;font-weight:600">'+fmt(cd.pending)+'</td>'
          + '<td><div style="display:flex;align-items:center;gap:7px;min-width:140px"><div style="flex:1;height:6px;background:var(--surface2);border-radius:3px"><div style="height:6px;border-radius:3px;background:'+cd.col+';width:'+pct+'%"></div></div><span style="font-size:12px;font-weight:700">'+pct+'%</span></div></td>'
          + '<td><button class="btn btn-sm btn-purple" onclick="downloadCourseData(\''+cd.n.replace(/'/g,"\\'")+'\')" title="Download '+cd.n+' fee data">⬇ CSV</button></td>'
          + '</tr>';
      }).join('') + '</tbody></table></div></div>';

  // Trigger content render on tick
  setTimeout(function() {
    window.renderFeeTableBody();
  }, 50);

  return stats + tabs + tableHtml + courseTable;
};

// Global Row Builder
function getFeeRowHtml(s, idx) {
  function fmt(n){return '₹'+n.toLocaleString('en-IN');}
  var payType = s.payType || (s.st==='paid' ? (idx===0 ? 'materials' : 'course') : '—');
  var modeIcon = s.method==='UPI'?'📲':s.method==='Card'?'💳':s.method==='Cash'?'💵':s.method==='Net Banking'?'🏦':'—';
  var isPaid = s.st==='paid';
  
  var statusClass = s.st==='paid' ? 'badge-green' : s.st==='pending' ? 'badge-yellow' : 'badge-red';
  var statusLabel = s.st.charAt(0).toUpperCase() + s.st.slice(1);

  return '<tr>'
    + '<td><div style="font-weight:600">' + s.n + '</div><div style="font-size:11px;color:var(--muted)">' + s.roll + '</div></td>'
    + '<td style="font-size:12px">' + s.course.replace(' (Main + KCET Decoded)','').replace(' Decoded','').replace(' Programme','') + '</td>'
    + '<td style="font-weight:600">' + fmt(s.amount) + '</td>'
    + '<td style="color:#4ade80;font-weight:600">' + fmt(s.paid) + '</td>'
    + '<td style="font-weight:600">' + (s.pending > 0 ? fmt(s.pending) : '<span style="color:var(--muted)">—</span>') + '</td>'
    + '<td style="font-size:12px">' + s.due + '</td>'
    + '<td style="font-size:12px">' + (s.method && s.method !== '—' ? modeIcon + ' ' + s.method : '<span style="color:var(--muted)">—</span>') + '</td>'
    + '<td>' + (payType !== '—' ? '<span class="badge ' + (payType==='course'?'badge-purple':'badge-teal') + '">' + (payType==='course'?'Course':'Materials') + '</span>' : '<span style="color:var(--muted);font-size:12px">—</span>') + '</td>'
    + '<td><span class="badge ' + statusClass + '">' + statusLabel + '</span></td>'
    + '<td><div style="display:flex;gap:5px">'
    + (isPaid
        ? '<button class="btn btn-sm btn-teal" onclick="openFeeReceiptModal('+idx+')">🧾 Receipt</button>'
        : '<button class="btn btn-sm btn-red" onclick="openFeeReminderModal(\''+s.n+'\',\''+fmt(s.pending)+'\')">📨 Remind</button>')
    + '</div></td></tr>';
}

window.renderFeeTableBody = function() {
  var tab = window._activeFeeTab || 'all';
  var courseFilter = window._feeCourseFilter || '';
  var students = window.FEE_STUDENTS || FEE_STUDENTS;
  
  // 1. Filter by Course
  var filtered = courseFilter ? students.filter(function(s) { return s.course === courseFilter; }) : students;
  
  // 2. Filter by Tab
  if (tab === 'collected') {
    filtered = filtered.filter(function(s) { return s.st === 'paid'; });
  } else if (tab === 'pending') {
    filtered = filtered.filter(function(s) { return s.st === 'pending'; });
  } else if (tab === 'overdue') {
    filtered = filtered.filter(function(s) { return s.st === 'overdue'; });
  }
  
  var tbody = document.getElementById('fee-tbody');
  if (tbody) {
    tbody.innerHTML = filtered.map(function(s) {
      var idx = students.indexOf(s);
      return getFeeRowHtml(s, idx);
    }).join('');
  }
  
  var title = document.getElementById('fee-table-title');
  if (title) {
    var labels = { all: 'All Students', collected: 'Collected Invoices', pending: 'Pending Invoices', overdue: 'Overdue Invoices' };
    title.innerHTML = '💳 Fee Details — ' + labels[tab];
  }
};

window.switchFeeTab = function(tab) {
  window._activeFeeTab = tab;
  var tabs = ['all', 'collected', 'pending', 'overdue'];
  tabs.forEach(function(t) {
    var btn = document.getElementById('ftab-' + t);
    if (btn) {
      btn.style.cssText = t === tab ? 'background:var(--admin);color:#fff;' : '';
    }
  });
  window.renderFeeTableBody();
};

window.openFeeReceiptModal = function(idx) {
  var students = window.FEE_STUDENTS || FEE_STUDENTS;
  var s = students[idx];
  var body = '<div style="background:linear-gradient(135deg,rgba(74,222,128,.08),rgba(0,212,200,.08));border:1px solid rgba(74,222,128,.2);border-radius:12px;padding:16px;margin-bottom:14px">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
    + '<div style="font-size:18px;font-weight:800;font-family:Syne,sans-serif">🧾 Payment Receipt</div>'
    + '<span class="badge badge-green">✅ PAID</span></div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
    + [['Student',s.n],['Roll No',s.roll],['Course',s.course.split('(')[0].trim()],['Amount Paid','₹'+s.paid.toLocaleString('en-IN')],['Payment Method',s.method],['Date',s.date],['Campus',s.campus],['Receipt No','RV-RCP-'+Math.floor(Math.random()*90000+10000)]].map(function(e){
        return '<div style="background:var(--surface2);border-radius:7px;padding:8px"><div style="font-size:10px;color:var(--muted)">'+e[0]+'</div><div style="font-size:13px;font-weight:600;margin-top:2px">'+e[1]+'</div></div>';
      }).join('') + '</div></div>';
  openDetail('🧾 Receipt — '+s.n, body, '<button class="btn btn-teal" onclick="window.downloadStudentFeeReceipt(\'' + s.roll + '\');closeModal(\'modal-detail\')">⬇ Download PDF</button>');
};

window.openRecordPaymentModal = function() {
  var students = window.FEE_STUDENTS || FEE_STUDENTS;
  var body = '<div class="inp-group"><label>Student</label><select class="inp-field" id="rp-st">'
    + students.map(function(s){return '<option value="' + s.roll + '">'+s.n+' ('+s.roll+')</option>';}).join('')
    + '</select></div>'
    + '<div class="inp-row">'
    + '<div class="inp-group"><label>Amount (₹)</label><input class="inp-field" id="rp-amt" type="number" placeholder="e.g. 15000"></div>'
    + '<div class="inp-group"><label>Payment Method</label><select class="inp-field" id="rp-method"><option>UPI</option><option>Net Banking</option><option>Credit Card</option><option>Debit Card</option><option>Cash</option><option>Cheque</option></select></div>'
    + '</div>'
    + '<div class="inp-row">'
    + '<div class="inp-group"><label>Payment Mode — Type</label>'
    + '<select class="inp-field" id="rp-type" style="border-color:var(--purple)">'
    + '<option value="course">📚 Course Fee</option>'
    + '<option value="materials">📄 Materials Purchase</option>'
    + '</select>'
    + '<div style="font-size:10px;color:var(--muted);margin-top:3px">Specify whether this payment is for a course enrollment or materials purchase</div>'
    + '</div>'
    + '<div class="inp-group"><label>Reference No</label><input class="inp-field" id="rp-ref" placeholder="UTR/Transaction ID"></div>'
    + '</div>'
    + '<div class="inp-row">'
    + '<div class="inp-group"><label>Payment Date</label><input class="inp-field" id="rp-date" type="date"></div>'
    + '<div class="inp-group"><label>Course / Material Name</label><input class="inp-field" id="rp-item" placeholder="e.g. JEE Advanced 2025"></div>'
    + '</div>'
    + '<div class="inp-group"><label>Notes</label><textarea class="inp-field" id="rp-notes" rows="2" placeholder="Optional notes..."></textarea></div>';
  openDetail('+ Record Payment', body, '<button class="btn btn-solid" onclick="submitRecordPayment()">💾 Record Payment</button>');
};

window.submitRecordPayment = async function() {
  var rollSelect = document.getElementById('rp-st');
  var amt = document.getElementById('rp-amt');
  var method = document.getElementById('rp-method');
  var type = document.getElementById('rp-type');
  var ref = document.getElementById('rp-ref');
  var date = document.getElementById('rp-date');
  var item = document.getElementById('rp-item');
  var notes = document.getElementById('rp-notes');

  if (!rollSelect || !rollSelect.value) { toast('Select student!', '⚠️'); return; }
  if (!amt || !amt.value) { toast('Enter amount!', '⚠️'); return; }
  
  var roll = rollSelect.value;
  var payAmt = parseInt(amt.value);
  var methodVal = method ? method.value : 'UPI';
  var typeVal = type ? type.value : 'course';
  var dateVal = date && date.value ? date.value : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  var itemVal = item && item.value ? item.value : 'LMS Course Fee';
  var notesVal = notes && notes.value ? notes.value : '';

  try {
    await api('/api/payments', {
      method: 'POST',
      body: JSON.stringify({
        roll: roll,
        amount: payAmt,
        method: methodVal,
        type: typeVal,
        date: dateVal,
        item: itemVal,
        notes: notesVal
      })
    });
    closeModal('modal-detail');
    toast('Payment of ₹' + payAmt.toLocaleString('en-IN') + ' recorded successfully!', '✅');
    await syncLMSData();
    loadPage('fees');
  } catch (err) {
    toast('Failed to record payment: ' + err.message, '❌');
  }
};

window.submitFeeReminder = function(name) {
  var wa = document.getElementById('reminder-toggle-wa').classList.contains('on');
  var em = document.getElementById('reminder-toggle-em').classList.contains('on');
  var sms = document.getElementById('reminder-toggle-sms').classList.contains('on');
  
  var channels = [];
  if (wa) channels.push('WhatsApp');
  if (em) channels.push('Email');
  if (sms) channels.push('SMS');
  
  if (channels.length === 0) {
    toast('Please select at least one channel!', '⚠️');
    return;
  }
  
  toast('Reminder sent to ' + name + ' via ' + channels.join(', ') + '!', '📨');
  closeModal('modal-detail');
};

window.openFeeReminderModal = function(name, due) {
  var body = '<div style="background:rgba(255,45,107,.07);border:1px solid rgba(255,45,107,.2);border-radius:10px;padding:14px;margin-bottom:14px;display:flex;align-items:center;gap:12px">'
    + '<div style="font-size:28px">⚠️</div>'
    + '<div><div style="font-size:12px;color:var(--muted)">Amount Due</div>'
    + '<div style="font-size:22px;font-weight:800;color:var(--admin);font-family:Syne,sans-serif">'+due+'</div></div></div>'
    + '<div class="inp-group"><label>Send Reminder Via</label>'
    + '<div style="display:flex;gap:12px;margin-top:6px;flex-wrap:wrap">'
    + [['wa','💬 WhatsApp',true],['em','📧 Email',true],['sms','📱 SMS',false]].map(function(ch){
        return '<label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer">'
          + '<div class="toggle'+(ch[2]?' on':'')+'" id="reminder-toggle-'+ch[0]+'" onclick="this.classList.toggle(\'on\')"></div>'+ch[1]+'</label>';
      }).join('') + '</div></div>'
    + '<div class="inp-group"><label>Reminder Message</label>'
    + '<textarea class="inp-field" id="reminder-msg" rows="4">Dear '+name+',\n\nYour outstanding fee of '+due+' for RV Learning Hub is due. Please clear the payment at the earliest to avoid any disruption to your studies.\n\nFor queries, contact: fees@rvhub.com\n\nRV Learning Hub Team</textarea></div>'
    + '<div class="inp-row">'
    + '<div class="inp-group"><label>Follow-up Date</label><input class="inp-field" type="date"></div>'
    + '<div class="inp-group"><label>Priority</label><select class="inp-field"><option>Normal</option><option>High</option><option>Urgent</option></select></div>'
    + '</div>';
  openDetail('📨 Fee Reminder — '+name, body,
    '<button class="btn btn-solid" onclick="submitFeeReminder(\'' + name.replace(/'/g, "\\'") + '\')">📨 Send Reminder</button>'
    + '<button class="btn btn-red" onclick="toast(\'Marked escalated!\',\'⚠️\');closeModal(\'modal-detail\')">⚠️ Escalate</button>');
};

window.downloadCourseData = function(courseName) {
  var courseData = window.FEE_COURSE_DATA || FEE_COURSE_DATA;
  var students = window.FEE_STUDENTS || FEE_STUDENTS;
  var cd = courseData.find(function(x){return x.n===courseName;});
  var filtered = students.filter(function(s){return s.course===courseName;});
  var rows = ['Roll No,Name,Fee Amount,Paid,Pending,Status,Campus'];
  filtered.forEach(function(s){
    rows.push([s.roll,s.n,s.amount,s.paid,s.pending,s.st,s.campus].join(','));
  });
  rows.push(''); rows.push('SUMMARY,,,,,,');
  rows.push('Total Students,'+( cd?cd.students:'N/A')+',,,,');
  rows.push('Total Collected,₹'+(cd?cd.collected.toLocaleString('en-IN'):'0')+',,,,');
  rows.push('Total Pending,₹'+(cd?cd.pending.toLocaleString('en-IN'):'0')+',,,,');
  var csv = rows.join('\n');
  var blob = new Blob([csv], {type:'text/csv'});
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href = url; a.download = courseName.replace(/[^a-z0-9]/gi,'_')+'_fee_data.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Fee data for "'+courseName.split('(')[0].trim()+'" downloaded!','⬇');
};

window.exportFeeData = function() {
  var students = window.FEE_STUDENTS || FEE_STUDENTS;
  var rows = ['Roll No,Name,Course,Total Fee,Paid,Pending,Status,Campus,Due Date'];
  students.forEach(function(s){
    rows.push([s.roll,s.n,s.course,s.amount,s.paid,s.pending,s.st,s.campus,s.due].join(','));
  });
  var csv = rows.join('\n');
  var blob = new Blob([csv],{type:'text/csv'});
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a'); a.href=url; a.download='fee_report_all.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Full fee report downloaded!','⬇');
};


function downloadMaterialFile(title) {
  title = title || 'Material';
  var content = 'RV Learning Hub\n' + title + '\nDate: ' + new Date().toLocaleDateString('en-IN') + '\n\n[Full content available in the complete application]';
  var blob = new Blob([content], {type:'application/octet-stream'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = title.replace(/[^a-z0-9 ]/gi,'').replace(/ /g,'_').slice(0,40) + '.pdf';
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  toast(title.slice(0,25) + ' downloaded!', 'OK');
}

function exportFacultyReport() {
  var cards = [
    ['Classes Taken', '42'],
    ['Tests Created', '8'],
    ['Doubts Resolved', '156'],
    ['Student Rating', '4.7']
  ];
  var rows = [['Metric', 'Value']];
  cards.forEach(function(c) {
    rows.push([c[0], c[1]]);
  });
  var csv = rows.map(function(r) { return r.map(function(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'faculty_monthly_performance_report.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Faculty performance report exported!', '⬇');
}

function exportTestResults(title) {
  var attempts = 98;
  var avgScore = '74%';
  var passRate = '68%';
  var rows = [
    ['Test Name', title],
    ['Attempts', attempts],
    ['Average Score', avgScore],
    ['Pass Rate', passRate],
    [],
    ['Rank', 'Student', 'Score', 'Time']
  ];
  var results = [
    [1, 'Sneha Patel', '72/80 (90%)', '24 min'],
    [2, 'Rohan Gupta', '68/80 (85%)', '27 min'],
    [3, 'Ananya Singh', '65/80 (81%)', '29 min']
  ];
  results.forEach(function(r) {
    rows.push([r[0], r[1], r[2], r[3]]);
  });
  var csv = rows.map(function(r) { return r.map(function(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'test_results_' + title.replace(/[^a-z0-9]/gi, '_') + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Test results exported!', '⬇');
}

function exportEnrollmentDetails(courseName) {
  var students = typeof ADMIN_STUDENTS !== 'undefined' ? ADMIN_STUDENTS : [];
  var courseStudents = students.filter(function(s) { return s.course.toLowerCase().indexOf(courseName.toLowerCase()) !== -1; });
  if (courseStudents.length === 0) {
    courseStudents = [
      { roll: 'RV2026S01', n: 'Sneha Patel', email: 'sneha@rvhub.com', campus: 'RV Road', fee: 'Paid', st: 'Active' },
      { roll: 'RV2026S02', n: 'Rohan Gupta', email: 'rohan@rvhub.com', campus: 'Jayanagar', fee: 'Due', st: 'Active' },
      { roll: 'RV2026S03', n: 'Ananya Singh', email: 'ananya@rvhub.com', campus: 'RV Road', fee: 'Paid', st: 'Active' }
    ];
  }
  var rows = [
    ['Course', courseName],
    ['Total Enrolled', courseStudents.length],
    [],
    ['Roll No', 'Name', 'Email', 'Campus', 'Fee Status', 'Status']
  ];
  courseStudents.forEach(function(s) {
    rows.push([s.roll || '', s.n || '', s.email || '', s.campus || '', s.fee || '', s.st || '']);
  });
  var csv = rows.map(function(r) { return r.map(function(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'enrollment_details_' + courseName.replace(/[^a-z0-9]/gi, '_') + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Enrollment details exported!', '⬇');
}

function downloadPurchaseActivityReceipt(student, item) {
  var receiptText = "RV Learning Hub - Purchase Receipt\n"
    + "===================================\n"
    + "Transaction ID: TXN" + Math.floor(Math.random()*90000+10000) + "\n"
    + "Student:        " + student + "\n"
    + "Material/Course:" + item + "\n"
    + "Amount:         INR 499 (Standard)\n"
    + "Method:         UPI\n"
    + "Date:           " + new Date().toLocaleDateString() + "\n"
    + "Status:         SUCCESS\n"
    + "===================================\n"
    + "Thank you for your purchase!";
  var blob = new Blob([receiptText], {type: 'text/plain'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'purchase_receipt_' + student.replace(/[^a-z0-9]/gi, '_') + '.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Receipt downloaded!', '⬇');
}

function downloadStudentFeeReceipt(roll) {
  var students = window.FEE_STUDENTS || FEE_STUDENTS || [];
  var s = students.find(function(x){return x.roll===roll;});
  if (!s) { toast('Student record not found','⚠️'); return; }
  var receiptText = "RV Learning Hub - Fee Payment Receipt\n"
    + "======================================\n"
    + "Student Name:   " + s.n + "\n"
    + "Roll Number:    " + s.roll + "\n"
    + "Course:         " + s.course + "\n"
    + "Total Fee:      INR " + s.amount + "\n"
    + "Paid:           INR " + s.paid + "\n"
    + "Pending:        INR " + s.pending + "\n"
    + "Payment Method: " + (s.method || 'Cash') + "\n"
    + "Payment Date:   " + (s.date || new Date().toLocaleDateString()) + "\n"
    + "Campus:         " + (s.campus || 'Main Campus') + "\n"
    + "Receipt No:     RV-RCP-" + Math.floor(Math.random()*90000+10000) + "\n"
    + "======================================\n"
    + "Thank you for your payment!";
  var blob = new Blob([receiptText], {type: 'text/plain'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'fee_receipt_' + s.roll + '.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Receipt downloaded!', '⬇');
}

function downloadGenericFeeReceipt(date, amount, method, ref) {
  var receiptText = "RV Learning Hub - Payment Receipt\n"
    + "===================================\n"
    + "Payment Date:   " + date + "\n"
    + "Amount Paid:    " + amount + "\n"
    + "Payment Method: " + method + "\n"
    + "Reference:      " + ref + "\n"
    + "Receipt No:     RV-RCP-" + Math.floor(Math.random()*90000+10000) + "\n"
    + "===================================\n"
    + "Thank you!";
  var blob = new Blob([receiptText], {type: 'text/plain'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'payment_receipt_' + ref.replace(/[^a-z0-9]/gi, '_') + '.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Receipt downloaded!', '⬇');
}
}
