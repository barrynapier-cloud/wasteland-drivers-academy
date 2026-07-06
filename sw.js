// ============================================================
// PERMIT LEGENDS — service worker
// Strategy:
//   - HTML/JS/CSS/JSON: network-first (deploys land immediately),
//     falling back to cache when offline.
//   - images/ and audio/: cache-first (large, effectively immutable;
//     new art ships under new filenames or themes).
// Bump VERSION on breaking cache-shape changes.
// ============================================================
const VERSION = 'pl-v1';
const CORE = [
  '/play.html',
  '/index.html',
  '/unlock.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;

  const isMedia = url.pathname.startsWith('/images/') || url.pathname.startsWith('/audio/');

  if (isMedia) {
    // cache-first
    e.respondWith(
      caches.open(VERSION).then(async (c) => {
        const hit = await c.match(e.request, { ignoreSearch: true });
        if (hit) return hit;
        const res = await fetch(e.request);
        if (res.ok) c.put(e.request, res.clone());
        return res;
      })
    );
  } else {
    // network-first for code and pages
    e.respondWith(
      fetch(e.request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(VERSION).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() =>
        caches.open(VERSION).then(c => c.match(e.request, { ignoreSearch: true }))
          .then(hit => hit || caches.match('/play.html'))
      )
    );
  }
});
