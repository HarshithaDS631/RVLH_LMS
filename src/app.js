// Main Modular Frontend Application Entry Point
import { initServiceWorker } from './services/api.js';
import { renderMobileBottomNav } from './components/mobileNav.js';
import { registerAllPages } from './pages/index.js';

console.log('🚀 RV Learning Hub LMS — Modular Frontend Initialized');

initServiceWorker();

export function initPages(PAGES) {
  registerAllPages(PAGES);
}

export { renderMobileBottomNav };
