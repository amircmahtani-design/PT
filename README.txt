AMIR PT — v43 · 2026-08-04
==========================

WHAT TO UPLOAD
--------------
Put all five files in the SAME folder at the root of your repo
(the same place index.html already lives):

  index.html               the app
  sw.js                    offline support        <- NEW, must sit next to index.html
  manifest.json            makes it installable   <- NEW, must sit next to index.html
  apple-touch-icon.png     unchanged
  apple-touch-icon-180.png unchanged

index.html works on its own. sw.js and manifest.json only add offline use
and installability — if you skip them, nothing breaks.

FILENAMES ARE CASE-SENSITIVE. It must be index.html, not Index.html.


AFTER DEPLOYING
---------------
1. Open the site, go to Settings, scroll to the bottom.
   The line should read: Amir PT · v43 · 2026-08-04
   If it says anything else, the old file is still being served — hard refresh.

2. Settings → App & Storage tells you the truth about your install:
     - whether you're running installed or in the browser
     - whether persistent storage was granted
     - how much space you're using
     - whether offline mode is live

3. If it says "Running in the browser", do Share → Add to Home Screen.
   This is what stops iOS quietly deleting your training history.

4. Offline mode needs two loads to activate (the worker installs on the
   first load, takes over on the second). Reload once and check again.


YOUR DATA
---------
Nothing is wiped by this update. localStorage is keyed to your domain, not
to the file, so replacing index.html leaves every logged set in place.
Photos migrate automatically to IndexedDB on first load.

Optional but worth it: Settings → Export a backup (JSON) before you deploy.


THE SERVICE WORKER IS DELIBERATELY NETWORK-FIRST
------------------------------------------------
A cache-first worker would serve you a stale app after a redeploy and make
the version stamp lie. This one always fetches the newest index.html when
you're online, and falls back to the last cached copy when you're not.


CLOUD SYNC — WHAT'S LEFT TO DO
------------------------------
The Firebase config for your PTchat project is already built into the app.
You do NOT need to paste anything into Settings.

Three clicks remain, and they're all in the Firebase console
(console.firebase.google.com -> PTchat), because I have no access to it:

  1. Firestore Database -> Create database -> Production mode
                        -> region europe-west1  (permanent, choose carefully)

  2. Authentication -> Get started -> Sign-in method
                    -> Anonymous -> Enable -> Save

  3. Firestore Database -> Rules -> paste firestore-rules.txt -> PUBLISH
     (Production mode denies everything until you publish these.)

Then open the app: Settings -> Cloud Sync -> Sync now.
Verify it worked in the Firebase console: Firestore -> Data. You should see
a collection "amirpt" containing a document named amir-9k3xq7.
If that document isn't there, it did not sync, whatever the app says.


YOUR SYNC ID IS IN THE PAGE SOURCE
----------------------------------
Sync ID: amir-9k3xq7

Because it's baked into index.html, anyone who views the source of your
public Netlify site can read it, and the rules above let any signed-in
user read that document. In practice that means your training log is
readable by someone who bothers to look.

If you'd rather it weren't: Settings -> Cloud Sync -> change the Sync ID to
something private, Save & Connect, and type the same value on each device.
Takes about twenty seconds per device and closes the hole.


YOUR OPENAI KEY
---------------
Deliberately never synced to the cloud — an API key doesn't belong in a
database. It lives only in the browser you typed it into, so you re-enter
it once per device, and again if storage is ever cleared.
Get a new one at platform.openai.com/api-keys


EXERCISE CATALOGUE — WORKOUTX
-----------------------------
Settings -> Exercise catalogue -> paste your wx_ key -> Save key
                               -> Download exercise catalogue

This runs ONCE. It pages through the free-plan endpoints 10 results at a
time (about 120 of your 500 monthly requests) and stores everything in
IndexedDB on the device. After that the app never calls WorkoutX again for
workouts - exercises, GIFs, difficulty, equipment and muscle tags all work
offline. Re-run it only when you want newly added exercises.

Free plan notes:
  - 500 requests/month, 30/min, max 10 results per call
  - GIFs are 180px with a small watermark
  - Multi-filter search and the workout generator are paid-only; the app
    uses the free single-filter endpoints instead and does the combining
    itself, so nothing is lost
  - If the sync stops early, tap it again - it keeps what it already has


TIME-BUDGETED SESSIONS
----------------------
Daily check-in: "How long have you got?" slider.
Train tab: 20 / 30 / 45 / 60 / 75 chips plus a row on/off toggle.

The bar underneath shows where the time actually goes:
  row 10m | 5m mobility | lifting 26m | 4m cool-down

The session is built to fit. Budget per set is roughly 40s work plus
70-105s rest depending on whether it's a compound lift, plus a minute to
change station. Turn the row off and that time goes back into lifting.
The rowing block only appears where you have the erg (Dubai).


SYNC IN DUBAI FIRST
-------------------
The catalogue downloads in the order that matters for where you currently
are. Set your location to Dubai BEFORE running the sync and it pulls
barbell -> dumbbell -> cable -> machines first, bodyweight later. If the
sync is ever cut short by the monthly quota, you keep the gym work.

If you sync while set to Greece it leads with bodyweight instead, which is
correct for Greece but not what you want as your main catalogue.


IS MY FIRESTORE ACTUALLY WORKING?
---------------------------------
Settings -> Cloud sync -> "Check my cloud backup"

It reads the document and writes nothing. You want to see:

  Backup found.
  Document      amirpt / <your sync id>
  Last written  <a recent date>
  In the cloud  N sessions - N lifts - N check-ins
  On this device  N sessions - N lifts - N check-ins

If it says "there is no backup yet", the connection and rules are FINE but
nothing has been uploaded - tap Sync now.

If it errors, the message names the console step that's missing.

Cross-check in the Firebase console: Firestore Database -> Data.
You should see collection "amirpt" containing a document named your Sync ID.
If that document is not there, you are not backed up, whatever the app says.


IF YOU REINSTALL THE APP
------------------------
Deleting a home-screen web app on iOS deletes its storage with it. Nothing
local survives that - not localStorage, not IndexedDB.

To get your history back on a fresh install:
  1. Settings -> Cloud sync
  2. Set the SAME Sync ID you used before
  3. Tap "Restore from cloud"

The app now also pulls before it pushes on startup, and REFUSES to upload
from a device with no logged history. An empty reinstall can no longer
overwrite your backup.


SET IT ONCE — STOP RE-ENTERING EVERYTHING
-----------------------------------------
Settings -> Cloud sync -> turn ON "Also sync my API keys"

From then on, your OpenAI key, WorkoutX key, Giphy key, coach tone,
rules, injuries, schedule and history all live in your Firestore. On a new
device you enter ONE thing - the Sync ID - and tap Restore from cloud.

Restore never overwrites a key already on the device, so it can't wipe a
newer key with an older one.

IMPORTANT before you turn it on: change your Sync ID to something private.
The Sync ID is visible in this page's source, and the Firestore rules let
any signed-in user read that document. With a guessable Sync ID, turning on
key sync means publishing your OpenAI key.

Settings -> Cloud sync -> Sync ID -> e.g. amir-7fk2q9x4 -> Save and connect
Do the same on each device.

WHY THE KEYS ARE NOT BUILT INTO index.html
------------------------------------------
Your Netlify site and its GitHub repo are public. An OpenAI key in page
source gets found by scrapers within hours - OpenAI itself scans public
repos and auto-revokes leaked keys - and until it is revoked, anyone can
spend money on your account. Cloud sync gives you the same convenience
without publishing the secret.


COACH TONE
----------
Settings -> Profile and rules -> "How the coach should talk to me"

Free text. It is injected into every AI call and explicitly overrides the
default personality line, so write it as instructions:
  "Blunt. No cheerleading. Short sentences. Tell me when I'm being soft,
   but never make light of the Klinefelter or the wrist."

FIXED IN v43: the "Coaching rules" and "Injuries and medical" boxes were
saved and redisplayed but never actually sent to the coach. Everything you
had typed there had been ignored. All three now reach the prompt.


ADDING TO YOUR IPHONE HOME SCREEN
---------------------------------
iOS gives a home-screen web app its OWN storage, completely separate from
Safari. Adding to home screen therefore starts a BLANK copy - nothing you
did in Safari carries across. This is iOS behaviour, not a bug in the app.

Because a blank copy also starts with the DEFAULT Sync ID, it cannot find
your data if you changed your Sync ID to something private.

So on the home-screen app, once:
  Today tab -> "Nothing logged on this device" card
  -> type your Sync ID -> Restore my history

After that the home-screen app syncs on its own. Do all your training in
the home-screen app from then on, not Safari - two copies with the same
Sync ID will merge, but it's simpler to use one.


HOW DEMOS GET RESOLVED (v43)
----------------------------
Your exercise names and WorkoutX's names rarely match exactly
("Barbell Back Squat" vs "barbell full squat"). Resolution order:

  1. A demo you or the coach deliberately chose
  2. A mapping the AI worked out before (cached forever, synced)
  3. Name matching on meaning - same movement noun, same equipment
  4. The AI: given a shortlist of ~45 candidates with their equipment
     and muscles, it picks the right one or answers NONE
  5. The small built-in demo table
  6. External "Watch demo" link (last resort only)

Step 4 costs ONE OpenAI call per exercise, ever. The answer is stored in
DB.exMap and synced, so a new device inherits every mapping you've already
resolved. A NONE is cached too - it won't keep asking about the same one.

If a demo looks wrong, tap "Wrong demo?" on the exercise. It clears the
mapping, re-matches, and if the string matcher can't do it, asks the coach.
The toast tells you which catalogue record it landed on.


WHERE THE EXERCISE CATALOGUE IS (v43)
-------------------------------------
Two places, both obvious now:

  Settings -> "Exercise catalogue" (now the FIRST section)
      key, download button, and a search box listing what you have
  Train tab -> "Browse all exercises"
      full screen: search, filter by muscle, "doable here" vs everything,
      demo thumbnails, tap Add to drop one into today's session

SETTINGS NOW COLLAPSES
----------------------
Every section is closed by default - tap a heading to open it. Which ones
you leave open is remembered.

GIPHY IS GONE
-------------
Removed from Settings entirely. Demos come from WorkoutX now.


GETTING YOUR EXERCISES (v43) - ONE BUTTON
-----------------------------------------
Settings -> Exercise catalogue -> "Get my exercises"

It checks your cloud backup first and restores from there for FREE (zero
WorkoutX requests). Only if there is no backup does it download from the
API. After any download it backs the catalogue up automatically, so you
never pay for the same exercises twice.

"Force a fresh download" is there if you want newly added exercises. It
warns you about the request cost and asks first.

The status line tells you the truth:
  489 exercises on this device - demos matched for 58/62 of your
  regular lifts - cloud backup: 489 exercises

WHY YOU LOST THE 489
--------------------
The catalogue lives in IndexedDB. The write was fire-and-forget with the
error swallowed, so if the browser refused it the app carried on as if it
had worked - the exercises were only ever in memory and vanished on
reload. v43 writes, reads it back, and tells you if it did not stick. If
IndexedDB is blocked it falls back to localStorage, and it is backed up to
your Firestore either way.


IF DEMOS ARE MISSING (v43)
--------------------------
Settings -> Exercise catalogue -> "Match demos to my exercises"

Your exercise names and WorkoutX's names differ, so plain text matching only
gets some of them. This button hands every unmatched one to the AI, which
reads the catalogue and picks the right record. Costs one OpenAI call per
exercise, ONCE - and zero WorkoutX requests. The result is cached and
backed up to your cloud.

Run it after any catalogue download.

RATE LIMIT vs QUOTA
-------------------
The free plan allows 30 requests a MINUTE as well as 500 a month. The app
used to fire requests back to back, hit the per-minute limit, and then
report it as "monthly quota used up" - which was wrong and alarming.

It now paces itself to 25/minute, pauses 20 seconds and resumes if it is
still rate limited, and only says the monthly quota is gone when the API
actually reports zero remaining. A failed or partial sync now backs up what
it did get, so nothing is wasted.


GETTING THE CATALOGUE ONTO YOUR IPHONE (v43)
--------------------------------------------
ON THE DESKTOP, in order:

  1. Settings -> Cloud sync -> check it says connected
  2. Settings -> Exercise catalogue -> "Save my exercises to the cloud"
     Wait for: "602 exercises saved to your cloud in 4 parts"
  3. Settings -> Exercise catalogue -> "Match demos to my exercises"
  4. "Save my exercises to the cloud" again (so the phone gets the matches)

ON THE IPHONE:

  5. Settings -> Exercise catalogue -> "Get my exercises"
     It restores from the cloud. Zero WorkoutX requests.

The status line must say "cloud backup: 602 exercises". If it still says
"no cloud backup yet", step 2 did not work - check Cloud sync.

WHY THE DEMOS WERE BROKEN IMAGES
--------------------------------
WorkoutX GIF URLs need your API key sent as a request header. An <img> tag
cannot send headers, so the browser got a 401 and showed a broken image or
fell back to an external "Watch demo" link. The app now catches that,
re-fetches the GIF properly with your key, and swaps it in.

Your API key therefore needs to be on each device for demos to display.
Turn on "Also sync my API keys" in Cloud sync and the phone gets it too.
