AMIR PT — v27 · 2026-08-04
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
   The line should read: Amir PT · v27 · 2026-08-04
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
