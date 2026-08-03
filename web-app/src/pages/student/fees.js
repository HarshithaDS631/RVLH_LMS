// Module: PAGES['parent_fees']
export function registerPage(PAGES) {
  PAGES['parent_fees'] = function() {
  return '<div class="card">'
    + '<div class="card-header"><div class="card-title">💳 Fee Payment Receipts & Billing History</div></div>'
    + '<div style="display:grid;gap:12px">'
    + '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px;display:flex;justify-content:space-between;align-items:center">'
    + '<div><div style="font-weight:700">JEE Advanced Full Tuition Fee</div><div style="font-size:12px;color:var(--muted)">Paid via UPI | TXN ID: TXN001 | Date: Mar 12, 2025</div></div>'
    + '<div style="display:flex;align-items:center;gap:14px"><span style="font-size:16px;font-weight:800;color:#4ade80">₹45,000</span><button class="btn btn-outline" onclick="window.downloadStudentFeeReceipt(\'Sneha Patel\',\'TXN001\',45000)">📥 Receipt</button></div>'
    + '</div>'
    + '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px;display:flex;justify-content:space-between;align-items:center">'
    + '<div><div style="font-weight:700">Tuition Installment 1</div><div style="font-size:12px;color:var(--muted)">Paid via UPI | TXN ID: TXN007 | Date: Mar 8, 2025</div></div>'
    + '<div style="display:flex;align-items:center;gap:14px"><span style="font-size:16px;font-weight:800;color:#4ade80">₹22,500</span><button class="btn btn-outline" onclick="window.downloadStudentFeeReceipt(\'Arjun Sharma\',\'TXN007\',22500)">📥 Receipt</button></div>'
    + '</div>'
    + '</div></div>';
};

// Modal action handlers
window.openApplyLeaveModal = function() {
  var child = window.parentChildren[window.currentChildIdx] || window.parentChildren[0];
  var body = '<div style="display:grid;gap:14px">'
    + '<div><label style="font-size:12px;color:var(--muted)">Student Name</label><input class="inp-field" value="' + child.name + '" readonly></div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + '<div><label style="font-size:12px;color:var(--muted)">Start Date</label><input type="date" id="leave-start" class="inp-field"></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">End Date</label><input type="date" id="leave-end" class="inp-field"></div>'
    + '</div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Reason for Leave</label><textarea id="leave-reason" class="inp-field" rows="3" placeholder="Enter detailed reason..."></textarea></div>'
    + '</div>';

  var footer = '<button class="btn btn-solid" style="background:#10b981" onclick="window.submitApplyLeave()">Submit Application</button>';
  openDetail('📝 Apply for Absence Leave', body, footer, 'md');
};

window.submitApplyLeave = async function() {
  var start = document.getElementById('leave-start')?.value;
  var end = document.getElementById('leave-end')?.value;
  var reason = document.getElementById('leave-reason')?.value;

  if (!start || !end || !reason) {
    toast('Please fill out all leave details', '⚠️');
    return;
  }
  var child = window.parentChildren[window.currentChildIdx] || window.parentChildren[0];
  try {
    await api('/api/leaves', {
      method: 'POST',
      body: JSON.stringify({ studentId: child.roll, studentName: child.name, parentName: 'Suresh Sharma', startDate: start, endDate: end, reason: reason })
    });
    toast('Leave application submitted successfully!', '✅');
    closeModal('modal-detail');
    loadPage('leaves');
  } catch (err) {
    toast('Failed to submit leave: ' + err.message, '❌');
  }
};

window.openSiblingAdmissionModal = function() {
  var body = '<div style="display:grid;gap:14px">'
    + '<div><label style="font-size:12px;color:var(--muted)">Sibling Full Name</label><input id="sib-name" class="inp-field" placeholder="Enter sibling name"></div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + '<div><label style="font-size:12px;color:var(--muted)">Date of Birth</label><input type="date" id="sib-dob" class="inp-field"></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Grade Applying For</label><select id="sib-grade" class="inp-field"><option>Grade 8 - Foundation</option><option>Grade 9 - Foundation</option><option>Grade 11 - JEE Batch</option><option>Grade 11 - NEET Batch</option></select></div>'
    + '</div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Previous School Attended</label><input id="sib-school" class="inp-field" placeholder="e.g. Delhi Public School"></div>'
    + '</div>';

  var footer = '<button class="btn btn-solid" style="background:#fbbf24;color:#000;font-weight:800" onclick="window.submitSiblingAdmission()">Submit Admission Form</button>';
  openDetail('👨‍👩‍👧 Sibling Admission Application', body, footer, 'md');
};

window.submitSiblingAdmission = async function() {
  var name = document.getElementById('sib-name')?.value;
  var dob = document.getElementById('sib-dob')?.value;
  var grade = document.getElementById('sib-grade')?.value;
  var school = document.getElementById('sib-school')?.value;

  if (!name || !grade) {
    toast('Please fill out sibling name and grade', '⚠️');
    return;
  }
  try {
    await api('/api/sibling-admissions', {
      method: 'POST',
      body: JSON.stringify({ parentName: 'Suresh Sharma', parentEmail: 'parent@rvhub.com', parentPhone: '9876500000', siblingName: name, dob, gradeApplying: grade, previousSchool: school })
    });
    toast('Sibling admission application registered!', '🎉');
    closeModal('modal-detail');
    loadPage('sibling_admission');
  } catch (err) {
    toast('Failed to submit application: ' + err.message, '❌');
  }
};

window.downloadReportCardPDF = function() {
  var child = window.parentChildren[window.currentChildIdx] || window.parentChildren[0];
  var content = "========================================================\n"
    + "          RV LEARNING HUB - OFFICIAL MARKS CARD         \n"
    + "========================================================\n"
    + "Student Name : " + child.name + "\n"
    + "Roll Number  : " + child.roll + "\n"
    + "Batch        : " + child.batch + "\n"
    + "Term         : Mid-Term Examination 2024-25\n"
    + "Date Issued  : March 15, 2026\n"
    + "--------------------------------------------------------\n"
    + "Physics      : 92 / 100 (A+) | Dr. Priya Mehta\n"
    + "Chemistry    : 84 / 100 (A)  | Prof. Amit Singh\n"
    + "Mathematics  : 88 / 100 (A+) | Mr. Raj Sharma\n"
    + "--------------------------------------------------------\n"
    + "Total Score  : 264 / 300\n"
    + "Percentile   : 96.8%\n"
    + "Batch Rank   : 3rd Place\n"
    + "Overall      : DISTINCTION (A+)\n"
    + "========================================================\n";

  var blob = new Blob([content], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'ReportCard_' + child.roll + '.txt';
  a.click();
  URL.revokeObjectURL(url);
  toast('Report Card downloaded!', '📄');
};

// ═══════════════════════════════════════════════════════
// PARENT SMS & WHATSAPP REPORT DISPATCH HANDLERS
// ═══════════════════════════════════════════════════════
window.openNotifyParentModal = function(type) {
  var student = G.user && G.user.role === 'student' ? G.user : { name: 'Arjun Sharma', roll: 'RV2024001', phone: '9876500000' };
  var parentPhone = '9876500000';
  var msgText = '';

  if (type === 'Attendance') {
    msgText = '🎓 *RV LEARNING HUB - DAILY ATTENDANCE REPORT*\n\nDear Parent,\nYour ward *' + student.name + '* (' + (student.roll || 'RV2024001') + ') was marked *PRESENT* today.\n\n📊 Total Term Attendance: *94%*\n🔥 Current Study Streak: *7 Days*\n\nRegards,\nRV Learning Hub Administration';
  } else if (type === 'Exam Result') {
    msgText = '📜 *RV LEARNING HUB - MID-TERM MARKS REPORT*\n\nDear Parent,\nResults for *' + student.name + '* (' + (student.roll || 'RV2024001') + '):\n\n• Physics: 92/100 (A+)\n• Chemistry: 84/100 (A)\n• Mathematics: 88/100 (A+)\n\n🏆 Total Score: *264/300*\n📊 Percentile: *96.8%*\n🎖 Batch Rank: *#3*\n\nRegards,\nRV Learning Hub Academics';
  } else if (type === 'Fee Receipt') {
    msgText = '💳 *RV LEARNING HUB - FEE PAYMENT RECEIPT*\n\nDear Parent,\nFee payment received for *' + student.name + '*:\n\n• Amount Paid: *₹45,000*\n• Transaction ID: *TXN001*\n• Payment Method: UPI\n• Status: *PAID (No Dues)*\n\nThank you!\nRV Learning Hub Accounts';
  } else {
    msgText = '📝 *RV LEARNING HUB - LEAVE APPLICATION UPDATE*\n\nDear Parent,\nLeave application for *' + student.name + '* (March 20–22, 2026) has been *APPROVED* by the Campus Principal.\n\nRegards,\nRV Learning Hub Administration';
  }

  var body = '<div style="display:grid;gap:14px">'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + '<div><label style="font-size:12px;color:var(--muted)">Student Name</label><input class="inp-field" value="' + student.name + '" readonly></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Parent Phone Number</label><input id="notify-parent-phone" class="inp-field" value="+91 ' + parentPhone + '"></div>'
    + '</div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Formatted Report Preview (' + type + ')</label>'
    + '<textarea id="notify-msg-text" class="inp-field" rows="8" style="font-family:monospace;font-size:12px;line-height:1.5;color:#eef2ff">' + msgText + '</textarea>'
    + '</div></div>';

  var footer = '<div style="display:flex;gap:10px;justify-content:flex-end;width:100%">'
    + '<button class="btn btn-sms" onclick="window.dispatchSMSMessage(\'' + parentPhone + '\',\'' + type + '\')">💬 Send via SMS</button>'
    + '<button class="btn btn-whatsapp" onclick="window.dispatchWhatsAppMessage(\'' + parentPhone + '\',\'' + type + '\')">📲 Dispatch via WhatsApp</button>'
    + '</div>';

  openDetail('📲 Dispatch Parent Report (' + type + ')', body, footer, 'md');
};

window.dispatchWhatsAppMessage = async function(phone, type) {
  var phoneInput = document.getElementById('notify-parent-phone')?.value || phone;
  var msgText = document.getElementById('notify-msg-text')?.value || '';

  var cleanPhone = phoneInput.replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

  try {
    await api('/api/notify-parent', {
      method: 'POST',
      body: JSON.stringify({ studentName: G.user ? G.user.name : 'Arjun Sharma', parentPhone: cleanPhone, channel: 'WhatsApp', type: type, messageText: msgText })
    });
    
    // Open WhatsApp Web / App deep link
    var url = 'https://wa.me/' + cleanPhone + '?text=' + encodeURIComponent(msgText);
    window.open(url, '_blank');

    toast('WhatsApp report dispatched to parent!', '📲');
    closeModal('modal-detail');
  } catch (err) {
    toast('Failed to dispatch WhatsApp message: ' + err.message, '❌');
  }
};

window.dispatchSMSMessage = async function(phone, type) {
  var phoneInput = document.getElementById('notify-parent-phone')?.value || phone;
  var msgText = document.getElementById('notify-msg-text')?.value || '';

  try {
    await api('/api/notify-parent', {
      method: 'POST',
      body: JSON.stringify({ studentName: G.user ? G.user.name : 'Arjun Sharma', parentPhone: phoneInput, channel: 'SMS', type: type, messageText: msgText })
    });
    toast('SMS notification dispatched to parent (' + phoneInput + ')!', '💬');
    closeModal('modal-detail');
  } catch (err) {
    toast('Failed to dispatch SMS: ' + err.message, '❌');
  }
};

// ═══════════════════════════════════════════════════════
// STUDENT JOURNEY & GAMIFIED BADGES PAGES
// ═══════════════════════════════════════════════════════
}
