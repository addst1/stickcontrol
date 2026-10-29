// Service Worker - 오프라인 지원 (네트워크 우선, 실패 시 캐시)
const VERSION = '0.4.1';
const CACHE = 'starcontrol-v' + VERSION;
const ASSETS = ['./', './index.html', './game.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png',
  './assets/bg_terran.jpg', './assets/bg_protoss.jpg', './assets/bg_zerg.jpg',
  './assets/floor_terran.jpg', './assets/floor_protoss.jpg', './assets/floor_zerg.jpg',
  './assets/p_marine.jpg', './assets/p_dragoon.jpg', './assets/p_hydra.jpg',
  './assets/s_marine.png', './assets/s_dragoon.png', './assets/s_hydra.png',
  './assets/e_infested.png', './assets/e_hydra.png', './assets/e_marine.png', './assets/e_dragoon.png',
  './assets/boss_zerg.png', './assets/boss_terran.png', './assets/tower_zerg.png', './assets/tower_terran.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })
      .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
  );
});
