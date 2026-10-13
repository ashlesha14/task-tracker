const CACHE = "tasks-v11";
const FILES = ["./", "./index.html", "./manifest.json", "./firebase-config.js", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // cache only the app's own files, Firebase SDK scripts and fonts; never Firebase data or login traffic
  const cacheable = url.origin === self.location.origin || url.host === "www.gstatic.com" || url.host.endsWith("fonts.googleapis.com") || url.host === "fonts.gstatic.com";
  if (e.request.method !== "GET" || !cacheable) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});


