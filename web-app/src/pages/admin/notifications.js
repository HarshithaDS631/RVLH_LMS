// Module: PAGES['admin_notifications']
export function registerPage(PAGES) {
  PAGES['admin_notifications'] = function() {
  // Incoming notifications from students and faculty
  var INCOMING_NOTIFS = window._incomingNotifs || [
    { id:1, from:'Arjun Sharma',    role:'student', roll:'RV2024001', type:'doubt',        msg:'I have a doubt in Chapter 5 — Electrostatics. The formula for electric potential seems different in my notes vs the video.',                    course:'JEE Advanced', time:'5 min ago',  read:false, priority:'normal'  },
    { id:2, from:'Dr. Priya Mehta', role:'faculty', emp:'RVF001',     type:'leave',         msg:'I will be unavailable on March 20 (Holi). Please arrange a substitute for the scheduled Physics live class at 10 AM.',                         course:'JEE Advanced', time:'22 min ago', read:false, priority:'high'    },
    { id:3, from:'Kavya Reddy',     role:'student', roll:'RV2024015', type:'fee_issue',     msg:'I have paid the fees via NEFT on March 13 but my portal still shows pending. Transaction ref: NEFT240313001234.',                               course:'NEET UG',      time:'1 hr ago',  read:false, priority:'high'    },
    { id:4, from:'Prof. Amit Singh',role:'faculty', emp:'RVF002',     type:'material',      msg:'I have uploaded 3 new PDFs for Organic Chemistry Chapter 8. Please approve them so students can access them.',                                    course:'JEE Advanced', time:'2 hrs ago', read:true,  priority:'normal'  },
    { id:5, from:'Rohan Gupta',     role:'student', roll:'RV2024003', type:'complaint',     msg:'The video for Integration by Parts is buffering repeatedly. It stops at 12 minutes every time. Please fix the streaming issue.',                  course:'JEE Mains',    time:'3 hrs ago', read:true,  priority:'normal'  },
    { id:6, from:'Dev Verma',       role:'student', roll:'RV2024020', type:'fee_issue',     msg:'Requesting instalment extension for pending fees. Personal reason — family emergency. Can I get a 2-week extension?',                             course:'Commerce',     time:'4 hrs ago', read:true,  priority:'high'    },
    { id:7, from:'Mr. Raj Sharma',  role:'faculty', emp:'RVF003',     type:'schedule',      msg:'Request to reschedule the Saturday Mathematics session to Sunday 2 PM due to a personal commitment on March 16.',                                 course:'JEE Mains',    time:'5 hrs ago', read:true,  priority:'normal'  },
    { id:8, from:'Sneha Patel',     role:'student', roll:'RV2024002', type:'certificate',   msg:'Requesting a bonafide certificate for bank account opening. Please issue at the earliest.',                                                        course:'JEE Advanced', time:'Yesterday', read:true,  priority:'low'     },
    { id:9, from:'Prof. Neha K.',   role:'faculty', emp:'RVF004',     type:'material',      msg:'New formula sheet for Accountancy Chapter 6 — Partnership Accounts has been uploaded. Kindly approve for student access.',                        course:'Commerce',     time:'Yesterday', read:true,  priority:'normal'  },
    { id:10,from:'Meera Shah',      role:'student', roll:'RV2024008', type:'complaint',     msg:'Attendance marked absent for March 10 but I was present. Please correct my attendance record.',                                                    course:'JEE Advanced', time:'2 days ago',read:true,  priority:'normal'  },
  ];
  window._incomingNotifs = INCOMING_NOTIFS;

  var nState = window._notifState || { filter:'all', typeFilter:'all' };
  window._notifState = nState;

  var unread = INCOMING_NOTIFS.filter(function(n){return !n.read;}).length;

  var typeIcons = { doubt:'❓', leave:'📅', fee_issue:'💳', material:'📄', complaint:'⚠️', schedule:'🗓️', certificate:'📋' };
  var typeLabels = { doubt:'Doubt Query', leave:'Leave Request', fee_issue:'Fee Issue', material:'Content Approval', complaint:'Complaint', schedule:'Schedule Change', certificate:'Certificate Request' };
  var typeCols = { doubt:'badge-purple', leave:'badge-yellow', fee_issue:'badge-red', material:'badge-teal', complaint:'badge-orange', schedule:'badge-yellow', certificate:'badge-teal' };

  // Stats bar
  var typeCounts = {};
  INCOMING_NOTIFS.forEach(function(n){ typeCounts[n.type] = (typeCounts[n.type]||0)+1; });

  var statsBar = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px">'
    + [
        ['📬', unread, 'Unread', 'var(--admin)'],
        ['❓', (typeCounts['doubt']||0)+(typeCounts['complaint']||0), 'Student Queries', 'var(--purple)'],
        ['👨‍🏫', (typeCounts['leave']||0)+(typeCounts['schedule']||0)+(typeCounts['material']||0), 'Faculty Requests', 'var(--faculty)'],
        ['💳', typeCounts['fee_issue']||0, 'Fee Issues', 'var(--yellow)'],
      ].map(function(s){
        return '<div class="stat-card" style="border-color:color-mix(in srgb,'+s[3]+' 28%,var(--border))">'
          + '<div class="stat-icon">'+s[0]+'</div><div class="stat-val" style="color:'+s[3]+'">'+s[1]+'</div>'
          + '<div class="stat-label">'+s[2]+'</div></div>';
      }).join('') + '</div>';

  // Filter tabs
  var filterTabs = '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;align-items:center">'
    + [['all','All',INCOMING_NOTIFS.length],['student','👨‍🎓 RVLH Students',INCOMING_NOTIFS.filter(function(n){return n.role==='student';}).length],['off_campus','🏠 Off Campus Students',INCOMING_NOTIFS.filter(function(n){return n.role==='off_campus';}).length],['faculty','👨‍🏫 Faculty',INCOMING_NOTIFS.filter(function(n){return n.role==='faculty';}).length],['unread','🔴 Unread',unread]]
      .map(function(f){
        var active = nState.filter===f[0];
        return '<button class="btn btn-sm" onclick="window._notifState.filter=\''+f[0]+'\';loadPage(\'notifications\')" '
          + 'style="'+(active?'background:var(--admin);color:#fff':'')+'">'+f[1]+' <span style="opacity:.7">('+f[2]+')</span></button>';
      }).join('')
    + '<div style="margin-left:auto;display:flex;gap:6px">'
    + '<button class="btn btn-sm btn-purple" onclick="markAllRead()">✓ Mark All Read</button>'
    + '<button class="btn btn-sm btn-teal" onclick="exportNotifications()">⬇ Export</button>'
    + '</div></div>';

  var filtered = INCOMING_NOTIFS.filter(function(n){
    if (nState.filter==='student')    return n.role==='student';
    if (nState.filter==='off_campus') return n.role==='off_campus';
    if (nState.filter==='faculty')    return n.role==='faculty';
    if (nState.filter==='unread')     return !n.read;
    return true;
  });

  var list = '<div style="display:flex;flex-direction:column;gap:10px">'
    + filtered.map(function(n, i) {
        var priColor = n.priority==='high'?'var(--admin)':n.priority==='low'?'var(--muted)':'var(--purple)';
        var roleBadge = n.role==='student'
          ? '<span class="badge badge-teal" style="font-size:10px">👨‍🎓 RVLH Student</span>'
          : n.role==='off_campus'
          ? '<span class="badge badge-purple" style="font-size:10px">🏠 Off Campus</span>'
          : '<span class="badge badge-yellow" style="font-size:10px">👨‍🏫 Faculty</span>';
        return '<div style="background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid '+(n.read?'var(--border)':'color-mix(in srgb,var(--purple) 40%,var(--border))')+';border-left:3px solid '+priColor+';border-radius:12px;padding:14px;transition:all .2s" '
          + 'onmouseover="this.style.transform=\'translateX(3px)\'" onmouseout="this.style.transform=\'\'">'
          + '<div style="display:flex;align-items:flex-start;gap:12px">'
          + '<div style="width:44px;height:44px;border-radius:12px;background:'+(n.role==='student'?'rgba(0,212,200,.12)':'rgba(251,191,36,.12)')+';display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">'+(typeIcons[n.type]||'📬')+'</div>'
          + '<div style="flex:1;min-width:0">'
          + '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">'
          + '<span style="font-weight:700;font-size:13px">'+n.from+'</span>'
          + roleBadge
          + (n.roll ? '<span style="font-size:10px;color:var(--muted)">'+n.roll+'</span>' : '<span style="font-size:10px;color:var(--muted)">'+n.emp+'</span>')
          + '<span class="badge '+typeCols[n.type]+'" style="font-size:10px">'+typeIcons[n.type]+' '+(typeLabels[n.type]||n.type)+'</span>'
          + (!n.read ? '<span style="width:7px;height:7px;border-radius:50%;background:var(--admin);flex-shrink:0;display:inline-block"></span>' : '')
          + '</div>'
          + '<div style="font-size:12px;color:var(--muted);margin-bottom:6px">'+n.course+' &nbsp;•&nbsp; '+n.time+'</div>'
          + '<div style="font-size:13px;line-height:1.6;color:var(--text)">'+n.msg+'</div>'
          + '</div></div>'
          + '<div style="display:flex;gap:7px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">'
          + '<button class="btn btn-sm btn-purple" onclick="replyNotif('+n.id+',\''+n.from.replace(/'/g,"\\'")+'\')" style="gap:5px">💬 Reply</button>'
          + '<button class="btn btn-sm btn-green" onclick="resolveNotif('+n.id+')" style="gap:5px">✅ Resolve</button>'
          + '<button class="btn btn-sm btn-teal" onclick="forwardNotif('+n.id+')" style="gap:5px">↗ Forward</button>'
          + (n.priority==='high' ? '<span class="badge badge-red" style="align-self:center">🔴 High Priority</span>' : '')
          + '</div>'
          + '</div>';
      }).join('') + '</div>';

  if (!filtered.length) list = '<div class="empty"><div class="empty-icon">📭</div><p>No notifications in this category</p></div>';

  return statsBar + filterTabs
    + '<div class="card" style="padding:0;overflow:hidden"><div style="padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">'
    + '<div style="font-family:Syne,sans-serif;font-weight:700;font-size:14px">📬 Incoming Notifications <span style="font-size:12px;color:var(--muted);font-family:DM Sans">('+filtered.length+')</span></div>'
    + '</div><div style="padding:16px">' + list + '</div></div>';
};

function replyNotif(id, fromName) {
  var body = '<div class="inp-group"><label>To</label><input class="inp-field" value="'+fromName+'" readonly style="opacity:.7"></div>'
    + '<div class="inp-group"><label>Your Reply</label><textarea class="inp-field" id="notif-reply-msg" rows="4" placeholder="Type your reply..."></textarea></div>';
  openDetail('💬 Reply to '+fromName, body,
    '<button class="btn btn-solid" onclick="var m=document.getElementById(\'notif-reply-msg\');if(!m||!m.value){toast(\'Write a reply first\',\'⚠️\');return;}resolveNotif('+id+');toast(\'Reply sent to '+fromName+'!\',\'✅\');closeModal(\'modal-detail\')">📤 Send Reply</button>');
}

function resolveNotif(id) {
  var notifs = window._incomingNotifs || [];
  var n = notifs.find(function(x){return x.id===id;});
  if (n) { n.read = true; }
  toast('Notification marked as resolved','✅');
  loadPage('notifications');
}

function forwardNotif(id) {
  var body = '<div class="inp-group"><label>Forward To</label><select class="inp-field"><option>Dr. Priya Mehta (Physics)</option><option>Prof. Amit Singh (Chemistry)</option><option>Mr. Raj Sharma (Mathematics)</option><option>Fee Department</option><option>IT Support</option></select></div>'
    + '<div class="inp-group"><label>Note</label><textarea class="inp-field" rows="2" placeholder="Optional note..."></textarea></div>';
  openDetail('↗ Forward Notification', body, '<button class="btn btn-teal" onclick="toast(\'Notification forwarded!\',\'↗\');closeModal(\'modal-detail\')">↗ Forward</button>');
}

function markAllRead() {
  var notifs = window._incomingNotifs || [];
  notifs.forEach(function(n){ n.read = true; });
  toast('All notifications marked as read','✅');
  loadPage('notifications');
}

function exportNotifications() {
  var notifs = window._incomingNotifs || [];
  var rows = [['From','Role','ID','Type','Course','Message','Time','Priority','Status']].concat(
    notifs.map(function(n){return [n.from, n.role, n.roll||n.emp, n.type, n.course, n.msg.slice(0,80), n.time, n.priority, n.read?'Read':'Unread'];}));
  var csv = rows.map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join('\n');
  var blob = new Blob([csv],{type:'text/csv'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download='notifications.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Notifications exported!','⬇');
}
}
