// Main Modular Frontend Application Entry Point
import { initServiceWorker } from './services/api.js';
import { renderMobileBottomNav } from './components/mobileNav.js';

console.log('🚀 RV Learning Hub LMS — Modular Frontend Initialized');

initServiceWorker();

export { renderMobileBottomNav };
