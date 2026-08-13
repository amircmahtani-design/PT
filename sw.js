/* Amir PT — service worker
   Network-first for the app itself, so a redeploy is ALWAYS picked up
   (the version stamp in Settings stays a reliable check).
   Cache-first for third-party assets, so the app opens with no signal. */
const CACHE = "amirpt-v108";
const SHELL = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Never cache API traffic — OpenAI, Firestore, Giphy must always go to the network.
  if (/openai\.com|googleapis\.com|firebaseio|giphy\.com|gstatic\.com\/firebasejs/.test(url.host + url.pathname)) return;

  // The app shell: network first, fall back to the last good copy when offline.
  if (req.mode === "navigate" || /\.html?$/.test(url.pathname) || url.pathname === "/" ) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  // Everything else (icons, exercise GIFs): cache first, refresh in the background.
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res && res.status === 200 && res.type !== "opaque") {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
