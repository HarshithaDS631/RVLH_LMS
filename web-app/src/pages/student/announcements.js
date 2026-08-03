// Module: PAGES['student_announcements']
export function registerPage(PAGES) {
  PAGES['student_announcements'] = function() {
  var rawAnns = window.LMS_ANNOUNCEMENTS || [];
  
  // Filter for students: target is 'all' or 'student' (exclude drafts)
  var studentAnns = rawAnns.filter(function(a) {
    if (a.draft) return false;
    var target = (a.target || 'all').toLowerCase();
    return target === 'all' || target === 'student';
  });
  
  var anns = studentAnns.map(function(a) {
    var dateString = a.date || a.d || '2026-06-25';
    // Normalize date format if it contains relative strings
    if (dateString.toLowerCase().indexOf('today') !== -1) dateString = '2026-06-19';
    else if (dateString.toLowerCase().indexOf('yesterday') !== -1) dateString = '2026-06-18';
    else if (dateString.toLowerCase().indexOf('just now') !== -1) dateString = '2026-06-19';

    return {
      id: a._id || a.id || String(Math.random()),
      title: a.title || a.t || 'Announcement',
      body: a.body || a.b || '',
      date: dateString,
      cat: a.cat || 'Notice',
      type: a.urgent || a.pri === 'Important' || a.pri === 'Urgent' ? 'warning' : 'info',
      pinned: !!a.pinned
    };
  });
  
  if (anns.length === 0) {
    anns = [
      { id: 'ann-1', title:'JEE Advanced 2025 — Registration Open', body:'Registration for JEE Advanced 2025 is now open. Last date: April 15, 2025. Submit your application through the official portal. For assistance, contact the admin office.', date:'2026-06-19', cat:'Important', type:'warning', pinned:true },
      { id: 'ann-2', title:'Campus Sports Day — March 25', body:'Annual sports day celebrations. All students are encouraged to participate. Register with your batch coordinator before March 20.', date:'2026-06-18', cat:'Events', type:'info', pinned:true },
      { id: 'ann-3', title:'Holiday Notice — Holi Festival', body:'Campus will remain closed on March 14 (Holi). Classes resume on March 15. Online classes will continue as scheduled. Enjoy the festival!', date:'2026-06-14', cat:'Notice', type:'info', pinned:false },
      { id: 'ann-4', title:'New Study Material Uploaded — Physics', body:'Electrostatics complete notes and DPP have been uploaded. Check the Materials section for Gauss Law, Coulomb Law, and Electric Field notes.', date:'2026-06-10', cat:'Academic', type:'info', pinned:false },
      { id: 'ann-5', title:'Mock Test Schedule — March 2025', body:'Monthly mock test schedule has been published. 4 full-syllabus tests planned this month. Check your test series section for details.', date:'2026-06-08', cat:'Academic', type:'info', pinned:false },
      { id: 'ann-6', title:'Parent-Teacher Meeting — March 28', body:'PTM scheduled for all batches. Parents can connect with batch coordinators via the portal or visit campus between 10 AM - 4 PM.', date:'2026-06-05', cat:'Important', type:'warning', pinned:false }
    ];
  }

  // Initialize state
  if (!window.announcementsState) {
    window.announcementsState = {
      readIds: JSON.parse(localStorage.getItem("rvlh_read_announcements") || '[]'),
      expandedIds: {}
    };
  }
  var state = window.announcementsState;

  var searchBar = '<div style="display:flex;gap:10px;margin-bottom:18px;align-items:center;flex-wrap:wrap">'
    + '<input id="ann-search" class="inp-field" placeholder="🔍 Search announcements..." style="flex:1;padding:10px 14px;min-width:200px" oninput="window.filterAnnouncements()">'
    + '<div class="inner-tabs">'
    + ['All','Important','Academic','Events','Notice'].map(function(c,i){return '<button class="itab itab-ann'+(i===0?' active':'')+'" onclick="window.setAnnCategory(\''+c+'\'); window.filterAnnouncements()">'+c+'</button>';}).join('')
    + '</div></div>';

  function renderAnn(a) {
    var isRead = state.readIds.indexOf(a.id) > -1;
    var isExpanded = !!state.expandedIds[a.id];
    var isUrgent = a.type === 'warning';
    
    var cardClasses = 'stu-ann-card ' + (isUrgent ? 'urgent' : '') + ' ' + (isRead ? 'read' : 'unread');
    var opacity = isRead ? 0.75 : 1.0;
    var badgeType = isUrgent ? 'urgent' : 'info';
    var badgeLabel = isUrgent ? '⚠ Important' : 'ℹ Notice';
    var actionText = isExpanded ? 'Click to collapse' : 'Click to read';
    
    var contentHtml = isExpanded 
      ? '<p class="stu-ann-content animate-fadeIn" style="white-space:pre-wrap;margin-top:8px">' + a.body + '</p>'
      : '<p class="stu-ann-content" style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;margin-top:8px">' + a.body + '</p>';

    var dateString = 'Just now';
    var dateObj = new Date(a.date);
    if (!isNaN(dateObj.getTime())) {
      dateString = dateObj.toLocaleDateString("en-IN", {day:"2-digit", month:"short", year:"numeric"});
      if (a.date === '2026-06-19') dateString = 'Today';
      else if (a.date === '2026-06-18') dateString = 'Yesterday';
    } else {
      dateString = a.date || 'Just now';
    }

    return '<div class="' + cardClasses + '" style="cursor:pointer;transition:all 0.2s ease;opacity:' + opacity + ';margin-bottom:12px" data-id="' + a.id + '" data-title="' + a.title.replace(/"/g,'&quot;') + '" data-body="' + a.body.replace(/"/g,'&quot;') + '" data-category="' + a.cat + '" onclick="window.toggleAnnouncement(\'' + a.id + '\')">'
      + '<div class="stu-ann-line"></div>'
      + '<div class="stu-ann-icon" style="font-size:20px">' + (isUrgent ? '⚠️' : '📢') + '</div>'
      + '<div class="stu-ann-body" style="flex:1">'
      + '<div class="stu-ann-meta" style="display:flex;justify-content:space-between;align-items:center">'
      + '<div style="display:flex;gap:8px;align-items:center">'
      + '<span class="ann-pill ' + badgeType + '" style="font-size:10px;padding:2px 8px;border-radius:4px">' + badgeLabel + '</span>'
      + (isRead ? '' : '<span class="tag-new-pulse" style="background:var(--primary-400);color:#fff;font-size:9px;font-weight:800;padding:2px 6px;border-radius:4px">NEW</span>')
      + '</div>'
      + '<span class="stu-ann-date">' + dateString + '</span>'
      + '</div>'
      + '<h3 class="stu-ann-title" style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;font-size:15px;font-weight:700">'
      + '<span>' + a.title + '</span>'
      + '<span style="font-size:11px;color:var(--muted);font-weight:normal">' + actionText + '</span>'
      + '</h3>'
      + contentHtml
      + '</div></div>';
  }

  // Sort: pinned first
  var pinnedList = anns.filter(function(a){return a.pinned;});
  var unpinnedList = anns.filter(function(a){return !a.pinned;});

  var listHtml = '<div class="stu-ann-list">'
    + (pinnedList.length ? '<div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">📌 Pinned Announcements</div>' + pinnedList.map(renderAnn).join('') : '')
    + '<div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;margin-top:16px">📅 Announcements</div>'
    + unpinnedList.map(renderAnn).join('')
    + '</div>';

  window.currentAnnCategory = window.currentAnnCategory || 'All';

  return searchBar + listHtml;
};

// Global helper functions
window.toggleAnnouncement = function(id) {
  var state = window.announcementsState;
  state.expandedIds[id] = !state.expandedIds[id];
  
  if (state.readIds.indexOf(id) === -1) {
    state.readIds.push(id);
    localStorage.setItem("rvlh_read_announcements", JSON.stringify(state.readIds));
  }
  
  loadPage('announcements');
};

window.setAnnCategory = function(cat) {
  window.currentAnnCategory = cat;
  document.querySelectorAll('.itab-ann').forEach(function(btn) {
    if (btn.textContent.trim().toLowerCase() === cat.toLowerCase()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
};

window.filterAnnouncements = function() {
  var searchField = document.getElementById('ann-search');
  var query = searchField ? searchField.value.toLowerCase() : '';
  var cat = window.currentAnnCategory || 'All';
  var items = document.querySelectorAll('.stu-ann-card');
  items.forEach(function(item) {
    var title = item.getAttribute('data-title').toLowerCase();
    var body = item.getAttribute('data-body').toLowerCase();
    var itemCat = item.getAttribute('data-category').toLowerCase();
    
    var matchesSearch = title.indexOf(query) > -1 || body.indexOf(query) > -1;
    var matchesCat = cat.toLowerCase() === 'all' || itemCat === cat.toLowerCase();
    
    if (matchesSearch && matchesCat) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
};

// ──────────────── STUDENT PROFILE (ENHANCED v3) ────────────────
async function saveStudentProfile(e) {
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
        batch: get('ap-dept'),
        joinDate: get('ap-join')
      })
    });
    
    G.user = updatedUser;
    
    // Update sidebar interface
    var sbName = document.getElementById('sb-name');
    if (sbName) sbName.textContent = G.user.name;
    var nameParts = (G.user.name || '').split(' ');
    var initials = ((nameParts[0]||'A')[0]+(nameParts.slice(1).join(' ')||'S')[0]).toUpperCase();
    var sbAvatar = document.getElementById('sb-avatar');
    if (sbAvatar) sbAvatar.textContent = initials;
    
    toast('Profile saved successfully!', '✅');
    loadPage('profile');
  } catch (err) {
    toast('Failed to save profile: ' + err.message, '❌');
  }
}

function changeStudentPassword(e) {
  changeAdminPassword(e);
}
}
