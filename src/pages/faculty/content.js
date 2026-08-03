// Module: PAGES['faculty_content']
export function registerPage(PAGES) {
  PAGES['faculty_content'] = function() {
  var myVideos = (window.LMS_VIDEOS || []).filter(function(v) { return v.fac === G.user.name; }).map(function(v) {
    return {
      id: v._id,
      title: v.title,
      type: v.thumb || '📹',
      size: '245 MB',
      batch: v.batch || 'General',
      views: v.views || 0,
      isVideo: true
    };
  });
  
  var myMaterials = (window.LMS_MATERIALS || []).filter(function(m) { return m.fac === G.user.name; }).map(function(m) {
    var emoji = m.type === 'pdf' ? '📄' : m.type === 'ppt' ? '📊' : '📘';
    return {
      id: m._id,
      title: m.name,
      type: emoji,
      size: m.size || '1.5 MB',
      batch: m.batch || 'General',
      views: m.views || 0,
      isVideo: false
    };
  });

  var library = myVideos.concat(myMaterials);

  if (library.length === 0) {
    library = [
      { id: 'mock-1', title:'Electrostatics — Gauss Law',  type:'📹',size:'245 MB',batch:'JEE Adv A',views:312, isVideo:true },
      { id: 'mock-2', title:'Magnetic Effects Notes',       type:'📄',size:'2.4 MB',batch:'JEE Adv A',views:189, isVideo:false },
      { id: 'mock-3', title:'Thermodynamics Full Lecture',  type:'📹',size:'380 MB',batch:'All',      views:421, isVideo:true },
      { id: 'mock-4', title:'Integration Formula Sheet',   type:'📊',size:'1.8 MB',batch:'JEE Adv B',views:156, isVideo:false },
    ];
  }

  var uploadForm = '<div class="card">'
    + '<div class="card-title" style="margin-bottom:14px">📤 Upload New Content</div>'
    + makeInputGroup('Content Type','select','📹 Video Lecture, 📄 PDF Notes, 📊 PPT, 📘 Reference Book')
    + makeInputGroup('Title','text','e.g. Electrostatics — Gauss Law Part 1')
    + '<div class="inp-row">'
    + makeInputGroup('Subject','select','Physics, Chemistry, Maths, Biology')
    + makeInputGroup('Chapter','text','Chapter 5')
    + '</div>'
    + makeInputGroup('Assign to Batch','select','All Batches, JEE Advanced A, JEE Advanced B, NEET Batch')
    + '<div style="border:2px dashed var(--border);border-radius:var(--radius);padding:28px;text-align:center;cursor:pointer;margin-bottom:13px" onclick="toast(\'File picker opened\',\'📎\')">'
    + '<div style="font-size:30px;margin-bottom:7px">☁️</div>'
    + '<div style="font-size:13px;color:var(--muted)">Click to upload or drag & drop</div>'
    + '<div style="font-size:11px;color:var(--border);margin-top:3px">MP4, PDF, PPT up to 2GB</div></div>'
    + '<div style="display:flex;gap:8px">'
    + '<button class="btn btn-teal" onclick="submitFacultyUpload()">📤 Submit for Approval</button>'
    + '<button class="btn btn-purple" onclick="toast(\'Scheduled\',\'📅\')">📅 Schedule</button></div></div>';

  var libHtml = '<div class="card"><div class="card-title" style="margin-bottom:14px">📚 Content Library</div>'
    + library.map(function(c) {
        return '<div class="list-item" style="cursor:pointer" onclick="window.openEditLibraryItem(\'' + c.id + '\',' + c.isVideo + ')">'
          + '<div class="li-icon" style="background:var(--surface2)">' + c.type + '</div>'
          + '<div class="li-content"><div class="li-title" style="font-weight:600">' + c.title + '</div><div class="li-sub">' + c.batch + ' • ' + c.views + ' views</div></div>'
          + '<div style="display:flex;gap:5px">'
          + '<button class="btn btn-sm btn-purple" onclick="event.stopPropagation();window.openEditLibraryItem(\'' + c.id + '\',' + c.isVideo + ')">✏️</button>'
          + '<button class="btn btn-sm btn-red" onclick="event.stopPropagation();window.deleteLibraryItem(\'' + c.id + '\',' + c.isVideo + ')">🗑️</button></div></div>';
      }).join('') + '</div>';

  return '<div class="grid-2">' + uploadForm + libHtml + '</div>';
};
}
