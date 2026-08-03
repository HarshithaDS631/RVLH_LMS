// Module: PAGES['student_feedback']
export function registerPage(PAGES) {
  PAGES['student_feedback'] = function() {
  var faculty = [
    { n:'Dr. Priya Mehta', s:'Physics',   e:'👩‍🏫', r:4.8 },
    { n:'Prof. Amit Singh',s:'Chemistry', e:'👨‍🏫', r:4.5 },
    { n:'Mr. Raj Sharma',  s:'Maths',     e:'👨‍🏫', r:4.3 },
  ];
  var html = '<div class="card"><div class="card-title" style="margin-bottom:14px">⭐ Rate Your Faculty</div>'
    + faculty.map(function(f) {
        return '<div class="list-item" onclick="openFeedbackForm(\'' + f.n.replace(/'/g,"\\'") + '\',\'' + f.s + '\')">'
          + '<div class="li-icon" style="background:var(--surface2);font-size:20px">' + f.e + '</div>'
          + '<div class="li-content"><div class="li-title">' + f.n + '</div><div class="li-sub">' + f.s + ' • ⭐ ' + f.r + '</div></div>'
          + '<button class="btn btn-sm btn-purple" onclick="event.stopPropagation();openFeedbackForm(\'' + f.n.replace(/'/g,"\\'") + '\',\'' + f.s + '\')">Give Feedback</button></div>';
      }).join('') + '</div>';
  return html;
};

function openFeedbackForm(name, sub) {
  var body = '<div style="margin-bottom:14px;font-size:13px;color:var(--muted)">' + sub + ' • Your feedback helps improve teaching quality</div>'
    + '<div class="inp-group"><label>Rating</label>'
    + '<div style="display:flex;gap:6px;margin-top:4px" id="star-wrap">'
    + [1,2,3,4,5].map(function(n) {
        return '<button style="font-size:22px;background:none;border:none;cursor:pointer;transition:.2s;filter:grayscale(.8)" onclick="rateStar(this,' + n + ')">⭐</button>';
      }).join('') + '</div></div>'
    + makeInputGroup('Comments','textarea','Share your experience...');
  openDetail('⭐ Feedback for ' + name, body, '<button class="btn btn-solid" onclick="toast(\'Feedback submitted!\',\'✅\');closeModal(\'modal-detail\')">Submit</button>');
}

function rateStar(el, n) {
  var btns = document.querySelectorAll('#star-wrap button');
  btns.forEach(function(b, i) { b.style.filter = i < n ? 'grayscale(0)' : 'grayscale(.8)'; });
  toast('Rated ' + n + ' stars', '⭐');
}

// ═══════════════════════════════════════════════════════
// FACULTY PAGES
// ═══════════════════════════════════════════════════════
}
