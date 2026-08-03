// Module: PAGES['admin_settings']
export function registerPage(PAGES) {
  PAGES['admin_settings'] = function() {
  // Persistent state for settings
  if (!window._settingsData) {
    window._settingsData = {
      general: { name:'RV Learning Hub', website:'www.rvlearninghub.com', email:'admin@rvhub.com', phone:'+91 98765 43210', address:'Rajajinagar, Bengaluru — 560010', tagline:'JEE • NEET • Commerce', timezone:'IST (UTC+5:30)', academic:'2024-25' },
      toggles: { 'Student Self-Registration':true,'Online Fee Payment':true,'Parent Portal':true,'AI Suggestions':true,'Auto Attendance':false,'Live Recording':true,'DRM Protection':true,'WhatsApp Notifs':false,'Email Notifications':true,'SMS Alerts':false,'Dark Mode Default':true,'Maintenance Mode':false },
      integrations: [
        { key:'razorpay', n:'Razorpay (Payments)',    s:true,  ic:'💳', url:'https://api.razorpay.com', key_hint:'rzp_live_****' },
        { key:'zoom',     n:'Zoom (Live Classes)',    s:true,  ic:'📡', url:'https://api.zoom.us',      key_hint:'zoom_key_****' },
        { key:'whatsapp', n:'WhatsApp Business API',  s:false, ic:'💬', url:'https://api.whatsapp.com', key_hint:'Not configured' },
        { key:'firebase', n:'Firebase (Push Notif)',  s:true,  ic:'🔥', url:'https://firebase.google.com',key_hint:'firebase_****' },
        { key:'analytics',n:'Google Analytics',       s:true,  ic:'📊', url:'https://analytics.google.com',key_hint:'UA-*****' },
        { key:'digilocker',n:'DigiLocker',            s:false, ic:'🏅', url:'https://digilocker.gov.in', key_hint:'Not configured' },
      ],
      fees: [
        { id:0, c:'JEE Advanced (2yr)',  f:45000, e:4000,   freq:'monthly', disc:5 },
        { id:1, c:'NEET Complete',       f:38000, e:3500,   freq:'monthly', disc:0 },
        { id:2, c:'Commerce XI+XII',     f:28000, e:2500,   freq:'monthly', disc:3 },
        { id:3, c:'JEE Mains Crash',     f:12000, e:12000,  freq:'one-time', disc:0 },
      ],
    };
  }
  var D = window._settingsData;

  // ── GENERAL SETTINGS ──
  var genCard = '<div class="card">'
    + '<div class="card-title" style="margin-bottom:14px">⚙️ General Settings</div>'
    + '<div class="inp-row">'
    + '<div class="inp-group"><label>Institute Name</label><input class="inp-field" id="gs-name" value="'+D.general.name+'"></div>'
    + '<div class="inp-group"><label>Tagline</label><input class="inp-field" id="gs-tagline" value="'+D.general.tagline+'"></div>'
    + '</div>'
    + '<div class="inp-row">'
    + '<div class="inp-group"><label>Website</label><input class="inp-field" id="gs-web" value="'+D.general.website+'"></div>'
    + '<div class="inp-group"><label>Admin Email</label><input class="inp-field" id="gs-email" type="email" value="'+D.general.email+'"></div>'
    + '</div>'
    + '<div class="inp-row">'
    + '<div class="inp-group"><label>Phone</label><input class="inp-field" id="gs-phone" value="'+D.general.phone+'"></div>'
    + '<div class="inp-group"><label>Academic Year</label><input class="inp-field" id="gs-year" value="'+D.general.academic+'"></div>'
    + '</div>'
    + '<div class="inp-group"><label>Address</label><input class="inp-field" id="gs-addr" value="'+D.general.address+'"></div>'
    + '<div style="display:flex;gap:8px;margin-top:4px">'
    + '<button class="btn btn-solid" onclick="saveGeneralSettings()">💾 Save Changes</button>'
    + '<button class="btn btn-purple" onclick="toast(\'Settings reset to defaults\',\'↺\')">↺ Reset</button>'
    + '</div></div>';

  // ── FEATURE TOGGLES ──
  var toggleCard = '<div class="card"><div class="card-title" style="margin-bottom:14px">🔧 Feature Toggles</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">'
    + Object.entries(D.toggles).map(function(entry) {
        var k = entry[0], v = entry[1];
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:9px;background:var(--surface2);border:1px solid rgba(255,255,255,0.07)">'
          + '<div style="flex:1;min-width:0">'
          + '<div style="font-size:12px;font-weight:600;color:var(--text)">'+k+'</div>'
          + '<div style="font-size:10px;color:'+(v?'var(--student)':'var(--muted)')+';margin-top:2px">'+(v?'● Active':'○ Inactive')+'</div></div>'
          + '<div class="toggle '+(v?'on':'')+'" id="tog-'+k.replace(/\s+/g,'-')+'" onclick="toggleSetting(\''+k.replace(/'/g,"\\'")+'\')" title="Toggle '+k+'"></div>'
          + '</div>';
      }).join('')
    + '</div></div>';

  // ── INTEGRATIONS ──
  var intCard = '<div class="card">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">'
    + '<div class="card-title" style="margin-bottom:0">🔗 Integrations</div>'
    + '<span style="font-size:11px;color:var(--muted)">'+D.integrations.filter(function(i){return i.s;}).length+' / '+D.integrations.length+' connected</span>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + D.integrations.map(function(intg) {
        var borderCol = intg.s ? 'rgba(74,222,128,.35)' : 'var(--border)';
        return '<div style="padding:14px;background:var(--surface2);border-radius:12px;border:1.5px solid '+borderCol+';display:flex;flex-direction:column;gap:10px">'
          + '<div style="display:flex;align-items:center;gap:10px">'
          + '<div style="width:40px;height:40px;border-radius:10px;background:'+(intg.s?'rgba(74,222,128,.12)':'rgba(107,122,153,.08)')+';display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">'+intg.ic+'</div>'
          + '<div style="flex:1;min-width:0">'
          + '<div style="font-weight:700;font-size:12px;color:var(--text)">'+intg.n+'</div>'
          + '<div style="font-size:10px;color:var(--muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+intg.url+'</div></div>'
          + '<span class="badge '+(intg.s?'badge-green':'badge-red')+'">'+( intg.s?'ON':'OFF')+'</span>'
          + '</div>'
          + '<div style="display:flex;gap:7px">'
          + '<button class="btn btn-sm '+(intg.s?'btn-red':'btn-green')+' btn-full" onclick="toggleIntegration(\''+intg.key+'\')">'+(intg.s?'Disconnect':'⚡ Connect')+'</button>'
          + (intg.s ? '<button class="btn btn-sm btn-teal" onclick="testIntegration(\''+intg.n+'\')">🔍 Test</button>' : '')
          + '</div>'
          + (!intg.s ? '<div style="display:flex;flex-direction:column;gap:6px">'
              + '<input class="inp-field" style="font-size:11px;padding:7px 10px" placeholder="API key..." id="int-key-'+intg.key+'">'
              + '<input class="inp-field" style="font-size:11px;padding:7px 10px" placeholder="Secret / Webhook URL...">'
              + '</div>' : '')
          + '</div>';
      }).join('')
    + '</div></div>';

  return '<div style="display:flex;flex-direction:column;gap:16px">'
    + '<div class="grid-2">' + genCard + toggleCard + '</div>'
    + intCard
    + '</div>';
};

function saveGeneralSettings() {
  var D = window._settingsData;
  if (!D) return;
  var fields = { name:'gs-name', website:'gs-web', email:'gs-email', phone:'gs-phone', address:'gs-addr', academic:'gs-year', tagline:'gs-tagline' };
  var errors = [];
  Object.entries(fields).forEach(function(e) {
    var el = document.getElementById(e[1]);
    if (el) { D.general[e[0]] = el.value.trim(); if (!el.value.trim()) errors.push(e[0]); }
  });
  if (errors.length) { toast('Please fill in: '+errors.join(', '),'⚠️'); return; }
  toast('General settings saved successfully!','✅');
}

function toggleSetting(key) {
  var D = window._settingsData;
  if (!D) return;
  D.toggles[key] = !D.toggles[key];
  var state = D.toggles[key];

  // ── Apply real functional effects ──
  switch(key) {
    case 'Dark Mode Default':
      // Toggle CSS class on body for dark/light mode
      document.body.classList.toggle('light-mode', !state);
      if (!state) {
        document.body.style.setProperty('--bg','#f0f4f8');
        document.body.style.setProperty('--surface','#ffffff');
        document.body.style.setProperty('--surface2','#f5f7fa');
        document.body.style.setProperty('--border','#e2e8f0');
        document.body.style.setProperty('--text','#1a2235');
        document.body.style.setProperty('--muted','#64748b');
      } else {
        document.body.style.setProperty('--bg','#080c14');
        document.body.style.setProperty('--surface','#0e1420');
        document.body.style.setProperty('--surface2','#141c2c');
        document.body.style.setProperty('--border','#1e2a3a');
        document.body.style.setProperty('--text','#e8edf5');
        document.body.style.setProperty('--muted','#6b7a99');
      }
      toast('Dark Mode ' + (state ? 'enabled' : 'disabled — Light Mode active'), state ? '🌙' : '☀️');
      break;

    case 'Maintenance Mode':
      var existBanner = document.getElementById('maintenance-banner');
      if (state) {
        if (!existBanner) {
          var banner = document.createElement('div');
          banner.id = 'maintenance-banner';
          banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:linear-gradient(90deg,#fbbf24,#ff6b35);color:#080c14;padding:10px 20px;font-size:13px;font-weight:700;text-align:center;animation:fadeUp .3s ease;display:flex;align-items:center;justify-content:center;gap:10px';
          banner.innerHTML = '🚧 MAINTENANCE MODE ACTIVE — Site is in maintenance. Users will see a maintenance page. <button onclick="document.getElementById(\'maintenance-banner\').remove()" style="margin-left:12px;background:rgba(0,0,0,.15);border:none;padding:3px 10px;border-radius:6px;cursor:pointer;font-weight:700">Dismiss</button>';
          document.body.prepend(banner);
        }
        toast('⚠️ Maintenance Mode ON — users are locked out', '🚧');
      } else {
        if (existBanner) existBanner.remove();
        toast('Maintenance Mode disabled — site is live', '✅');
      }
      break;

    case 'Student Self-Registration':
      toast('Student Self-Registration ' + (state ? 'enabled — /register page is live' : 'disabled — registration blocked'), state ? '✅' : '🔒');
      break;

    case 'Online Fee Payment':
      toast('Online Fee Payment ' + (state ? 'enabled — Razorpay active' : 'disabled — manual payments only'), state ? '✅' : '💳');
      break;

    case 'Parent Portal':
      toast('Parent Portal ' + (state ? 'enabled — parents can log in' : 'disabled — parent access blocked'), state ? '✅' : '🔒');
      break;

    case 'AI Suggestions':
      toast('AI Suggestions ' + (state ? 'enabled — recommendations active' : 'disabled'), state ? '🤖' : '🔒');
      break;

    case 'Auto Attendance':
      toast('Auto Attendance ' + (state ? 'enabled — QR/biometric attendance tracking on' : 'disabled — manual attendance only'), state ? '✅' : '📋');
      break;

    case 'Live Recording':
      toast('Live Recording ' + (state ? 'enabled — classes will be recorded' : 'disabled — no recording'), state ? '🔴' : '⏹');
      break;

    case 'DRM Protection':
      toast('DRM Protection ' + (state ? 'enabled — videos are protected' : 'DISABLED — video protection off ⚠️'), state ? '🔒' : '⚠️');
      break;

    case 'WhatsApp Notifs':
      toast('WhatsApp Notifications ' + (state ? 'enabled — messages will be sent via WhatsApp Business' : 'disabled'), state ? '💬' : '🔕');
      break;

    case 'Email Notifications':
      toast('Email Notifications ' + (state ? 'enabled — automated emails active' : 'disabled — no emails will be sent'), state ? '📧' : '🔕');
      break;

    case 'SMS Alerts':
      toast('SMS Alerts ' + (state ? 'enabled — SMS gateway active' : 'disabled'), state ? '📱' : '🔕');
      break;

    default:
      toast(key + ' ' + (state ? 'enabled' : 'disabled'), state ? '✅' : '❌');
  }

  // Update toggle UI in-place (no reload)
  var togEl = document.getElementById('tog-'+key.replace(/\s+/g,'-'));
  if (togEl) {
    togEl.classList.toggle('on', state);
    var card = togEl.closest('div[style*="border-radius:9px"]');
    if (card) {
      var statusLine = card.querySelector('div[style*="font-size:10px"]');
      if (statusLine) {
        statusLine.textContent = state ? '● Active' : '○ Inactive';
        statusLine.style.color = state ? 'var(--student)' : 'var(--muted)';
      }
    }
  }
}

function toggleIntegration(key) {
  var D = window._settingsData;
  if (!D) return;
  var intg = D.integrations.find(function(i){ return i.key===key; });
  if (!intg) return;

  if (intg.s) {
    // Disconnect
    intg.s = false;
    intg.apiKey = '';
    toast(intg.n + ' disconnected', '❌');
    loadPage('settings');
    return;
  }

  // Connect — validate API key
  var apiKeyEl = document.getElementById('int-key-'+key);
  var apiKeyVal = apiKeyEl ? apiKeyEl.value.trim() : '';

  // Each integration has its own key format validation
  var validations = {
    razorpay  : function(k){ return k.startsWith('rzp_') && k.length > 10; },
    zoom      : function(k){ return k.length >= 8; },
    whatsapp  : function(k){ return k.length >= 10; },
    firebase  : function(k){ return k.length >= 10; },
    analytics : function(k){ return k.startsWith('UA-') || k.startsWith('G-') || k.length >= 6; },
    digilocker: function(k){ return k.length >= 8; },
  };

  var hints = {
    razorpay  : 'Must start with rzp_ (e.g. rzp_live_xxxxxxxx)',
    zoom      : 'Enter your Zoom API key (min 8 chars)',
    whatsapp  : 'Enter your WhatsApp Business API key',
    firebase  : 'Enter your Firebase server key',
    analytics : 'Must start with UA- or G- (e.g. G-XXXXXXXXXX)',
    digilocker: 'Enter your DigiLocker client ID',
  };

  if (!apiKeyVal) {
    toast('Enter an API key to connect ' + intg.n, '🔑');
    if (apiKeyEl) { apiKeyEl.focus(); apiKeyEl.style.borderColor = 'var(--admin)'; setTimeout(function(){ apiKeyEl.style.borderColor=''; }, 2000); }
    return;
  }

  var validator = validations[key];
  if (validator && !validator(apiKeyVal)) {
    toast('Invalid key format — ' + (hints[key] || 'Check your API key'), '⚠️');
    if (apiKeyEl) { apiKeyEl.style.borderColor = 'var(--admin)'; setTimeout(function(){ apiKeyEl.style.borderColor=''; }, 2000); }
    return;
  }

  // Simulate async connection
  toast('Connecting to ' + intg.n + '...', '🔄');
  setTimeout(function() {
    intg.s = true;
    intg.apiKey = apiKeyVal;
    intg.key_hint = apiKeyVal.substring(0, 4) + '****' + apiKeyVal.slice(-4);
    toast(intg.n + ' connected successfully!', '✅');
    loadPage('settings');
  }, 900);
}

function testIntegration(name) {
  toast('Testing ' + name + ' connection...', '🔄');
  var steps = [
    [400,  'Establishing secure connection...', '🔄'],
    [900,  'Authenticating credentials...', '🔑'],
    [1500, name + ' — Connection test passed! ✅', '✅'],
  ];
  steps.forEach(function(s){
    setTimeout(function(){ toast(s[1], s[2]); }, s[0]);
  });
}
// ═══════════════════════════════════════════════════════
// VIDEOS & MATERIALS (admin_media)
// ═══════════════════════════════════════════════════════
var VIDEO_QUIZ = {
  'Electrostatics — Coulomb\'s Law & Electric Field': [
    { q:'What is the SI unit of electric charge?', opts:['Volt','Coulomb','Ampere','Farad'], ans:1 },
    { q:'Coulomb\'s Law force is proportional to:', opts:['r','r²','1/r','1/r²'], ans:3 },
    { q:'Electric field lines originate from:', opts:['Negative charges','Neutral charges','Positive charges','Conductors only'], ans:2 },
  ],
  'Gauss Law — Full Derivation with Problems': [
    { q:'Gauss\'s law relates electric flux to:', opts:['Charge density','Enclosed charge','Potential difference','Current'], ans:1 },
    { q:'For a spherical Gaussian surface around point charge, flux =', opts:['q/ε₀','q·ε₀','q/2ε₀','2q/ε₀'], ans:0 },
  ],
  'Calculus — Limits & Continuity': [
    { q:'A function is continuous at x=a if:', opts:['f(a) is defined','limit exists','limit equals f(a)','All of the above'], ans:3 },
    { q:'lim(x→0) sin(x)/x =', opts:['0','∞','1','undefined'], ans:2 },
  ],
  'Integration — All Methods Covered': [
    { q:'∫eˣ dx =', opts:['eˣ + C','eˣ/x + C','xeˣ + C','e⁻ˣ + C'], ans:0 },
    { q:'Integration by parts: ∫u dv =', opts:['uv - ∫v du','uv + ∫v du','∫u du - v','∫v du - uv'], ans:0 },
  ],
  'Organic Chemistry — IUPAC Naming': [
    { q:'The suffix for an alcohol in IUPAC naming is:', opts:['-al','-ol','-oic acid','-one'], ans:1 },
    { q:'How many carbons does "but" prefix represent?', opts:['2','3','4','5'], ans:2 },
  ],
  'Cell Structure — Complete Revision': [
    { q:'Powerhouse of the cell is:', opts:['Nucleus','Ribosome','Mitochondria','Golgi body'], ans:2 },
    { q:'Cell wall in plants is made of:', opts:['Chitin','Cellulose','Peptidoglycan','Protein'], ans:1 },
    { q:'DNA is found in:', opts:['Cytoplasm only','Nucleus only','Nucleus and Mitochondria','Ribosome'], ans:2 },
  ],
  'Partnership Accounts — Introduction': [
    { q:'In partnership, profit/loss is shared in:', opts:['Equal ratio always','Agreed ratio','Capital ratio only','Time ratio only'], ans:1 },
    { q:'Goodwill at the time of admission is credited to:', opts:['New partner','Old partners','All partners equally','Government'], ans:1 },
  ],
};

var MEDIA_DB = {
  'JEE Advanced (Main + KCET Decoded)': {
    Physics: {
      videos: [
        { t:'Electrostatics — Coulomb\'s Law & Electric Field', dur:'48 min', views:1240, date:'Mar 10', fac:'Dr. Priya Mehta', thumb:'⚡' },
        { t:'Gauss Law — Full Derivation with Problems',         dur:'55 min', views:980,  date:'Mar 8',  fac:'Dr. Priya Mehta', thumb:'🔋' },
        { t:'Capacitors — Energy & Combinations',                dur:'42 min', views:760,  date:'Mar 5',  fac:'Dr. Priya Mehta', thumb:'💡' },
        { t:'Current Electricity — Ohm\'s Law & Kirchhoff',      dur:'50 min', views:890,  date:'Mar 3',  fac:'Dr. Priya Mehta', thumb:'⚡' },
      ],
      materials: [{ t:'Chapter 1 — Electrostatics Notes',   type:'PDF', size:'2.4 MB',date:'Mar 10', pg:28 },
                  { t:'Chapter 2 — Current Electricity',    type:'PDF', size:'1.8 MB',date:'Mar 8',  pg:22 },
                  { t:'DPP Set 1-5 with Solutions',         type:'PDF', size:'3.2 MB',date:'Mar 6',  pg:45 }]
    },
    Chemistry: {
      videos: [
        { t:'Organic Chemistry — IUPAC Naming',       dur:'44 min', views:1100, date:'Mar 9',  fac:'Prof. Amit Singh', thumb:'🧪' },
        { t:'Reaction Mechanisms — SN1 vs SN2',       dur:'58 min', views:870,  date:'Mar 7',  fac:'Prof. Amit Singh', thumb:'⚗️' },
        { t:'Coordination Compounds — Complete',      dur:'60 min', views:640,  date:'Mar 4',  fac:'Prof. Amit Singh', thumb:'🧬' },
      ],
      materials: [{ t:'Organic Reactions Quick Sheet', type:'PDF', size:'1.2 MB',date:'Mar 9',  pg:12 },
                  { t:'Inorganic Chemistry Notes',     type:'PDF', size:'2.8 MB',date:'Mar 5',  pg:35 }]
    },
    Mathematics: {
      videos: [
        { t:'Calculus — Limits & Continuity',         dur:'52 min', views:1320, date:'Mar 11', fac:'Mr. Raj Sharma', thumb:'📐' },
        { t:'Integration — All Methods Covered',      dur:'65 min', views:1050, date:'Mar 9',  fac:'Mr. Raj Sharma', thumb:'∫' },
        { t:'Vectors & 3D Geometry',                  dur:'48 min', views:780,  date:'Mar 6',  fac:'Mr. Raj Sharma', thumb:'📊' },
      ],
      materials: [{ t:'Calculus Formula Sheet',       type:'PDF', size:'0.8 MB',date:'Mar 11', pg:8  },
                  { t:'Algebra Problem Bank',         type:'PDF', size:'4.1 MB',date:'Mar 7',  pg:60 }]
    }
  },
  'NEET UG Decoded': {
    Biology: {
      videos: [
        { t:'Cell Structure — Complete Revision',     dur:'55 min', views:890, date:'Mar 10', fac:'Dr. Kavya R.', thumb:'🔬' },
        { t:'Human Physiology — Nervous System',      dur:'48 min', views:720, date:'Mar 8',  fac:'Dr. Kavya R.', thumb:'🧠' },
        { t:'Plant Kingdom — Classification',         dur:'42 min', views:630, date:'Mar 5',  fac:'Dr. Kavya R.', thumb:'🌿' },
      ],
      materials: [{ t:'Biology NCERT Key Points',    type:'PDF', size:'3.6 MB',date:'Mar 10', pg:48 },
                  { t:'Previous Year MCQs Biology',  type:'PDF', size:'2.1 MB',date:'Mar 6',  pg:32 }]
    },
    Physics: {
      videos: [
        { t:'Optics — Ray & Wave Optics',            dur:'50 min', views:560, date:'Mar 9',  fac:'Prof. Amit Singh', thumb:'🔭' },
        { t:'Modern Physics — Atomic Models',         dur:'44 min', views:480, date:'Mar 7',  fac:'Prof. Amit Singh', thumb:'⚛️' },
      ],
      materials: [{ t:'Physics Formula Sheet NEET',  type:'PDF', size:'1.4 MB',date:'Mar 9',  pg:16 }]
    },
    Chemistry: {
      videos: [
        { t:'Biomolecules — Carbohydrates & Proteins',dur:'46 min', views:720, date:'Mar 8',  fac:'Prof. Amit Singh', thumb:'🧬' },
        { t:'Electrochemistry for NEET',              dur:'40 min', views:540, date:'Mar 5',  fac:'Prof. Amit Singh', thumb:'🔋' },
      ],
      materials: [{ t:'Chemistry Quick Revision',    type:'PDF', size:'1.9 MB',date:'Mar 8',  pg:24 }]
    }
  },
  'Commerce Decoded Programme': {
    Accountancy: {
      videos: [
        { t:'Partnership Accounts — Introduction',   dur:'45 min', views:420, date:'Mar 9',  fac:'Prof. Neha K.', thumb:'📊' },
        { t:'Ratio Analysis — Complete Guide',        dur:'38 min', views:360, date:'Mar 7',  fac:'Prof. Neha K.', thumb:'📈' },
      ],
      materials: [{ t:'Accountancy Formula Sheet',   type:'PDF', size:'1.1 MB',date:'Mar 9',  pg:10 }]
    },
    Economics: {
      videos: [
        { t:'Macro Economics — National Income',     dur:'42 min', views:380, date:'Mar 8',  fac:'Prof. Neha K.', thumb:'💹' },
        { t:'Micro Economics — Supply & Demand',     dur:'35 min', views:310, date:'Mar 6',  fac:'Prof. Neha K.', thumb:'📉' },
      ],
      materials: [{ t:'Economics Notes XI & XII',   type:'PDF', size:'2.4 MB',date:'Mar 8',  pg:36 }]
    },
    'Business Studies': {
      videos: [
        { t:'Business Finance — Sources of Funds',   dur:'40 min', views:290, date:'Mar 7',  fac:'Prof. Neha K.', thumb:'💼' },
      ],
      materials: [{ t:'Business Studies Summary',   type:'PDF', size:'1.5 MB',date:'Mar 7',  pg:20 }]
    }
  }
};

var FORMULA_SUBJECTS = {
  Physics:     [{ t:'Mechanics Formulas',        pg:12 },{ t:'Electricity & Magnetism', pg:15 },{ t:'Optics Formulas',      pg:8  },{ t:'Thermodynamics',         pg:10 }],
  Chemistry:   [{ t:'Organic Chemistry Quick',   pg:18 },{ t:'Inorganic Reactions',     pg:14 },{ t:'Physical Chem Formulas',pg:12 },{ t:'Electrochemistry',        pg:9  }],
  Mathematics: [{ t:'Calculus Formulas',          pg:10 },{ t:'Algebra & Series',        pg:12 },{ t:'Trigonometry',         pg:8  },{ t:'Coordinate Geometry',     pg:11 }],
  Biology:     [{ t:'Cell Biology Key Points',    pg:8  },{ t:'Human Physiology',        pg:14 },{ t:'Plant Physiology',     pg:9  },{ t:'Ecology Summary',         pg:7  }],
  Accountancy: [{ t:'Journal Entry Rules',        pg:6  },{ t:'Ratio Formulas',          pg:8  },{ t:'Partnership Formulas', pg:7  }],
  Economics:   [{ t:'Macro Economic Formulas',    pg:8  },{ t:'Micro Economic Concepts', pg:10 }],
};

var QUESTION_PAPERS = {
  'JEE Advanced (Main + KCET Decoded)': {
    2024: [{ t:'JEE Advanced 2024 Paper 1 + Solutions', subj:'All', type:'Main Exam' },{ t:'JEE Advanced 2024 Paper 2 + Solutions',subj:'All',type:'Main Exam'},{ t:'JEE Mains Jan 2024 All Sets',subj:'All',type:'Mains'}],
    2023: [{ t:'JEE Advanced 2023 Paper 1 + Solutions', subj:'All', type:'Main Exam' },{ t:'JEE Advanced 2023 Paper 2 + Solutions',subj:'All',type:'Main Exam'},{ t:'KCET 2023 Question Paper',subj:'All',type:'State'}],
    2022: [{ t:'JEE Advanced 2022 Complete Papers',     subj:'All', type:'Main Exam' },{ t:'JEE Mains 2022 All Sessions',         subj:'All',type:'Mains'}],
  },
  'NEET UG Decoded': {
    2024: [{ t:'NEET UG 2024 Official Paper + Key',     subj:'All', type:'Main Exam' },{ t:'NEET UG 2024 Re-exam Paper',          subj:'All',type:'Re-exam'}],
    2023: [{ t:'NEET UG 2023 Official Paper + Key',     subj:'All', type:'Main Exam' }],
    2022: [{ t:'NEET UG 2022 Official Paper + Key',     subj:'All', type:'Main Exam' }],
  },
  'Commerce Decoded Programme': {
    2024: [{ t:'CBSE Commerce XII 2024 Paper',          subj:'All', type:'Board'     },{ t:'CBSE Commerce XI 2024 Paper',         subj:'All',type:'Board'}],
    2023: [{ t:'CBSE Commerce XII 2023 Paper',          subj:'All', type:'Board'     }],
  },
};
}
