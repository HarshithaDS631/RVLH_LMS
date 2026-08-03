// Mobile Bottom Navigation Bar Component
export function renderMobileBottomNav() {
  const existing = document.getElementById('mobile-bottom-nav');
  if (existing) existing.remove();

  const currentPage = window.G ? window.G.page : 'dashboard';

  const navHtml = '<div id="mobile-bottom-nav" class="mobile-bottom-nav">'
    + '<button class="mobile-nav-btn ' + (currentPage === 'dashboard' ? 'active' : '') + '" onclick="loadPage(\'dashboard\')"><span class="mobile-nav-icon">🏠</span><span>Home</span></button>'
    + '<button class="mobile-nav-btn ' + (currentPage === 'courses' ? 'active' : '') + '" onclick="loadPage(\'courses\')"><span class="mobile-nav-icon">📚</span><span>Courses</span></button>'
    + '<button class="mobile-nav-btn ' + (currentPage === 'videos' ? 'active' : '') + '" onclick="loadPage(\'videos\')"><span class="mobile-nav-icon">📹</span><span>Videos</span></button>'
    + '<button class="mobile-nav-btn ' + (currentPage === 'doubts' ? 'active' : '') + '" onclick="loadPage(\'doubts\')"><span class="mobile-nav-icon">💬</span><span>Doubts</span></button>'
    + '<button class="mobile-nav-btn ' + (currentPage === 'fees' ? 'active' : '') + '" onclick="loadPage(\'fees\')"><span class="mobile-nav-icon">💳</span><span>Fees</span></button>'
    + '</div>';

  document.body.insertAdjacentHTML('beforeend', navHtml);
}

window.renderMobileBottomNav = renderMobileBottomNav;
