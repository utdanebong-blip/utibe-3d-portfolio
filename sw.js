const CACHE_NAME = 'portfolio-video-cache-v1';
const VIDEO_EXT_RE = /\.(mp4|webm|ogg)(\?.*)?$/i;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  try {
    const req = event.request;
    // Only handle GET requests
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    // Only attempt to cache typical video file URLs or requests with destination 'video'
    const isVideoExt = VIDEO_EXT_RE.test(url.pathname) || req.destination === 'video';
    if (!isVideoExt) return;

    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);

      // Try to serve from cache first
      const cached = await cache.match(req);
      if (cached) {
        return cached;
      }

      // Otherwise fetch from network and cache the response (if successful)
      try {
        const resp = await fetch(req.clone());
        // Only cache successful responses
        if (resp && resp.ok) {
          // Put a clone into the cache
          cache.put(req, resp.clone()).catch(() => {});
        }
        return resp;
      } catch (err) {
        // network failed, try to return cached (if any)
        const fallback = await cache.match(req);
        if (fallback) return fallback;
        throw err;
      }
    })());
  } catch (e) {
    // swallow errors and let the request go to network
  }
});
