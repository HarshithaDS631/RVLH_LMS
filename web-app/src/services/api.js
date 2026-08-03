// Central API & Authentication Service
export const API = ''; // Proxied via Vite
export let token = localStorage.getItem('lms_token') || null;

export function setToken(newToken) {
  token = newToken;
  if (token) {
    localStorage.setItem('lms_token', token);
  } else {
    localStorage.removeItem('lms_token');
  }
}

export async function api(endpoint, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API + endpoint, { ...opts, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// Service Worker Registration for PWA & Mobile Store Apps
export function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
}
