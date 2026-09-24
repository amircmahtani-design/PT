/* Amir PT — service worker
   Network-first for the app itself, so a redeploy is ALWAYS picked up
   (the version stamp in Settings stays a reliable check).
   Cache-first for third-party assets, so the app opens with no signal. */
const CACHE = "amirpt-v209";
const SHELL = ["./", "./index.html", "./manifest.json"];
/* v123 — his own demo photographs. Pre-cached one at a time rather than with
   addAll, because addAll is atomic: a single 404 would throw away the whole
   install and leave him with no offline app at all. */
const DEMOS = [
  "90-90-hip-switches", "ab-wheel", "ankle-rocks-on-a-wall", "band-chest-fly",
  "child-s-pose",
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
  "supine-spinal-twist", "swan", "swimming", "teaser", "towel-row",
  "wall-angel", "wall-sit", "wall-sit-march", "wall-slides"
];
/* v146 — the second batch is one WebP per movement rather than a pair of
   JPGs, so both positions are in a single frame. Keep this in step with
   LOCAL_WEBP in index.html. */
const DEMOS_WEBP = [
  "archer-push-up", "arm-circles", "band-anti-rotation-hold", "band-calf-raise",
  "band-chest-press", "band-curl", "band-dead-bug", "band-external-rotation",
  "band-face-pull", "band-glute-bridge", "band-hammer-curl", "band-kickback",
  "band-lateral-walk", "band-leg-curl", "band-monster-walk", "band-overhead-press",
  "band-overhead-triceps-extension", "band-pallof-press", "band-pull-apart", "band-pull-aparts",
  "band-push-up", "band-romanian-deadlift", "band-shoulder-dislocates", "band-single-arm-row",
  "band-straight-arm-pulldown", "band-triceps-pushdown", "barbell-back-squat", "barbell-curl",
  "barbell-row", "bench-dip", "bench-press", "bicycle-crunch",
  "bodyweight-squat", "bodyweight-squat-to-depth", "box-jump", "brisk-walk-or-skipping",
  "bulgarian-split-squat", "cable-crunch", "cable-lateral-raise", "calf-raise",
  "calf-stretch-on-a-wall", "cat-cow", "chin-up", "close-grip-bench-press",
  "concept2-row-easy", "cossack-squat", "couch-stretch-hip-flexor", "cross-body-shoulder-stretch",
  "db-arnold-press", "db-bench-press", "db-calf-raise", "db-chest-fly",
  "db-clean-and-press", "db-concentration-curl", "db-curl", "db-floor-press",
  "db-front-raise", "db-front-squat", "db-kickback", "db-pullover",
  "db-push-press", "db-romanian-deadlift", "db-row", "db-russian-twist",
  "db-shoulder-press", "db-shrug", "db-side-bend", "db-single-arm-row",
  "db-single-leg-rdl", "db-skull-crusher", "db-sumo-deadlift", "db-swing",
  "db-thruster", "db-upright-row", "db-zottman-curl", "dead-bug",
  "deadlift", "decline-push-up", "diamond-push-up", "dip",
  "face-pull", "figure-4-glute-stretch", "flutter-kick", "front-squat",
  "glute-bridge", "goblet-squat", "hammer-curl", "hanging-knee-raise",
  "hindu-push-up", "hip-thrust", "hollow-hold", "incline-bench-press",
  "incline-db-press", "incline-push-up", "inverted-row", "jump-squat",
  "kettlebell-swing", "lat-pulldown", "lateral-raise", "leg-raise",
  "mountain-climber", "nordic-curl", "overhead-press", "overhead-triceps-extension",
  "overhead-triceps-stretch", "pike-push-up", "pistol-squat", "plank",
  "plank-shoulder-tap", "pull-up", "push-up", "renegade-row",
  "reverse-lunge", "reverse-plank", "romanian-deadlift", "russian-twist",
  "scapular-pull-ups", "scissors", "seated-cable-row", "side-plank",
  "single-leg-calf-raise", "single-leg-glute-bridge", "single-leg-kick", "split-squat",
  "standing-hamstring-stretch", "superman-hold", "triceps-pushdown", "tuck-jump",
  "v-up", "walking-lunge", "wide-push-up", "world-s-greatest-stretch",
  "the-hundred",
  "wrist-circles-and-gentle-flexor-stretch", "wrist-flexor-and-extensor-stretch"
];
const DEMO_FILES = DEMOS
  .reduce((a, s) => a.concat(["demos/" + s + "-1.jpg", "demos/" + s + "-2.jpg"]), [])
  .concat(DEMOS_WEBP.map(s => "demos/" + s + ".webp"));

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
