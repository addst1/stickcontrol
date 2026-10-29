// Service Worker - 네트워크 우선, 실패 시 캐시
const VERSION = '1.3.0';
const CACHE = 'stickcount-v' + VERSION;
const ASSETS = ['./', './index.html', './game.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then((r) => {
    const cp = r.clone();
    caches.open(CACHE).then((c) => c.put(e.request, cp)).catch(() => {});
    return r;
  }).catch(() => caches.match(e.request).then((m) => m || caches.match('./index.html'))));
});
