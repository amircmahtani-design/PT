AMIR PT — v61.4 · 06/08/2026
============================

Deploy exactly as before: index.html, sw.js, manifest.json and the two icons
in the same folder, at the repo root. Only index.html changed this time.

Check it landed: Settings -> bottom -> "Amir PT · v61 · 06/08/2026".
Nothing in this update touches your data. Every logged set survives.


DO THIS FIRST — YOU HAVE NO DEMOS RIGHT NOW
===========================================
  1. Deploy v61.
  2. Settings -> Demo GIFs -> "Get the free demo pack".
  3. Settings -> Demo GIFs -> "Save the matched ones to this phone".

That gets you animated demos back TODAY, for free, without spending a single
one of your remaining WorkoutX requests. Details below.


=============================================================
v61.4 — THE PACK NOW LOOKS AFTER ITSELF
=============================================================

UPLOAD BOTH index.html AND sw.js THIS TIME. The service worker cache name
changed, which is what forces the phone to pick up the new build.

FIRST, A CORRECTION I OWE YOU
  I said "you already hold all 800 on your phone". That was wrong to state as
  fact. Two reasons it may not be true:

  iOS DOES NOT KEEP INDEXEDDB FOREVER. Safari evicts script-writable storage
  from sites you haven't opened in a while, and deleting the home-screen icon
  clears it outright. "Saved on this phone" was never a promise I could keep,
  and I shouldn't have phrased it as one.

  AND THE IMAGES NEVER NEEDED TO BE ON THE PHONE ANYWAY. They're public URLs
  that stream on demand, like any web image. Saving them locally only buys you
  offline use. So if nothing is appearing, storage was never the problem —
  something was stopping them LOADING.

WHAT ACTUALLY GOES IN FIREBASE
  The INDEX — the list that maps your exercises to the right photographs. That's
  about 120 KB, and it now sits in Firestore next to your workout data, in the
  same collection your existing rules already cover. It restores itself
  silently on any device, so an eviction costs you nothing.

  The photographs themselves stay on the CDN. 800 movements x 2 frames is
  ~65 MB, far past what Firestore will hold, and there would be no point —
  they're free public files that load on demand. What has to survive is the
  index, and now it does.

THREE MIRRORS INSTEAD OF ONE
  Everything came from raw.githubusercontent.com, which is exactly the kind of
  host that gets throttled or blocked on some networks. When it failed,
  NOTHING rendered — which looks identical to "the pack isn't on my phone".

  The same public-domain files are now pulled from GitHub raw, jsDelivr or
  githack, whichever answers. It switches automatically, remembers the one
  that worked, and even a single failed image retries on another mirror.

NO MORE HUNTING FOR A BUTTON
  If the pack is missing at startup the app now restores it from Firebase, or
  failing that downloads it from a mirror, on its own. Both are free and
  neither touches your WorkoutX allowance, so there was nothing to ask about.

"CHECK WHAT'S WORKING"  (Settings -> Demo GIFs)
  Tells you plainly which part is broken instead of leaving you to guess:
  whether the index is on the phone, how many frames are saved, which of the
  three mirrors are reachable, whether Firebase is connected and backed up,
  and how many of your exercises matched.

  Run this first if demos are still missing, and send me what it says.

=============================================================
v61.3 — DEMO COVERAGE: SEE EVERY GAP AND EVERY WRONG MATCH
=============================================================

ABOUT "CAN YOU FIND MORE GIFS LIKE THE BENCH PRESS ONE"

That Bench Press image IS the free pack. The photographic style you like is
Free Exercise DB, and you already hold the entire thing — 800+ movements — on
your phone. There is no larger collection of that style to go and find,
because that dataset is the collection. It came out of one source set
(wrkout/exercises.json) and nobody has published a bigger free one in the
same style.

So the useful question isn't "where are more" — it's "which of my exercises
didn't get matched to one", and "which got matched to the wrong one". That's
what this adds.

SETTINGS -> DEMO GIFS -> "WHICH OF MY EXERCISES HAVE NO DEMO?"

  Every movement you train, listed with the demo currently attached to it and
  where that demo came from: your own choice, a saved clip, the free pack,
  WorkoutX, or nothing at all.

  A wrong match is now visible in a list BEFORE you meet it mid-set, instead
  of after. Landmine Press showing a bench press would have been obvious here.

  Every row has a button. Gaps say "Find one", the rest say "Change". Both
  open a search across all 800+ free-pack movements right there in the row —
  you don't have to wait until that exercise turns up in a session.

  Anything you set here is stored as YOUR choice and is never overwritten by
  the automatic matcher, same as in Train.

  The counter at the top tells you where you stand: how many exercises, how
  many gaps, how many you've picked yourself.

WHY THE MATCHER LEAVES GAPS ON PURPOSE
  It's tuned to refuse rather than guess, because a hamstring exercise showing
  a biceps demo is worse than showing nothing. That means some exercises come
  up empty even when a decent clip exists in the pack under a name it couldn't
  connect. Searching by hand finds those — "landmine" will surface every
  landmine movement even when the matcher wouldn't commit to one.

IF THE FREE PACK GENUINELY LACKS SOMETHING
  wger (wger.de) is the other free option: open source, CC-BY-SA, free API,
  no key. Two honest caveats — its image coverage is patchy because it's
  community-contributed, so many exercises have no picture at all, and the
  ones that do are a mix of photos and line drawings rather than the
  consistent style you liked. It's a gap-filler, not a replacement. Tell me
  which exercises are still empty after you've been through the coverage list
  and I'll see whether it covers them before wiring anything in.

=============================================================
v61.2 — "WRONG DEMO?" NOW ACTUALLY LETS YOU CHANGE IT
=============================================================

You were right that it was overriding you. Two separate faults.

FAULT ONE: THE FIRST PRESS DIDN'T OPEN A CHOOSER
  It ran the automatic matcher again — wiping any mapping you had and
  re-guessing. The chooser only appeared on the SECOND press, and the flag
  tracking that lived in memory, so every reload put you back to square one.
  In practice you could press it forever and only ever get another guess.

  Now: ONE press opens the list. Auto-matching is a button INSIDE the list
  ("Let the coach find it for me"), so it only ever runs because you asked.

FAULT TWO: THE LIST ONLY HELD WORKOUTX CLIPS
  Landmine Press is coming from the free pack, and the free pack wasn't in the
  picker at all. Worse, with no WorkoutX catalogue on the device the picker
  refused to open — so exactly when you most need to fix a demo, you were
  locked out of the only tool for fixing it.

  Now the list shows BOTH sources, labelled, with thumbnails. It opens with
  the free pack alone. Type "landmine" and you get every landmine movement in
  it.

YOUR CHOICE IS NOW A FACT, NOT A HINT
  Whatever you pick is stored against that exercise and consulted BEFORE every
  automatic source. Nothing displaces it: not a re-match, not a fresh
  catalogue sync, not a failed remote clip, not the free pack matcher.

  The button reads "Change demo" once you've set one, and the panel gains an
  "Undo my choice" option that hands it back to the matcher — your call, not
  the app's.

  "Use no demo" is also a real choice now and sticks the same way.

=============================================================
v61.1 — WHY EVERY DEMO WAS A FROZEN PHOTOGRAPH
=============================================================

My fault, and the cause was the fix itself: pressing "Save the matched ones to
this phone" is what BROKE the animation.

The free pack stores TWO frames per movement. The save routine filed frame 0
under the exercise name — and the app's normal image lookup then found "a demo
already saved for this exercise" and rendered it on its own. One still. Frozen.
Frame 2 was sitting on your phone the whole time, downloaded and unused.

FIXED FOUR WAYS

  1. Saved free-pack frames are now TAGGED as a pair, so the ordinary image
     path leaves them alone and hands them to the animator. Frames saved by
     v61 have no tag, so the companion frame is used as the giveaway instead —
     nothing needs re-downloading.

  2. When a remote clip fails to load and the free pack covers that movement,
     the tile is now REPLACED with the animated pair rather than settling for
     one frozen frame. That was the specific path your Bench Press hit.

  3. A remote clip that has already failed once is REMEMBERED, so the sheet
     stops requesting a dead URL and flashing a broken tile on every render.
     Only ever recorded when the free pack can actually cover it. "Wrong demo?"
     clears it and gives the original another go.

  4. The flip is faster (0.8s), frame 2 is PRELOADED so the first flip isn't a
     blank box, and each frame is now LABELLED "start" / "end" in the corner.
     Two photos alternating is ambiguous on its own — you can't tell which one
     is the bottom of the lift. The label is the thing that makes it readable.

ALSO FIXED: "LAST TIME (NaNd AGO)"
  Seeded history carries the date "prev" rather than a real one, and that came
  out of the arithmetic as NaN. It now reads "Last time (last session)" when
  there's no real date — no date means no claim about when.

HONEST LIMIT
  This is still two photographs alternating, not a true GIF. It shows you the
  start and the end of the movement, labelled. It does not show the path
  between them. For anything you're unsure of, the "▶ demo" corner link still
  opens real video. When your WorkoutX allowance resets, the proper animated
  clips can be saved permanently with one button and this becomes the fallback
  rather than the main event.


1. WHY YOUR 500 REQUESTS DISAPPEARED
=====================================
This was a real bug, and it was worse than "I kept retrieving them".

A catalogue GIF sits behind your WorkoutX key. An <img src> tag cannot send a
header, so every one of them failed with a 401 on load. The app caught that
failure and re-fetched the file properly with the key — and cached the result
in a plain JavaScript object.

That object was MEMORY ONLY. Every reload, every cold start, every time iOS
evicted the tab, it was empty again and every GIF on the sheet was bought a
second time. An eleven-exercise session cost eleven requests. Open Train twice
in a day, twenty-two. A full catalogue sync is about 120 of your 500 — the
other ~380 went on re-buying files you had already paid for.

Nothing was ever downloaded INTO the app. You were renting the same files over
and over.

WHAT CHANGES
  The bytes now go into IndexedDB on the phone, keyed by exercise name, with a
  small index so a cold start knows what it has without reading every blob.
  Once a movement is saved it renders from the phone forever, offline, free.

  AND NOTHING IS FETCHED ON ITS OWN ANY MORE. "Fetch missing demos
  automatically" is OFF by default. A session with eleven unsaved movements now
  costs nothing until you press a button. Leave it off.

  Order of preference when a demo is needed, cheapest first:
    1. already on this phone      (free, instant, works offline)
    2. a free public source       (free)
    3. the free demo pack         (free — see section 2)
    4. WorkoutX with your key     (costs one request — only if you allowed it)

  Requests are counted and shown in Settings. The counter reads WorkoutX's own
  quota header when it has one, but ignores a reading from a previous month —
  otherwise last month's "0 remaining" would lock you out after the reset.

BACKUP
  IndexedDB survives redeploys. It does NOT survive deleting the home-screen
  app. "Save my saved GIFs to a file" gives you a file to keep in Dropbox or
  Drive; loading it back costs nothing.


2. THE FREE DEMO PACK — 800+ MOVEMENTS, NO KEY, NO QUOTA
=========================================================
Free Exercise DB is a public-domain dataset (Unlicense) of 800+ exercises,
hosted free on GitHub. No key, no account, no monthly allowance, ever.

Each exercise ships TWO frames — the start and the end of the movement. The app
alternates them about once a second, so you get the actual movement rather than
a still photograph. It is not as slick as a real GIF. It is free, and it is
there right now.

It is downloaded once, matched against your library by name, equipment and
muscle group, and then cached like anything else.

MATCHING WAS TUNED TO REFUSE RATHER THAN GUESS. On a 36-exercise test it placed
33 correctly and missed 3. The two it originally got WRONG were the important
ones:

  "Deadlift"    was landing on "Romanian Deadlift"
  "Nordic Curl" was landing on "Hammer Curls"

A hamstring exercise showing a biceps demo is worse than showing nothing. Two
rules fixed it: equipment words in a name are treated as noise ("Barbell
Squat" and "Squat" are the same lift), but any OTHER extra word is a qualifier
that changes the movement and counts against the match. Both now resolve
correctly or honestly refuse.

Anything it can't place still gets the tappable "Watch demo" link, and you can
override any demo yourself as before.


3. PHOTOS — A TIMELINE, NOT A PILE
===================================
TAP A PHOTO AND ACTUALLY SEE IT
  Full-screen viewer with the date, how long ago it was, arrows to move through
  your shots, a label picker and a delete button.

DATES AND FOLDERS
  Every photo now carries a real timestamp and an angle: Front / Side / Back /
  Legs / Other. They group into months, newest month first, and filter by angle
  along the top. Each thumbnail shows its date day-first and "4 weeks ago".

  Your existing photos are migrated automatically. They keep their dates and
  start out unlabelled — tap one and set the angle.

THEN & NOW
  Two photos side by side with the gap spelled out. Quick buttons for 1 month,
  3 months, 6 months and first-vs-latest.

  It compares like with like: a front shot against a front shot. Which angle it
  uses is chosen by which one actually has the history to cover the gap you
  asked for — not by whichever photo you happened to add last, which is
  arbitrary when you shoot three angles in one go. If there's no photo on the
  exact date it takes the nearest and tells you how far off it is.

  Your bodyweight around both dates is shown underneath when a check-in exists
  near enough to each.

  "Ask coach what's changed" sends both to the AI, oldest first, and is told to
  say so if the lighting or angle differs too much to tell — rather than
  inventing progress.


4. MEASUREMENTS
================
A collapsible panel under the photos. Chest, waist, hips, shoulders, arm,
thigh, calf, neck — with a history table, and the change since your first entry
next to it.

ESTIMATES FROM PHOTOS
  "Estimate from my photos" reads your latest shots and gives circumferences
  and a body-fat figure. It needs your height first and refuses without it —
  there is nothing to scale a photograph against otherwise, and any number
  would be invented.

  Those entries are tagged EST everywhere they appear. They are a direction of
  travel, not numbers to quote to the centimetre. A measurement you take
  yourself on the same day replaces the estimate rather than sitting beside it.

  The change column is deliberately NOT colour-coded. Green-for-bigger would
  call a wider waist progress and a narrower one failure, which depends
  entirely on the phase you're in. The number and its sign say everything that
  is actually known.

Measurements sync across your devices. Photos still don't — too big for a
Firestore document.


5. TRAIN — TODAY'S SESSION IS A DROPDOWN
=========================================
At the top of Train, above "Build today's session". One tap to swap Push Day
for Pilates without going back to Home.

It writes the same day override the weekly plan writes, so the two can't
disagree, and it rebuilds the sheet immediately. The line beside it tells you
when you've swapped away from what was planned.


6. ABOUT THE RENPHO TAPE
=========================
No live link is possible, and it isn't a limitation of your app:

  - iOS Safari has no Web Bluetooth at all, so a home-screen web app cannot
    talk to the tape directly.
  - Apple Health has no web API. Only a native app can read it.
  - Renpho has no official public API. The unofficial ones need your Renpho
    password sitting in your page source and break whenever Renpho ships an
    update.

The route that works is the export: measure -> it syncs to the Renpho app over
Bluetooth -> Trends -> Circumference -> clock icon -> select data -> export as
CSV -> import into Amir PT. An importer is not in v61 yet; send me one exported
file once the tape arrives and I'll build the parser against the real format
rather than guessing at it.

TWO THINGS ON DAY ONE
  Hold [M] for about a second to switch from straight-line to CIRCUMFERENCE
  mode. There is a 2.1 cm difference between the two, because the tape has to
  feed into the receptacle when measuring a circumference. In the wrong mode
  every number you log is 2.1 cm out.

  Set it to CENTIMETRES. That's what the measurement store uses.


7. WHAT WAS FOUND AND FIXED WHILE TESTING
==========================================
PHOTO IDENTITY WAS A TIMESTAMP. Two photos added in the same session could
share one, so "the photo at time T" silently returned the wrong one. Identity
is now the photo's own id.

A VARIABLE IN THE TEMPORAL DEAD ZONE. The saved-GIF lookup guards on
"typeof GIFURL", and it runs during the first render. With `let`, even typeof
throws — the guard would have been the thing that broke your session sheet.

RELABELLING A PHOTO OUT OF THE CURRENT FILTER left the viewer pointing at
somebody else's photo. It now closes instead of silently swapping.

THE DEFAULT COMPARISON paired a front shot against a side one, then printed a
warning about its own choice.
