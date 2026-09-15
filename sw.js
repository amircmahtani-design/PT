/* Amir PT — service worker
   Network-first for the app itself, so a redeploy is ALWAYS picked up
   (the version stamp in Settings stays a reliable check).
   Cache-first for third-party assets, so the app opens with no signal. */
const CACHE = "amirpt-v131";
const SHELL = ["./", "./index.html", "./manifest.json"];
/* v123 — his own demo photographs. Pre-cached one at a time rather than with
   addAll, because addAll is atomic: a single 404 would throw away the whole
   install and leave him with no offline app at all. */
const DEMOS = [
  "90-90-hip-switches", "ab-wheel", "ankle-rocks-on-a-wall", "band-chest-fly",
  "band-clamshell", "band-lat-pulldown", "band-reverse-fly", "band-row",
  "band-shoulder-dislocate", "band-woodchop", "band-wrist-extension", "bear-crawl",
  "bird-dog", "box-breathing", "broad-jump", "burpee", "cable-fly", "chest-supported-row",
  "cobra-stretch", "criss-cross", "curtsy-lunge", "db-reverse-fly", "db-suitcase-carry",
  "dead-hang", "doorway-pec-opener", "doorway-pec-stretch", "double-leg-stretch",
  "farmer-carry", "high-knees", "hip-abduction", "hollow-rock", "jumping-jacks",
  "landmine-press", "lat-stretch-on-a-doorframe", "lateral-lunge", "leg-pull-front",
  "leg-swings-front-to-back", "leg-swings-side-to-side", "light-band-curls-and-pushdowns",
  "mermaid-stretch", "nordic-negative", "open-book-rotations", "plank-up-down",
  "prone-swimmer", "prone-y-t-w-raise", "prone-y-t-w-raises", "reverse-snow-angel",
  "reverse-snow-angel-hold", "roll-over", "roll-up", "rolling-like-a-ball", "saw",
  "scapular-push-ups", "shadow-boxing", "shoulder-bridge", "side-kick-series",
  "side-plank-rotation", "single-leg-circles", "single-leg-stretch", "skater-jump",
  "spine-stretch-forward", "spine-twist", "sprawl", "squat-thrust", "step-up",
  "supine-spinal-twist", "swan", "swimming", "teaser", "the-hundred", "towel-row",
  "wall-angel", "wall-sit", "wall-sit-march", "wall-slides"
];
const DEMO_FILES = DEMOS.reduce((a, s) => a.concat(["demos/" + s + "-1.jpg", "demos/" + s + "-2.jpg"]), []);

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c =>
    c.addAll(SHELL).catch(() => {})
      .then(() => Promise.all(DEMO_FILES.map(f => c.add(f).catch(() => {}))))
  ));
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
