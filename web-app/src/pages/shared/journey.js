// Module: PAGES['shared_journey']
export function registerPage(PAGES) {
  PAGES['shared_journey'] = function() {
  var student = G.user || { name: 'Arjun Sharma', batch: 'JEE Advanced (Main + KCET Decoded)' };
  
  var header = '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:24px;margin-bottom:20px">'
    + '<div style="display:flex;justify-content:space-between;align-items:center">'
    + '<div>'
    + '<div style="font-size:22px;font-weight:800;color:var(--text)">🚀 Academic Journey Roadmap — ' + student.name + '</div>'
    + '<div style="font-size:13px;color:var(--muted);margin-top:4px">Tracking academic progression from Enrollment to Final Graduation</div>'
    + '</div>'
    + '<span class="badge badge-purple" style="font-size:13px;padding:8px 16px">Phase 3 of 5 (Active)</span>'
    + '</div>'
    + '<div class="prog-bar" style="height:8px;margin-top:16px"><div class="prog-fill" style="width:60%;background:linear-gradient(90deg,#6c47ff,#a855f7)"></div></div>'
    + '</div>';

  var milestones = [
    { phase: 1, title: 'Onboarding & Orientation', icon: '🎓', status: 'Completed', date: 'Jan 10, 2026', desc: 'Enrolled in JEE Advanced Batch A, completed initial diagnostic assessment and LMS orientation.', class: 'journey-step-completed' },
    { phase: 2, title: 'Core Concepts & Video Lectures', icon: '⚡', status: 'Completed', date: 'Feb 15, 2026', desc: 'Watched 10+ core video lectures in Physics & Chemistry and solved first 5 Daily Practice Papers (DPPs).', class: 'journey-step-completed' },
    { phase: 3, title: 'Mid-Term Exam & Batch Rank', icon: '🧪', status: 'Active Milestone', date: 'Mar 15, 2026', desc: 'Achieved 264/300 (Distinction A+), 96.8 percentile, and secured 3rd Rank in JEE Advanced Batch A.', class: 'journey-step-active' },
    { phase: 4, title: 'Mock Test Series & Doubt Mastery', icon: '🚀', status: 'In Progress', date: 'April 2026', desc: 'Targeting 5 full-syllabus mock tests and doubt resolution sessions with faculty.', class: 'journey-step' },
    { phase: 5, title: 'Final Entrance Exam & Certification', icon: '🏆', status: 'Upcoming Goal', date: 'May 2026', desc: 'Final graduation readiness, rank verification, and official course completion certificate.', class: 'journey-step' }
  ];

  var timelineHtml = '<div class="card"><div class="card-header"><div class="card-title">🗺️ Milestone Timeline</div></div>'
    + '<div class="journey-timeline">'
    + milestones.map(function(m) {
        var statusBadge = m.status === 'Completed' ? '<span class="badge badge-green">✓ Completed</span>' : m.status === 'Active Milestone' ? '<span class="badge badge-purple">⚡ Active Phase</span>' : '<span class="badge badge-yellow">🔒 Upcoming</span>';
        return '<div class="journey-step ' + m.class + '">'
          + '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px">'
          + '<div style="display:flex;justify-content:space-between;align-items:center">'
          + '<div style="font-size:16px;font-weight:800;color:var(--text)">' + m.icon + ' Phase ' + m.phase + ': ' + m.title + '</div>'
          + statusBadge
          + '</div>'
          + '<div style="font-size:13px;color:var(--text);margin-top:8px">' + m.desc + '</div>'
          + '<div style="font-size:11px;color:var(--muted);margin-top:6px">📅 Targeted / Milestone Date: ' + m.date + '</div>'
          + '</div></div>';
      }).join('')
    + '</div></div>';

  return header + timelineHtml;
};
}
