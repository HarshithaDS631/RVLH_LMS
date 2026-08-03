// Module: PAGES['student_material']
export function registerPage(PAGES) {
  PAGES['student_material'] = function() {
  var materials = window.LMS_MATERIALS || [
    { name:'Electrostatics — Complete Notes',      sub:'Physics',   type:'pdf', size:'2.4 MB', date:'Mar 12', fac:'Dr. Priya Mehta', bookmarked:true },
    { name:'Organic Chemistry — Reaction Map',     sub:'Chemistry', type:'pdf', size:'1.8 MB', date:'Mar 10', fac:'Prof. Sunita Sharma', bookmarked:false },
    { name:'Integration Formulae Sheet',           sub:'Maths',     type:'pdf', size:'0.9 MB', date:'Mar 8',  fac:'Mr. Raj Sharma', bookmarked:true },
    { name:'Cell Division — Diagram Pack',         sub:'Biology',   type:'ppt', size:'5.2 MB', date:'Mar 6',  fac:'Dr. Kavya R.', bookmarked:false },
    { name:'Thermodynamics — Quick Revision',      sub:'Physics',   type:'pdf', size:'1.1 MB', date:'Mar 4',  fac:'Dr. Priya Mehta', bookmarked:false },
    { name:'Algebra — DPP Solutions',              sub:'Maths',     type:'doc', size:'3.0 MB', date:'Mar 2',  fac:'Mr. Raj Sharma', bookmarked:false },
    { name:'Chemical Bonding — Summary',           sub:'Chemistry', type:'pdf', size:'1.5 MB', date:'Feb 28', fac:'Prof. Sunita Sharma', bookmarked:false },
    { name:'Wave Optics — Visual Guide',           sub:'Physics',   type:'ppt', size:'8.1 MB', date:'Feb 25', fac:'Dr. Priya Mehta', bookmarked:false },
  ];

  var typeIcons = { pdf:'📕', ppt:'📊', doc:'📘' };
  var typeColors = { pdf:'rgba(255,45,107,.1)', ppt:'rgba(255,107,53,.1)', doc:'rgba(0,198,255,.1)' };
  var typeBorders = { pdf:'rgba(255,45,107,.2)', ppt:'rgba(255,107,53,.2)', doc:'rgba(0,198,255,.2)' };

  var recentHtml = '<div class="card" style="margin-bottom:18px"><div class="card-header"><div class="card-title">🕐 Recently Accessed</div></div>'
    + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">'
    + materials.slice(0,3).map(function(m){
      return '<div class="enhanced-card slide-in" style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="openMaterialPreview(\''+m.name.replace(/'/g,"\\'")+'\',\''+m.type+'\',\''+m.sub+'\',\''+m.fac.replace(/'/g,"\\'")+'\')">'
        + '<div style="width:44px;height:52px;border-radius:8px;background:'+typeColors[m.type]+';border:1px solid '+typeBorders[m.type]+';display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">'+typeIcons[m.type]+'</div>'
        + '<div style="min-width:0"><div style="font-size:12px;font-weight:700;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+m.name+'</div>'
        + '<div style="font-size:11px;color:var(--muted)">'+m.sub+' · '+m.size+'</div></div></div>';
    }).join('') + '</div></div>';

  var bookmarked = materials.filter(function(m){return m.bookmarked;});
  var bookmarkHtml = bookmarked.length > 0 ? '<div class="card" style="margin-bottom:18px"><div class="card-header"><div class="card-title">🔖 Bookmarked Materials</div></div>'
    + bookmarked.map(function(m){
      return '<div class="list-item" style="cursor:pointer" onclick="openMaterialPreview(\''+m.name.replace(/'/g,"\\'")+'\',\''+m.type+'\',\''+m.sub+'\',\''+m.fac.replace(/'/g,"\\'")+'\')">'
        + '<div style="width:44px;height:52px;border-radius:8px;background:'+typeColors[m.type]+';border:1px solid '+typeBorders[m.type]+';display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">'+typeIcons[m.type]+'</div>'
        + '<div class="li-content"><div class="li-title">'+m.name+'</div><div class="li-sub">'+m.sub+' · '+m.size+' · '+m.fac+'</div></div>'
        + '<span class="badge badge-yellow">🔖</span></div>';
    }).join('') + '</div>' : '';

  var subjects = ['All','Physics','Chemistry','Maths','Biology'];
  var filterBar = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap">'
    + '<div class="inner-tabs">' + subjects.map(function(s,i){ return '<button class="itab itab-mat'+(i===0?' active':'')+'" onclick="window.setMaterialFilter(\''+s+'\'); window.filterMaterials()">'+s+'</button>'; }).join('') + '</div>'
    + '<div style="flex:1"></div>'
    + '<input id="material-search" class="inp-field" placeholder="🔍 Search materials..." style="max-width:240px;padding:8px 12px" oninput="window.filterMaterials()">'
    + '</div>';

  var gridHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px">'
    + materials.map(function(m) {
      return '<div class="enhanced-card material-card-item" data-name="'+m.name.replace(/"/g,'&quot;')+'" data-fac="'+m.fac.replace(/"/g,'&quot;')+'" data-sub="'+m.sub+'" style="cursor:pointer" onclick="openMaterialPreview(\''+m.name.replace(/'/g,"\\'")+'\',\''+m.type+'\',\''+m.sub+'\',\''+m.fac.replace(/'/g,"\\'")+'\')">'
        + '<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">'
        + '<div style="width:50px;height:60px;border-radius:10px;background:'+typeColors[m.type]+';border:1px solid '+typeBorders[m.type]+';display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0">'+typeIcons[m.type]+'</div>'
        + '<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:700;margin-bottom:3px;line-height:1.35">'+m.name+'</div>'
        + '<div style="font-size:11px;color:var(--muted)">'+m.fac+'</div></div>'
        + '<button class="bookmark-btn" onclick="event.stopPropagation();this.textContent=this.textContent===\'🏷\'?\'🔖\':\'🏷\';toast(\'Bookmark toggled!\',\'🔖\')">'+(m.bookmarked?'🔖':'🏷')+'</button></div>'
        + '<div style="display:flex;align-items:center;justify-content:space-between;font-size:11px;color:var(--muted)">'
        + '<div style="display:flex;gap:8px"><span class="badge badge-purple" style="font-size:10px">'+m.sub+'</span><span>'+m.size+'</span><span>'+m.date+'</span></div>'
        + '<span style="text-transform:uppercase;font-weight:700;font-size:10px;color:'+(m.type==='pdf'?'#ff2d6b':m.type==='ppt'?'#ff6b35':'#00c6ff')+'">'+m.type+'</span></div>'
        + '<div style="display:flex;gap:6px;margin-top:12px">'
        + '<button class="btn btn-sm btn-purple" style="flex:1;justify-content:center" onclick="event.stopPropagation();openMaterialPreview(\''+m.name.replace(/'/g,"\\'")+'\',\''+m.type+'\',\''+m.sub+'\',\''+m.fac.replace(/'/g,"\\'")+'\')">👁 Preview</button>'
        + '<button class="btn btn-sm btn-teal" style="flex:1;justify-content:center" onclick="event.stopPropagation();toast(\'Downloading '+m.name.replace(/'/g,"\\'")+'...\',\'⬇️\')">⬇️ Download</button></div></div>';
    }).join('') + '</div>';

  window.currentMaterialFilter = window.currentMaterialFilter || 'All';

  return recentHtml + bookmarkHtml + filterBar + gridHtml;
};

// Global helper functions for Material page
window.setMaterialFilter = function(sub) {
  window.currentMaterialFilter = sub;
  document.querySelectorAll('.itab-mat').forEach(function(btn) {
    if (btn.textContent.trim().toLowerCase() === sub.toLowerCase()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
};

window.filterMaterials = function() {
  var searchField = document.getElementById('material-search');
  var query = searchField ? searchField.value.toLowerCase() : '';
  var filter = window.currentMaterialFilter || 'all';
  var items = document.querySelectorAll('.material-card-item');
  items.forEach(function(item) {
    var name = item.getAttribute('data-name').toLowerCase();
    var fac = item.getAttribute('data-fac').toLowerCase();
    var sub = item.getAttribute('data-sub').toLowerCase();
    
    var matchesSearch = name.indexOf(query) > -1 || fac.indexOf(query) > -1;
    var matchesFilter = filter.toLowerCase() === 'all' || sub.toLowerCase() === filter.toLowerCase();
    
    if (matchesSearch && matchesFilter) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
};

// ──────────────── STUDENT DOUBTS (ENHANCED v3) ────────────────
}
