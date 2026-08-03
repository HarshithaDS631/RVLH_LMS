// Module: PAGES['admin_profile']
export function registerPage(PAGES) {
  PAGES['admin_profile'] = function() {
  var u = G.user || {};
  var nameParts = (u.name || '').split(' ');
  var prof = {
    firstName  : nameParts[0]  || 'Rahul',
    lastName   : nameParts.slice(1).join(' ') || 'Verma',
    phone      : u.phone       || '',
    gender     : u.gender      || '',
    dob        : u.dob         || '',
    designation: u.designation || 'System Administrator',
    department : u.dept        || 'Administration',
    campus     : u.campus      || 'RV Learning Hub HQ',
    joinDate   : u.joinDate    || '',
    employeeId : u.emp         || 'ADM-001',
  };
  var email = u.email || 'admin@rvhub.com';
  var initials = ((prof.firstName||'R')[0]+(prof.lastName||'V')[0]).toUpperCase();
  var lbl = 'font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;display:block;margin-bottom:5px';

  // ── HERO ──
  var hero = '<div style="background:linear-gradient(135deg,#0d1526 0%,#111827 60%,#0a1020 100%);border-radius:20px;padding:30px 36px;margin-bottom:22px;border:1px solid rgba(108,71,255,.2);position:relative;overflow:hidden">'
    + '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 15% 50%,rgba(108,71,255,.14),transparent 50%),radial-gradient(ellipse at 85% 30%,rgba(255,45,107,.09),transparent 45%);pointer-events:none"></div>'
    + '<div style="position:absolute;top:-40px;right:-40px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(108,71,255,.07),transparent 70%);pointer-events:none"></div>'
    + '<div style="position:relative;display:flex;align-items:center;gap:26px">'
    // Avatar
    + '<div style="position:relative;flex-shrink:0">'
    + '<div style="width:82px;height:82px;border-radius:22px;background:linear-gradient(135deg,#6c47ff,#ff2d6b);display:flex;align-items:center;justify-content:center;color:#fff;font-family:Syne,sans-serif;font-weight:900;font-size:28px;box-shadow:0 10px 30px rgba(108,71,255,.4),0 0 0 3px rgba(108,71,255,.15)">'+initials+'</div>'
    + '<div style="position:absolute;bottom:-5px;right:-5px;width:22px;height:22px;background:var(--student);border-radius:50%;border:3px solid #0d1526;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;color:#fff">✓</div>'
    + '</div>'
    // Name & info
    + '<div style="flex:1;min-width:0">'
    + '<div style="font-family:Syne,sans-serif;font-size:22px;font-weight:900;color:#fff;letter-spacing:-.4px;margin-bottom:4px">'+prof.firstName+' '+prof.lastName+'</div>'
    + '<div style="font-size:13px;color:rgba(255,255,255,.4);margin-bottom:12px;font-family:DM Mono,monospace">'+email+'</div>'
    + '<div style="display:flex;gap:8px;flex-wrap:wrap">'
    + '<span style="background:rgba(255,45,107,.18);color:#ff2d6b;border:1px solid rgba(255,45,107,.3);padding:4px 13px;border-radius:20px;font-size:11px;font-weight:700">🛡️ Administrator</span>'
    + '<span style="background:rgba(74,222,128,.14);color:var(--student);border:1px solid rgba(74,222,128,.28);padding:4px 13px;border-radius:20px;font-size:11px;font-weight:700">✅ Active</span>'
    + '<span style="background:rgba(108,71,255,.14);color:var(--purple);border:1px solid rgba(108,71,255,.28);padding:4px 13px;border-radius:20px;font-size:11px;font-weight:700">🪪 '+prof.employeeId+'</span>'
    + '</div></div>'
    // Right meta
    + '<div style="display:flex;gap:22px;flex-shrink:0;border-left:1px solid rgba(255,255,255,.07);padding-left:28px">'
    + [['🏢',prof.department,'Department'],['💼',prof.designation,'Designation'],['📍',prof.campus.replace(' Hub HQ','').replace(' Hub',''),'Campus']].map(function(s){
        return '<div style="text-align:center">'
          + '<div style="font-size:17px;margin-bottom:5px">'+s[0]+'</div>'
          + '<div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.75);max-width:90px;word-break:break-word;line-height:1.3">'+(s[1]||'—')+'</div>'
          + '<div style="font-size:9px;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.9px;margin-top:3px">'+s[2]+'</div>'
          + '</div>';
      }).join('')
    + '</div></div></div>';

  // ── CHIPS ──
  var chips = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:22px">'
    + [{icon:'🎂',label:'Birthday',val:prof.dob||'—'},{icon:'👤',label:'Gender',val:prof.gender||'—'},{icon:'📅',label:'Joined',val:prof.joinDate||'—'},{icon:'🔒',label:'Status',val:'APPROVED',ac:'var(--student)'}].map(function(s){
        return '<div style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:15px 12px;text-align:center;transition:border-color .2s" onmouseover="this.style.borderColor=\'var(--purple)\'" onmouseout="this.style.borderColor=\'var(--border)\'">'
          + '<div style="font-size:21px;margin-bottom:6px">'+s.icon+'</div>'
          + '<div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px">'+s.label+'</div>'
          + '<div style="font-size:12px;font-weight:800;color:'+(s.ac||'var(--text)')+'">'+s.val+'</div>'
          + '</div>';
      }).join('')
    + '</div>';

  // helper
  function infoRow(label, val, ac) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">'
      + '<span style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">'+label+'</span>'
      + '<span style="font-size:13px;font-weight:700;color:'+(ac||'var(--text)')+'">'+( val||'—')+'</span>'
      + '</div>';
  }

  // ── LEFT: Personal Info ──
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
    + infoRow('Department',   prof.department)
    + infoRow('Campus',       prof.campus)
    + infoRow('Joined',       prof.joinDate)
    + '</div>';

  // ── CENTRE: Edit Profile ──
  var editCard = '<div style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);border-radius:var(--radius);padding:24px">'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid var(--border)">'
    + '<div style="width:34px;height:34px;border-radius:9px;background:rgba(0,212,200,.12);border:1px solid rgba(0,212,200,.18);display:flex;align-items:center;justify-content:center;font-size:16px">✏️</div>'
    + '<div><div style="font-family:Syne,sans-serif;font-size:13px;font-weight:800">Edit Profile</div><div style="font-size:11px;color:var(--muted)">Update your details</div></div></div>'
    + '<form onsubmit="saveAdminProfile(event)" style="display:flex;flex-direction:column;gap:12px">'
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
    +   '<div><label style="'+lbl+'">Department</label><input class="inp-field" id="ap-dept" value="'+prof.department+'"></div>'
    + '</div>'
    + '<div class="inp-row">'
    +   '<div><label style="'+lbl+'">Date of Birth</label><input class="inp-field" type="date" id="ap-dob" value="'+prof.dob+'"></div>'
    +   '<div><label style="'+lbl+'">Join Date</label><input class="inp-field" type="date" id="ap-join" value="'+prof.joinDate+'"></div>'
    + '</div>'
    + '<div><label style="'+lbl+'">Email</label>'
    +   '<input class="inp-field" value="'+email+'" disabled style="width:100%;cursor:not-allowed;background:rgba(255,255,255,0.02);color:var(--muted)" placeholder="cannot change"></div>'
    + '<button type="submit" style="height:44px;border:none;border-radius:var(--radius-sm);background:linear-gradient(135deg,#00d4c8,#4ade80);color:#fff;font-family:Syne,sans-serif;font-weight:700;font-size:14px;cursor:pointer;transition:opacity .18s;display:flex;align-items:center;justify-content:center;gap:6px" onmouseover="this.style.opacity=.85" onmouseout="this.style.opacity=1">💾 Save Changes</button>'
    + '</form></div>';

  // ── RIGHT: Change Password ──
  var pwCard = '<div style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);border-radius:var(--radius);padding:24px">'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid var(--border)">'
    + '<div style="width:34px;height:34px;border-radius:9px;background:rgba(108,71,255,.12);border:1px solid rgba(108,71,255,.18);display:flex;align-items:center;justify-content:center;font-size:16px">🔐</div>'
    + '<div><div style="font-family:Syne,sans-serif;font-size:13px;font-weight:800">Change Password</div><div style="font-size:11px;color:var(--muted)">Keep your account secure</div></div></div>'
    + '<form onsubmit="changeAdminPassword(event)" style="display:flex;flex-direction:column;gap:13px">'
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
    + '<button type="submit" style="height:44px;border:none;border-radius:var(--radius-sm);background:linear-gradient(135deg,#6c47ff,#ff2d6b);color:#fff;font-family:Syne,sans-serif;font-weight:700;font-size:14px;cursor:pointer;transition:opacity .18s;display:flex;align-items:center;justify-content:center;gap:6px" onmouseover="this.style.opacity=.85" onmouseout="this.style.opacity=1">🔐 Update Password</button>'
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

async function saveAdminProfile(e) {
  e.preventDefault();
  var get = function(id){var el=document.getElementById(id);return el?el.value.trim():'';};
  var firstName = get('ap-fn');
  var lastName = get('ap-ln');
  var phone = get('ap-phone');
  
  if (!firstName) { toast('First name is required', '⚠️'); return; }
  
  var fullName = firstName + ' ' + lastName;
  
  try {
    const updatedUser = await api('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({
        name: fullName,
        phone: phone,
        gender: get('ap-gender'),
        dob: get('ap-dob'),
        designation: get('ap-desig'),
        dept: get('ap-dept'),
        joinDate: get('ap-join')
      })
    });
    
    G.user = updatedUser;
    
    // Update sidebar interface
    var sbName = document.getElementById('sb-name');
    if (sbName) sbName.textContent = G.user.name;
    var nameParts = (G.user.name || '').split(' ');
    var initials = ((nameParts[0]||'R')[0]+(nameParts.slice(1).join(' ')||'V')[0]).toUpperCase();
    var sbAvatar = document.getElementById('sb-avatar');
    if (sbAvatar) sbAvatar.textContent = initials;
    
    toast('Profile saved successfully!', '✅');
    loadPage('profile');
  } catch (err) {
    toast('Failed to save profile: ' + err.message, '❌');
  }
}

async function changeAdminPassword(e) {
  e.preventDefault();
  var errEl = document.getElementById('ap-pw-err');
  if (errEl) errEl.style.display = 'none';
  var get = function(id){var el=document.getElementById(id);return el?el.value:'';};
  var cur = get('ap-cur'), nw = get('ap-nw'), cnw = get('ap-cnw');
  var showErr = function(msg){if(errEl){errEl.textContent=msg;errEl.style.display='block';}};
  
  if (!cur) { showErr('Enter your current password.'); return; }
  if (nw.length < 8) { showErr('Min 8 characters required.'); return; }
  if (!/[A-Z]/.test(nw)) { showErr('Must include at least 1 uppercase letter.'); return; }
  if (!/[^A-Za-z0-9]/.test(nw)) { showErr('Must include at least 1 special character.'); return; }
  if (nw !== cnw) { showErr('Passwords do not match.'); return; }
  
  try {
    await api('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({
        password: nw
      })
    });
    
    ['ap-cur', 'ap-nw', 'ap-cnw'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    
    var sb = document.getElementById('ap-pw-strength');
    if (sb) sb.style.display = 'none';
    var mh = document.getElementById('ap-match-hint');
    if (mh) mh.style.display = 'none';
    
    toast('Password updated successfully!', '🔐');
  } catch (err) {
    showErr('Failed to update password: ' + err.message);
  }
}

async function saveFacultyProfile(e) {
  e.preventDefault();
  var get = function(id){var el=document.getElementById(id);return el?el.value.trim():'';};
  var firstName = get('ap-fn');
  var lastName = get('ap-ln');
  var phone = get('ap-phone');
  
  if (!firstName) { toast('First name is required', '⚠️'); return; }
  
  var fullName = firstName + ' ' + lastName;
  
  try {
    const updatedUser = await api('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({
        name: fullName,
        phone: phone,
        gender: get('ap-gender'),
        dob: get('ap-dob'),
        designation: get('ap-desig'),
        subject: get('ap-dept'),
        joinDate: get('ap-join')
      })
    });
    
    G.user = updatedUser;
    
    // Update sidebar interface
    var sbName = document.getElementById('sb-name');
    if (sbName) sbName.textContent = G.user.name;
    var nameParts = (G.user.name || '').split(' ');
    var initials = ((nameParts[0]||'P')[0]+(nameParts.slice(1).join(' ')||'M')[0]).toUpperCase();
    var sbAvatar = document.getElementById('sb-avatar');
    if (sbAvatar) sbAvatar.textContent = initials;
    
    toast('Profile saved successfully!', '✅');
    loadPage('profile');
  } catch (err) {
    toast('Failed to save profile: ' + err.message, '❌');
  }
}

function changeFacultyPassword(e) {
  changeAdminPassword(e);
}
}
