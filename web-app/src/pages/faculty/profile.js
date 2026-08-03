// Module: PAGES['faculty_profile']
export function registerPage(PAGES) {
  PAGES['faculty_profile'] = function() {
  var u = G.user || {};
  var nameParts = (u.name || '').split(' ');
  var prof = {
    firstName  : nameParts[0]  || 'Dr.',
    lastName   : nameParts.slice(1).join(' ') || 'Priya Mehta',
    phone      : u.phone       || '',
    gender     : u.gender      || '',
    dob        : u.dob         || '',
    designation: u.designation || 'Faculty Member',
    department : u.subject     || 'Physics',
    campus     : u.campus      || 'RV Learning Hub HQ',
    joinDate   : u.joinDate    || '',
    employeeId : u.emp         || 'RVF001',
  };
  var email = u.email || 'priya@rvhub.com';
  var initials = ((prof.firstName||'P')[0]+(prof.lastName||'M')[0]).toUpperCase();
  var lbl = 'font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;display:block;margin-bottom:5px';

  // ── HERO ──
  var hero = '<div style="background:linear-gradient(135deg,#0d1526 0%,#111827 60%,#0a1020 100%);border-radius:20px;padding:30px 36px;margin-bottom:22px;border:1px solid rgba(108,71,255,.2);position:relative;overflow:hidden">'
    + '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 15% 50%,rgba(108,71,255,.14),transparent 50%),radial-gradient(ellipse at 85% 30%,rgba(255,45,107,.09),transparent 45%);pointer-events:none"></div>'
    + '<div style="position:relative;display:flex;align-items:center;gap:26px">'
    + '<div style="position:relative;flex-shrink:0">'
    + '<div style="width:82px;height:82px;border-radius:22px;background:linear-gradient(135deg,#6c47ff,#ff2d6b);display:flex;align-items:center;justify-content:center;color:#fff;font-family:Syne,sans-serif;font-weight:900;font-size:28px;box-shadow:0 10px 30px rgba(108,71,255,.4),0 0 0 3px rgba(108,71,255,.15)">'+initials+'</div>'
    + '<div style="position:absolute;bottom:-5px;right:-5px;width:22px;height:22px;background:var(--student);border-radius:50%;border:3px solid #0d1526;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;color:#fff">✓</div>'
    + '</div>'
    + '<div style="flex:1;min-width:0">'
    + '<div style="font-family:Syne,sans-serif;font-size:22px;font-weight:900;color:#fff;letter-spacing:-.4px;margin-bottom:4px">'+prof.firstName+' '+prof.lastName+'</div>'
    + '<div style="font-size:13px;color:rgba(255,255,255,.4);margin-bottom:12px;font-family:DM Mono,monospace">'+email+'</div>'
    + '<div style="display:flex;gap:8px;flex-wrap:wrap">'
    + '<span style="background:rgba(108,71,255,.18);color:#a78bff;border:1px solid rgba(108,71,255,.3);padding:4px 13px;border-radius:20px;font-size:11px;font-weight:700">🎓 Faculty</span>'
    + '<span style="background:rgba(74,222,128,.14);color:var(--student);border:1px solid rgba(74,222,128,.28);padding:4px 13px;border-radius:20px;font-size:11px;font-weight:700">✅ Active</span>'
    + '<span style="background:rgba(108,71,255,.14);color:var(--purple);border:1px solid rgba(108,71,255,.28);padding:4px 13px;border-radius:20px;font-size:11px;font-weight:700">🪪 '+prof.employeeId+'</span>'
    + '</div></div>'
    + '<div style="display:flex;gap:22px;flex-shrink:0;border-left:1px solid rgba(255,255,255,.07);padding-left:28px">'
    + [['📚',prof.department,'Subject'],['💼',prof.designation,'Designation'],['📍',prof.campus.replace(' Hub HQ','').replace(' Hub',''),'Campus']].map(function(s){
        return '<div style="text-align:center">'
          + '<div style="font-size:17px;margin-bottom:5px">'+s[0]+'</div>'
          + '<div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.75);max-width:90px;word-break:break-word;line-height:1.3">'+(s[1]||'—')+'</div>'
          + '<div style="font-size:9px;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.9px;margin-top:3px">'+s[2]+'</div>'
          + '</div>';
      }).join('')
    + '</div></div></div>';

  var chips = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:22px">'
    + [{icon:'🎂',label:'Birthday',val:prof.dob||'—'},{icon:'👤',label:'Gender',val:prof.gender||'—'},{icon:'📅',label:'Joined',val:prof.joinDate||'—'},{icon:'🔒',label:'Status',val:'APPROVED',ac:'var(--student)'}].map(function(s){
        return '<div style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:15px 12px;text-align:center;transition:border-color .2s" onmouseover="this.style.borderColor=\'var(--purple)\'" onmouseout="this.style.borderColor=\'var(--border)\'">'
          + '<div style="font-size:21px;margin-bottom:6px">'+s.icon+'</div>'
          + '<div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px">'+s.label+'</div>'
          + '<div style="font-size:12px;font-weight:800;color:'+(s.ac||'var(--text)')+'">'+s.val+'</div>'
          + '</div>';
      }).join('')
    + '</div>';

  function infoRow(label, val, ac) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">'
      + '<span style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">'+label+'</span>'
      + '<span style="font-size:13px;font-weight:700;color:'+(ac||'var(--text)')+'">'+(val||'—')+'</span>'
      + '</div>';
  }

  var infoCard = '<div style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);border-radius:var(--radius);padding:24px">'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid var(--border)">'
    + '<div style="width:34px;height:34px;border-radius:9px;background:rgba(108,71,255,.12);border:1px solid rgba(108,71,255,.18);display:flex;align-items:center;justify-content:center;font-size:16px">👤</div>'
    + '<div><div style="font-family:Syne,sans-serif;font-size:13px;font-weight:800">Personal Information</div><div style="font-size:11px;color:var(--muted)">Your profile details</div></div></div>'
    + infoRow('First Name', prof.firstName)
    + infoRow('Last Name',  prof.lastName)
    + infoRow('Email',      email, 'var(--purple)')
    + infoRow('Phone',      prof.phone)
    + infoRow('Gender',     prof.gender)
    + infoRow('Date of Birth', prof.dob)
    + infoRow('Employee ID',  prof.employeeId, 'var(--student)')
    + infoRow('Designation',  prof.designation)
    + infoRow('Subject',      prof.department)
    + infoRow('Campus',       prof.campus)
    + infoRow('Joined',       prof.joinDate)
    + '</div>';

  var editCard = '<div style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);border-radius:var(--radius);padding:24px">'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid var(--border)">'
    + '<div style="width:34px;height:34px;border-radius:9px;background:rgba(0,212,200,.12);border:1px solid rgba(0,212,200,.18);display:flex;align-items:center;justify-content:center;font-size:16px">✏️</div>'
    + '<div><div style="font-family:Syne,sans-serif;font-size:13px;font-weight:800">Edit Profile</div><div style="font-size:11px;color:var(--muted)">Update your details</div></div></div>'
    + '<form onsubmit="saveFacultyProfile(event)" style="display:flex;flex-direction:column;gap:12px">'
    + '<div class="inp-row">'
    +   '<div><label style="'+lbl+'">First Name</label><input class="inp-field" id="ap-fn" value="'+prof.firstName+'"></div>'
    +   '<div><label style="'+lbl+'">Last Name</label><input class="inp-field" id="ap-ln" value="'+prof.lastName+'"></div>'
    + '</div>'
    + '<div class="inp-row">'
    +   '<div><label style="'+lbl+'">Phone</label><input class="inp-field" id="ap-phone" value="'+prof.phone+'" placeholder="+91 98765 43210"></div>'
    +   '<div><label style="'+lbl+'">Gender</label><select class="inp-field" id="ap-gender"><option value="">Select</option>'
    +   ['Male','Female','Non-binary','Prefer not to say'].map(function(g){return '<option value="'+g+'"'+(prof.gender===g?' selected':'')+'>'+g+'</option>';}).join('')
    +   '</select></div>'
    + '</div>'
    + '<div class="inp-row">'
    +   '<div><label style="'+lbl+'">Designation</label><input class="inp-field" id="ap-desig" value="'+prof.designation+'"></div>'
    +   '<div><label style="'+lbl+'">Subject</label><input class="inp-field" id="ap-dept" value="'+prof.department+'"></div>'
    + '</div>'
    + '<div class="inp-row">'
    +   '<div><label style="'+lbl+'">Date of Birth</label><input class="inp-field" type="date" id="ap-dob" value="'+prof.dob+'"></div>'
    +   '<div><label style="'+lbl+'">Join Date</label><input class="inp-field" type="date" id="ap-join" value="'+prof.joinDate+'"></div>'
    + '</div>'
    + '<div><label style="'+lbl+'">Email</label>'
    +   '<input class="inp-field" value="'+email+'" disabled style="width:100%;cursor:not-allowed;background:rgba(255,255,255,0.02);color:var(--muted)" placeholder="cannot change"></div>'
    + '<button type="submit" style="height:44px;border:none;border-radius:var(--radius-sm);background:linear-gradient(135deg,#00d4c8,#4ade80);color:#fff;font-family:Syne,sans-serif;font-weight:700;font-size:14px;cursor:pointer;transition:opacity .18s;display:flex;align-items:center;justify-content:center;gap:6px" onmouseover="this.style.opacity=.85" onmouseout="this.style.opacity=1">💾 Save Changes</button>'
    + '</form></div>';

  var pwCard = '<div style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);border-radius:var(--radius);padding:24px">'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid var(--border)">'
    + '<div style="width:34px;height:34px;border-radius:9px;background:rgba(108,71,255,.12);border:1px solid rgba(108,71,255,.18);display:flex;align-items:center;justify-content:center;font-size:16px">🔐</div>'
    + '<div><div style="font-family:Syne,sans-serif;font-size:13px;font-weight:800">Change Password</div><div style="font-size:11px;color:var(--muted)">Keep your account secure</div></div></div>'
    + '<form onsubmit="changeFacultyPassword(event)" style="display:flex;flex-direction:column;gap:13px">'
    + '<div><label style="'+lbl+'">Current Password</label>'
    +   '<div style="position:relative"><input class="inp-field" id="ap-cur" type="password" placeholder="Enter current password" style="padding-right:44px" oninput="">'
    +   '<button type="button" onclick="toggleFieldPw(\'ap-cur\',\'ap-b1\')" id="ap-b1" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:15px;color:var(--muted)">👁️</button></div></div>'
    + '<div><label style="'+lbl+'">New Password</label>'
    +   '<div style="position:relative"><input class="inp-field" id="ap-nw" type="password" placeholder="Min 8 · uppercase · special" style="padding-right:44px" oninput="apPwStrength(this.value)">'
    +   '<button type="button" onclick="toggleFieldPw(\'ap-nw\',\'ap-b2\')" id="ap-b2" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:15px;color:var(--muted)">👁️</button></div>'
    +   '<div id="ap-pw-strength" style="display:none;margin-top:6px"><div style="display:flex;gap:3px;margin-bottom:3px"><div id="aps1" style="flex:1;height:3px;border-radius:2px;background:var(--border);transition:background .3s"></div><div id="aps2" style="flex:1;height:3px;border-radius:2px;background:var(--border);transition:background .3s"></div><div id="aps3" style="flex:1;height:3px;border-radius:2px;background:var(--border);transition:background .3s"></div><div id="aps4" style="flex:1;height:3px;border-radius:2px;background:var(--border);transition:background .3s"></div></div><div id="aps-label" style="font-size:10px;color:var(--muted)"></div></div></div>'
    + '<div><label style="'+lbl+'">Confirm Password</label>'
    +   '<div style="position:relative"><input class="inp-field" id="ap-cnw" type="password" placeholder="Re-enter new password" style="padding-right:44px" oninput="apPwMatch(this.value)">'
    +   '<button type="button" onclick="toggleFieldPw(\'ap-cnw\',\'ap-b3\')" id="ap-b3" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:15px;color:var(--muted)">👁️</button>'
    +   '<div id="ap-match-hint" style="font-size:11px;margin-top:5px;display:none"></div></div></div>'
    + '<div id="ap-pw-err" style="display:none;color:var(--admin);font-size:12px;font-weight:600;padding:10px 13px;background:rgba(255,45,107,.08);border-radius:9px;border:1px solid rgba(255,45,107,.2)"></div>'
    + '<button type="submit" style="height:44px;border:none;border-radius:var(--radius-sm);background:linear-gradient(135deg,#6c47ff,#ff2d6b);color:#fff;font-family:Syne,sans-serif;font-weight:700;font-size:14px;cursor:pointer;transition:opacity .18s" onmouseover="this.style.opacity=.85" onmouseout="this.style.opacity=1">🔐 Update Password</button>'
    + '</form>'
    + '<div style="margin-top:16px;padding:12px 14px;background:rgba(108,71,255,.06);border:1px solid rgba(108,71,255,.15);border-radius:10px">'
    + '<div style="font-size:11px;font-weight:700;color:var(--purple);margin-bottom:4px">🛡️ Password tips</div>'
    + '<div style="font-size:11px;color:var(--muted);line-height:1.7">Use uppercase, lowercase, numbers and symbols. Avoid using your name or email as your password.</div>'
    + '</div></div>';

  return '<div style="animation:fadeUp .28s ease;max-width:1100px">'
    + hero + chips
    + '<div style="display:grid;grid-template-columns:1fr 1.25fr 1fr;gap:16px;align-items:start">'
    + infoCard + editCard + pwCard
    + '</div></div>';
};

function apPwStrength(v) {
  var sb=document.getElementById('ap-pw-strength'),l=document.getElementById('aps-label');
  if(!sb)return; sb.style.display=v?'block':'none';
  var bars=['aps1','aps2','aps3','aps4'].map(function(id){return document.getElementById(id);});
  var sc=0; if(v.length>=8)sc++; if(/[A-Z]/.test(v))sc++; if(/[0-9]/.test(v))sc++; if(/[^A-Za-z0-9]/.test(v))sc++;
  var cols=['#ff2d6b','#fbbf24','#fbbf24','#4ade80'];
  bars.forEach(function(b,i){if(b)b.style.background=i<sc?cols[sc-1]:'var(--border)';});
  if(l)l.textContent=sc>0?['Weak','Fair','Good','Strong'][sc-1]:'';
}

function apPwMatch(v) {
  var h=document.getElementById('ap-match-hint'),nw=document.getElementById('ap-nw');
  if(!h)return; if(!v){h.style.display='none';return;} h.style.display='block';
  var match=v===(nw?nw.value:'');
  h.textContent=match?'✅ Passwords match':'❌ Passwords don\'t match';
  h.style.color=match?'var(--student)':'var(--admin)';
}


async function publishAnnouncement() {
  await saveAnnouncement(false);
}

async function saveAnnouncement(isDraft) {
  var titleInput = document.getElementById('ann-title');
  var catSelect = document.getElementById('ann-cat');
  var priSelect = document.getElementById('ann-pri');
  var targetSelect = document.getElementById('ann-target');
  var msgText = document.getElementById('ann-msg');
  
  if (!titleInput || !titleInput.value.trim()) {
    toast('Title is required!', '⚠️');
    return;
  }
  if (!msgText || !msgText.value.trim()) {
    toast('Message is required!', '⚠️');
    return;
  }
  
  var titleVal = titleInput.value.trim();
  var catVal = catSelect ? catSelect.value : 'General';
  var priVal = priSelect ? priSelect.value : 'Normal';
  var targetVal = targetSelect ? targetSelect.value : 'all';
  var msgVal = msgText.value.trim();
  
  var payload = {
    title: titleVal,
    body: msgVal,
    cat: catVal,
    urgent: priVal === 'Important' || priVal === 'Urgent',
    target: targetVal,
    draft: !!isDraft
  };
  
  try {
    var url = '/api/announcements';
    var method = 'POST';
    if (window.currentEditingDraftId) {
      url = '/api/announcements/' + window.currentEditingDraftId;
      method = 'PUT';
    }
    
    await api(url, {
      method: method,
      body: JSON.stringify(payload)
    });
    
    toast(isDraft ? 'Draft saved successfully!' : 'Announcement published successfully!', isDraft ? '💾' : '📢');
    
    titleInput.value = '';
    msgText.value = '';
    if (catSelect) catSelect.selectedIndex = 0;
    if (priSelect) priSelect.selectedIndex = 0;
    if (targetSelect) targetSelect.selectedIndex = 0;
    window.currentEditingDraftId = null;
    
    var formHeader = document.querySelector('#admin_announcements_form_title');
    if (formHeader) formHeader.textContent = '📢 Create Announcement';
    
    await syncLMSData();
    loadPage('announcements');
  } catch (err) {
    toast('Failed to save: ' + err.message, '❌');
  }
}

window.editAnnouncementDraft = function(id) {
  var rawAnn = window.LMS_ANNOUNCEMENTS || [];
  var a = rawAnn.find(function(item) { return (item._id || item.id) === id; });
  if (!a) {
    toast('Draft not found', '⚠️');
    return;
  }
  
  window.currentEditingDraftId = id;
  
  var titleInput = document.getElementById('ann-title');
  var catSelect = document.getElementById('ann-cat');
  var priSelect = document.getElementById('ann-pri');
  var targetSelect = document.getElementById('ann-target');
  var msgText = document.getElementById('ann-msg');
  
  if (titleInput) titleInput.value = a.title || a.t || '';
  if (msgText) msgText.value = a.body || a.b || '';
  if (catSelect) catSelect.value = a.cat || 'General';
  if (priSelect) priSelect.value = (a.urgent ? 'Important' : (a.pri || 'Normal'));
  if (targetSelect) targetSelect.value = a.target || 'all';
  
  if (titleInput) {
    titleInput.scrollIntoView({ behavior: 'smooth' });
    titleInput.focus();
  }
  
  var formHeader = document.querySelector('#admin_announcements_form_title');
  if (formHeader) {
    formHeader.textContent = '✏️ Edit Announcement Draft';
  }
  
  toast('Draft loaded into editor!', '✏️');
};

window.viewAdminAnnouncementDetail = function(id) {
  var rawAnn = window.LMS_ANNOUNCEMENTS || [];
  var a = rawAnn.find(function(item) { return (item._id || item.id) === id; });
  if (!a) {
    var mocks = [
      { id:'mock-1', title:'JEE Mock Test 14 — Sunday',       cat:'Exam',    pri:'Important', date:'Mar 12', views:342, target:'student', draft:false, body:'The mock test series starts on March 25. Attendance is mandatory for all enrolled students.' },
      { id:'mock-2', title:'Fee Due Date Extended to Mar 20',  cat:'Fee',     pri:'Important', date:'Mar 10', views:428, target:'student', draft:false, body:'Dear students, the deadline to clear your remaining fees has been extended to March 20. Please make the payment soon.' },
      { id:'mock-3', title:'Holi Holiday — March 25',          cat:'General', pri:'Normal',   date:'Mar 8',  views:895, target:'all',     draft:false, body:'Campus will remain closed on March 25 for Holi celebrations. Online doubt classes will resume on March 26.' },
      { id:'mock-4', title:'New Physics Notes Uploaded',       cat:'Academic',pri:'Normal',   date:'Mar 7',  views:267, target:'student', draft:false, body:'New revision notes for wave optics and electrostatics have been uploaded. Check the library.' },
    ];
    a = mocks.find(function(item) { return item.id === id; });
  }
  if (!a) {
    toast('Announcement not found', '⚠️');
    return;
  }
  var title = a.title || a.t || 'Announcement';
  var body = a.body || '';
  var cat = a.cat || 'Notice';
  var date = a.date || a.d || 'Just now';
  window.openAnnouncementDetail(title, body, cat, date);
};

window.viewFacultyAnalyticsDetail = function(key) {
  var title = '';
  var body = '';
  var downloadFnName = '';
  
  if (key === 'video_views') {
    title = '👁 Video Views Analytics';
    body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">Video engagement report for your lectures.</div>'
      + '<div class="tbl-wrap"><table><thead><tr><th>Video Title</th><th>Subject</th><th>Views</th><th>Watch Time (Hours)</th></tr></thead><tbody>'
      + [
        ['Electrostatics Lecture 1', 'Physics', '4,280', '1,420'],
        ['Electrostatics Lecture 2', 'Physics', '3,950', '1,280'],
        ['Organic Chemistry Basics', 'Chemistry', '2,890', '950'],
        ['Thermodynamics Chapter 1', 'Physics', '1,280', '480']
      ].map(function(r) {
        return '<tr><td>'+r[0]+'</td><td><span class="badge badge-purple">'+r[1]+'</span></td><td style="font-weight:700;color:var(--faculty)">'+r[2]+'</td><td>'+r[3]+'</td></tr>';
      }).join('')
      + '</tbody></table></div>';
    downloadFnName = 'window.downloadFacultyAnalyticsCSV(\'video_views\')';
  } else if (key === 'avg_rating') {
    title = '⭐ Student Rating Analytics';
    body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">Detailed rating and feedback summary.</div>'
      + '<div class="tbl-wrap"><table><thead><tr><th>Lecture / Topic</th><th>Rating</th><th>Feedback Count</th><th>Positive Ratio</th></tr></thead><tbody>'
      + [
        ['Electrostatics Complete Series', '4.8 ⭐', '84', '95%'],
        ['Organic Chemistry Nomenclature', '4.6 ⭐', '62', '89%'],
        ['Thermodynamics Revision Pack', '4.7 ⭐', '45', '91%'],
        ['Cell Division DPP Discussion', '4.5 ⭐', '28', '85%']
      ].map(function(r) {
        return '<tr><td>'+r[0]+'</td><td style="font-weight:700;color:var(--yellow)">'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td></tr>';
      }).join('')
      + '</tbody></table></div>';
    downloadFnName = 'window.downloadFacultyAnalyticsCSV(\'avg_rating\')';
  } else if (key === 'tests_created') {
    title = '📝 Tests Created & Completion';
    body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">Roster of mock tests, DPPs, and student analytics.</div>'
      + '<div class="tbl-wrap"><table><thead><tr><th>Test Name</th><th>Batch</th><th>Questions</th><th>Avg Score</th></tr></thead><tbody>'
      + [
        ['Chapter 5 — Wave Optics DPP', 'JEE Adv A', '20', '74%'],
        ['Weekly Test — Thermodynamics', 'JEE Adv A,B', '30', '68%'],
        ['Mock Test 14 — Full Syllabus', 'All Batches', '90', '71%'],
        ['Biology — Cell Division DPP', 'NEET Batch', '15', 'N/A (Draft)']
      ].map(function(r) {
        return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td style="font-weight:700;color:var(--purple)">'+r[3]+'</td></tr>';
      }).join('')
      + '</tbody></table></div>';
    downloadFnName = 'window.downloadFacultyAnalyticsCSV(\'tests_created\')';
  } else if (key === 'class_completion') {
    title = '✅ Class Completion & Attendance';
    body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">Monthly syllabus coverage and attendance percentage.</div>'
      + '<div class="tbl-wrap"><table><thead><tr><th>Batch Name</th><th>Classes Taken</th><th>Completion %</th><th>Avg Attendance</th></tr></thead><tbody>'
      + [
        ['JEE Advanced A', '18', '92%', '89%'],
        ['JEE Advanced B', '15', '85%', '84%'],
        ['NEET Batch', '9', '84%', '88%']
      ].map(function(r) {
        return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td style="font-weight:700;color:var(--student)">'+r[2]+'</td><td>'+r[3]+'</td></tr>';
      }).join('')
      + '</tbody></table></div>';
    downloadFnName = 'window.downloadFacultyAnalyticsCSV(\'class_completion\')';
  }
  
  var footer = '<button class="btn btn-teal" onclick="' + downloadFnName + '">⬇ Download CSV</button>'
    + '<button class="btn btn-solid" onclick="closeModal(\'modal-detail\')">Close</button>';
    
  openDetail(title, body, footer);
};

window.downloadFacultyAnalyticsCSV = function(key) {
  var rows = [];
  var filename = '';
  
  if (key === 'video_views') {
    filename = 'faculty_video_views_analytics.csv';
    rows = [
      ['Video Title', 'Subject', 'Views', 'Watch Time (Hours)'],
      ['Electrostatics Lecture 1', 'Physics', '4280', '1420'],
      ['Electrostatics Lecture 2', 'Physics', '3950', '1280'],
      ['Organic Chemistry Basics', 'Chemistry', '2890', '950'],
      ['Thermodynamics Chapter 1', 'Physics', '1280', '480']
    ];
  } else if (key === 'avg_rating') {
    filename = 'faculty_avg_rating_analytics.csv';
    rows = [
      ['Lecture / Topic', 'Rating', 'Feedback Count', 'Positive Ratio'],
      ['Electrostatics Complete Series', '4.8', '84', '95%'],
      ['Organic Chemistry Nomenclature', '4.6', '62', '89%'],
      ['Thermodynamics Revision Pack', '4.7', '45', '91%'],
      ['Cell Division DPP Discussion', '4.5', '28', '85%']
    ];
  } else if (key === 'tests_created') {
    filename = 'faculty_tests_analytics.csv';
    rows = [
      ['Test Name', 'Batch', 'Questions', 'Avg Score'],
      ['Chapter 5 — Wave Optics DPP', 'JEE Adv A', '20', '74%'],
      ['Weekly Test — Thermodynamics', 'JEE Adv A,B', '30', '68%'],
      ['Mock Test 14 — Full Syllabus', 'All Batches', '90', '71%'],
      ['Biology — Cell Division DPP', 'NEET Batch', '15', 'Draft']
    ];
  } else if (key === 'class_completion') {
    filename = 'faculty_class_completion_analytics.csv';
    rows = [
      ['Batch Name', 'Classes Taken', 'Completion %', 'Avg Attendance'],
      ['JEE Advanced A', '18', '92%', '89%'],
      ['JEE Advanced B', '15', '85%', '84%'],
      ['NEET Batch', '9', '84%', '88%']
    ];
  }
  
  var csv = rows.map(function(r) { return r.map(function(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Report downloaded successfully!', '⬇');
};

window.viewFacultyReportDetail = function(key) {
  var title = '';
  var body = '';
  var downloadFnName = '';
  
  if (key === 'classes_taken') {
    title = '👨‍🏫 Classes Taken Details';
    body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">Log of recent classes taken this month.</div>'
      + '<div class="tbl-wrap"><table><thead><tr><th>Batch</th><th>Class Title</th><th>Date</th><th>Duration</th></tr></thead><tbody>'
      + [
        ['JEE Advanced A', 'Electrostatics Revision', 'Mar 10', '1.5 Hours'],
        ['JEE Advanced B', 'Thermodynamics Basics', 'Mar 8', '2 Hours'],
        ['NEET Batch', 'Cell Division Part 2', 'Mar 5', '1 Hour'],
        ['JEE Advanced A', 'Wave Optics Introduction', 'Mar 2', '1.5 Hours']
      ].map(function(r) {
        return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td style="font-weight:700;color:var(--faculty)">'+r[3]+'</td></tr>';
      }).join('')
      + '</tbody></table></div>';
    downloadFnName = 'window.downloadFacultyReportCSV(\'classes_taken\')';
  } else if (key === 'tests_created') {
    title = '📝 Tests Created Details';
    body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">Log of tests and DPPs created this month.</div>'
      + '<div class="tbl-wrap"><table><thead><tr><th>Test Title</th><th>Batch</th><th>Questions</th><th>Status</th></tr></thead><tbody>'
      + [
        ['Chapter 5 — Wave Optics DPP', 'JEE Adv A', '20', 'Active'],
        ['Weekly Test — Thermodynamics', 'JEE Adv A,B', '30', 'Active'],
        ['Mock Test 14 — Full Syllabus', 'All', '90', 'Active'],
        ['Biology — Cell Division DPP', 'NEET', '15', 'Draft']
      ].map(function(r) {
        return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td style="font-weight:700;color:var(--purple)">'+r[3]+'</td></tr>';
      }).join('')
      + '</tbody></table></div>';
    downloadFnName = 'window.downloadFacultyReportCSV(\'tests_created\')';
  } else if (key === 'doubts_resolved') {
    title = '💬 Doubts Resolved Details';
    body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">Log of student doubts resolved this month.</div>'
      + '<div class="tbl-wrap"><table><thead><tr><th>Student</th><th>Doubt Topic</th><th>Date</th><th>Status</th></tr></thead><tbody>'
      + [
        ['Sneha Patel', 'Gauss Law Flux Calculation', 'Mar 12', 'Resolved'],
        ['Rohan Gupta', 'Carnot Cycle Efficiency', 'Mar 10', 'Resolved'],
        ['Arjun Sharma', 'Wave Optics Interference', 'Mar 8', 'Resolved'],
        ['Kavya Reddy', 'Cell Division Stages', 'Mar 7', 'Resolved']
      ].map(function(r) {
        return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td style="font-weight:700;color:var(--student)">'+r[3]+'</td></tr>';
      }).join('')
      + '</tbody></table></div>';
    downloadFnName = 'window.downloadFacultyReportCSV(\'doubts_resolved\')';
  } else if (key === 'student_rating') {
    title = '⭐ Student Rating Details';
    body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">Summary of feedback and student ratings received.</div>'
      + '<div class="tbl-wrap"><table><thead><tr><th>Student</th><th>Rating</th><th>Feedback / Comment</th><th>Date</th></tr></thead><tbody>'
      + [
        ['Sneha Patel', '5 ⭐', 'Explains concepts very clearly. Examples are excellent!', 'Mar 10'],
        ['Arjun Sharma', '5 ⭐', 'Best physics teacher I have had. Very patient.', 'Mar 9'],
        ['Rohan Gupta', '4 ⭐', 'Good style. Would appreciate more solved examples.', 'Mar 8'],
        ['Ananya Singh', '5 ⭐', 'Easy to understand.', 'Mar 7']
      ].map(function(r) {
        return '<tr><td>'+r[0]+'</td><td style="font-weight:700;color:var(--yellow)">'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td></tr>';
      }).join('')
      + '</tbody></table></div>';
    downloadFnName = 'window.downloadFacultyReportCSV(\'student_rating\')';
  }
  
  var footer = '<button class="btn btn-teal" onclick="' + downloadFnName + '">⬇ Download CSV</button>'
    + '<button class="btn btn-solid" onclick="closeModal(\'modal-detail\')">Close</button>';
    
  openDetail(title, body, footer);
};

window.downloadFacultyReportCSV = function(key) {
  var rows = [];
  var filename = '';
  
  if (key === 'classes_taken') {
    filename = 'classes_taken_report.csv';
    rows = [
      ['Batch', 'Class Title', 'Date', 'Duration'],
      ['JEE Advanced A', 'Electrostatics Revision', 'Mar 10', '1.5 Hours'],
      ['JEE Advanced B', 'Thermodynamics Basics', 'Mar 8', '2 Hours'],
      ['NEET Batch', 'Cell Division Part 2', 'Mar 5', '1 Hour'],
      ['JEE Advanced A', 'Wave Optics Introduction', 'Mar 2', '1.5 Hours']
    ];
  } else if (key === 'tests_created') {
    filename = 'tests_created_report.csv';
    rows = [
      ['Test Title', 'Batch', 'Questions', 'Status'],
      ['Chapter 5 — Wave Optics DPP', 'JEE Adv A', '20', 'Active'],
      ['Weekly Test — Thermodynamics', 'JEE Adv A,B', '30', 'Active'],
      ['Mock Test 14 — Full Syllabus', 'All', '90', 'Active'],
      ['Biology — Cell Division DPP', 'NEET', '15', 'Draft']
    ];
  } else if (key === 'doubts_resolved') {
    filename = 'doubts_resolved_report.csv';
    rows = [
      ['Student', 'Doubt Topic', 'Date', 'Status'],
      ['Sneha Patel', 'Gauss Law Flux Calculation', 'Mar 12', 'Resolved'],
      ['Rohan Gupta', 'Carnot Cycle Efficiency', 'Mar 10', 'Resolved'],
      ['Arjun Sharma', 'Wave Optics Interference', 'Mar 8', 'Resolved'],
      ['Kavya Reddy', 'Cell Division Stages', 'Mar 7', 'Resolved']
    ];
  } else if (key === 'student_rating') {
    filename = 'student_rating_report.csv';
    rows = [
      ['Student', 'Rating', 'Feedback / Comment', 'Date'],
      ['Sneha Patel', '5', 'Explains concepts very clearly. Examples are excellent!', 'Mar 10'],
      ['Arjun Sharma', '5', 'Best physics teacher I have had. Very patient.', 'Mar 9'],
      ['Rohan Gupta', '4', 'Good style. Would appreciate more solved examples.', 'Mar 8'],
      ['Ananya Singh', '5', 'Easy to understand.', 'Mar 7']
    ];
  }
  
  var csv = rows.map(function(r) { return r.map(function(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Report downloaded successfully!', '⬇');
};

window.viewMonthlyPerformanceDetail = function() {
  var title = '📈 Monthly Performance Details';
  var body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">Your monthly score averages, test count, and total study hours.</div>'
    + '<div class="tbl-wrap"><table><thead><tr><th>Month</th><th>Avg Score</th><th>Tests Completed</th><th>Study Hours</th><th>Status / Remarks</th></tr></thead><tbody>'
    + [
      ['March 2026', '82%', '5 Tests', '150 Hours', 'Outstanding 🌟'],
      ['February 2026', '74%', '5 Tests', '130 Hours', 'Consistent 👍'],
      ['January 2026', '78%', '6 Tests', '140 Hours', 'Excellent Peak 🚀'],
      ['December 2025', '69%', '4 Tests', '115 Hours', 'Needs Focus 📖'],
      ['November 2025', '72%', '5 Tests', '125 Hours', 'Steady Progress 📈'],
      ['October 2025', '65%', '4 Tests', '110 Hours', 'Starting Month 🌱']
    ].map(function(r) {
      return '<tr>'
        + '<td style="font-weight:600">'+r[0]+'</td>'
        + '<td style="color:var(--student);font-weight:700">'+r[1]+'</td>'
        + '<td>'+r[2]+'</td>'
        + '<td>'+r[3]+'</td>'
        + '<td>'+r[4]+'</td>'
        + '</tr>';
    }).join('')
    + '</tbody></table></div>';
    
  var footer = '<button class="btn btn-teal" onclick="window.downloadMonthlyPerformanceCSV()">⬇ Download CSV</button>'
    + '<button class="btn btn-solid" onclick="closeModal(\'modal-detail\')">Close</button>';
    
  openDetail(title, body, footer, 'sm');
};

window.downloadMonthlyPerformanceCSV = function() {
  var rows = [
    ['Month', 'Avg Score', 'Tests Completed', 'Study Hours', 'Status / Remarks'],
    ['March 2026', '82%', '5 Tests', '150 Hours', 'Outstanding'],
    ['February 2026', '74%', '5 Tests', '130 Hours', 'Consistent'],
    ['January 2026', '78%', '6 Tests', '140 Hours', 'Excellent Peak'],
    ['December 2025', '69%', '4 Tests', '115 Hours', 'Needs Focus'],
    ['November 2025', '72%', '5 Tests', '125 Hours', 'Steady Progress'],
    ['October 2025', '65%', '4 Tests', '110 Hours', 'Starting Month']
  ];
  
  var csv = rows.map(function(r) { return r.map(function(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'monthly_performance_report.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Report downloaded successfully!', '⬇');
};

window.currentAdminAnnFilter = 'all';

window.setAdminAnnFilter = function(filter) {
  window.currentAdminAnnFilter = filter;
  document.querySelectorAll('.itab-ann-target').forEach(function(btn) {
    if (btn.getAttribute('onclick').indexOf("'" + filter + "'") !== -1) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  window.renderAdminAnnList();
};

window.renderAdminAnnList = function() {
  var rawAnn = window.LMS_ANNOUNCEMENTS || [];
  var filterVal = window.currentAdminAnnFilter || 'all';
  
  var filtered = rawAnn.filter(function(a) {
    if (filterVal === 'all') return true;
    var target = (a.target || 'all').toLowerCase();
    return target === filterVal;
  });
  
  var listData = filtered.map(function(a) {
    return {
      id: a._id || a.id,
      t: a.title || a.t || 'Announcement',
      cat: a.cat || 'Notice',
      pri: a.pri || (a.urgent ? 'Important' : 'Normal'),
      d: a.date || a.d || 'Just now',
      v: a.views || a.v || 350,
      target: a.target || 'all',
      draft: !!a.draft,
      body: a.body || ''
    };
  });
  
  if (listData.length === 0 && filterVal === 'all') {
    listData = [
      { id:'mock-1', t:'JEE Mock Test 14 — Sunday',       cat:'Exam',    pri:'Important',d:'Mar 12',v:342, target:'student', draft:false },
      { id:'mock-2', t:'Fee Due Date Extended to Mar 20',  cat:'Fee',     pri:'Important',d:'Mar 10',v:428, target:'student', draft:false },
      { id:'mock-3', t:'Holi Holiday — March 25',          cat:'General', pri:'Normal',   d:'Mar 8', v:895, target:'all',     draft:false },
      { id:'mock-4', t:'New Physics Notes Uploaded',       cat:'Academic',pri:'Normal',   d:'Mar 7', v:267, target:'student', draft:false },
    ];
  }
  
  var html = '';
  if (listData.length === 0) {
    html = '<div class="empty" style="padding:40px;text-align:center"><div style="font-size:24px;margin-bottom:8px">📋</div><p style="color:var(--muted)">No announcements for ' + filterVal + '</p></div>';
  } else {
    html = listData.map(function(a) {
      var badgeClass = a.pri === 'Important' || a.pri === 'Urgent' ? 'badge-yellow' : 'badge-purple';
      var badgeText = a.pri;
      var clickHandler = 'window.viewAdminAnnouncementDetail(\'' + a.id + '\')';
      
      if (a.draft) {
        badgeText = 'Draft 💾';
        badgeClass = 'badge-orange';
        clickHandler = 'window.editAnnouncementDraft(\'' + a.id + '\')';
      }
      
      var targetBadge = '';
      if (a.target === 'student') targetBadge = '<span class="badge badge-green" style="margin-right:6px">Student</span>';
      else if (a.target === 'faculty') targetBadge = '<span class="badge badge-teal" style="margin-right:6px">Faculty</span>';
      else targetBadge = '<span class="badge badge-purple" style="margin-right:6px;background:rgba(255,255,255,0.08);color:var(--muted)">All</span>';

      return '<div class="list-item" style="cursor:pointer" onclick="' + clickHandler + '">'
        + '<div class="li-icon" style="background:var(--surface2)">📢</div>'
        + '<div class="li-content"><div class="li-title" style="font-weight:600">' + a.t + (a.draft ? ' <span style="font-size:11px;color:var(--orange);font-style:italic">(Click to Edit)</span>' : '') + '</div>'
        + '<div class="li-sub" style="display:flex;align-items:center;gap:6px;margin-top:2px">' + targetBadge + '<span>' + a.cat + ' • ' + a.d + ' • ' + a.v + ' views</span></div></div>'
        + '<span class="badge ' + badgeClass + '">' + badgeText + '</span></div>';
    }).join('');
  }
  
  var container = document.getElementById('admin-ann-list-container');
  if (container) {
    container.innerHTML = html;
  }
  
  if (window.currentEditingDraftId) {
    var a = rawAnn.find(function(item) { return (item._id || item.id) === window.currentEditingDraftId; });
    if (a) {
      setTimeout(function() {
        var titleInput = document.getElementById('ann-title');
        var catSelect = document.getElementById('ann-cat');
        var priSelect = document.getElementById('ann-pri');
        var targetSelect = document.getElementById('ann-target');
        var msgText = document.getElementById('ann-msg');
        
        if (titleInput && !titleInput.value) titleInput.value = a.title || a.t || '';
        if (msgText && !msgText.value) msgText.value = a.body || a.b || '';
        if (catSelect) catSelect.value = a.cat || 'General';
        if (priSelect) priSelect.value = (a.urgent ? 'Important' : (a.pri || 'Normal'));
        if (targetSelect) targetSelect.value = a.target || 'all';
      }, 50);
    }
  }
};
}
