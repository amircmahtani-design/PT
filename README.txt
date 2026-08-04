AMIR PT — v55 · 04/08/2026
==========================

Deploy exactly as before: index.html, sw.js, manifest.json and the two icons
in the same folder, at the repo root. Filenames are case-sensitive —
index.html, never Index.html.

Check it landed: Settings → bottom → "Amir PT · v55 · 04/08/2026".
Nothing in this update touches your data. Every logged set survives.


WHAT'S NEW IN v55
=================

NEW APP ICON — THE PT MARK
---------------------------
Your orange PT icon is in. Two things were done to it first:

  MADE FULL-BLEED. iOS applies its OWN rounded mask to a home-screen icon. The
  artwork already had rounded corners with transparency around them, so it would
  have been rounded twice, with dark corners showing through. It's been cropped
  19% past its own border so the square is edge-to-edge orange and iOS's mask is
  the only rounding.

  MADE OPAQUE. Transparency in an apple-touch-icon composites against black on
  some iOS versions. There is none left.

Supplied at 1024x1024 and 180x180. The browser-tab favicon is a matching PT
mark drawn inline, so it needs no network.

FILES CHANGED: index.html, apple-touch-icon.png, apple-touch-icon-180.png.
UPLOAD ALL THREE. The old index.html pointed at an inline barbell drawing
rather than at the PNGs, so replacing only the images would change nothing.


CHANGING THE ICON MEANS DELETING AND RE-ADDING — DO THIS FIRST
---------------------------------------------------------------
iOS snapshots the icon when the shortcut is created. An existing home-screen
icon will NOT update, however many times you redeploy. You have to remove it
and add it again — and removing a home-screen web app on iOS DELETES ITS
STORAGE, which is every set you have logged on that device.

Do these three, in this order, BEFORE you delete anything:

  1. Settings -> Cloud sync -> WRITE DOWN YOUR SYNC ID.
     This is the step people skip. A fresh install starts with the DEFAULT id
     (amir-9k3xq7). If you ever changed yours, the new copy cannot find your
     data — and you cannot look the old id up, because you just deleted the
     app that was holding it.

  2. Settings -> Cloud sync -> "Check my cloud backup".
     "In the cloud" must match "On this device". If it is behind, tap Sync now
     and check again.

  3. Settings -> Export a backup (JSON).
     A file on your phone that nothing can evict. Thirty seconds, belt and
     braces.

THEN:
  4. Deploy v55 (index.html + both PNGs).
  5. Delete the home-screen icon.
  6. Safari -> your site -> Share -> Add to Home Screen. New icon appears.
  7. Open it. The "Nothing logged on this device" card appears: type your Sync
     ID, tap "Restore my history". Everything comes back.

Deploy v55 and delete/re-add in one go — that way you pay the cost once and
pick up everything from v48 to v55 at the same time.


WHAT'S NEW IN v54
=================

EVERY SESSION TYPE, EVERY LOCATION — ALL DEEP ENOUGH TO ROTATE
---------------------------------------------------------------
v53 added rotation but the menus behind it were uneven. Dubai was fine; Madrid
and Greece were thin enough that you'd still repeat yourself inside a fortnight.
Fourteen of the twenty-seven pools were too shallow — Greece arms had six
movements, Greece pull had seven.

70 new exercises added, weighted towards the places that needed them:

  BODYWEIGHT (Greece)  Cossack Squat, Split Squat, Lateral Lunge, Curtsy Lunge,
    Shrimp Squat, Single-leg Calf Raise, Skater Jump, Broad Jump, Tuck Jump,
    Wall Sit March, Nordic Negative, Wide/Incline/Hindu/Pseudo-Planche Push-up,
    Plank Shoulder Tap, Plank Up-Down, Towel Row, Reverse Plank, Prone Swimmer,
    Wall Angel, Bicycle Crunch, Leg Raise, V-Up, Russian Twist, Flutter Kick,
    Side Plank Rotation, Bear Crawl, Hollow Rock, High Knees, Jumping Jacks,
    Sprawl, Squat Thrust, Shadow Boxing

  DUMBBELL (Madrid)  DB Single-leg RDL, Sumo Deadlift, Lateral Lunge, Calf
    Raise, Swing, Push Press, Arnold Press, Upright Row, Front Raise, Reverse
    Fly, Chest Fly, Pullover, Shrug, Concentration Curl, Zottman Curl, Skull
    Crusher, Kickback, Russian Twist, Side Bend, Suitcase Carry, Windmill,
    Clean and Press, Single-arm Row

  GYM (Dubai)  Incline Bench, Close-grip Bench, Barbell Curl, Good Morning,
    Hack Squat, Leg Curl, Leg Extension, Standing Calf Raise, Hip Abduction,
    Cable Fly, Cable Lateral Raise, Cable Crunch, Chest-supported Row, Ab Wheel,
    Kettlebell Swing, Box Jump, Dip, Landmine Press

EVERY POOL IS NOW 13-22 MOVEMENTS DEEP. All 27 combinations checked:

                dubai      madrid     greece
  legs            19          22         21
  push            21          19         15
  pull            20          18         14
  upper           19          18         16
  full            18          18         17
  core            19          19         20
  arms            17          14         13
  hiit            18          19         17
  pilates         20          19         19

Four weeks of any type in any location now gives 13-20 DISTINCT exercises.

Every name resolves to a real library entry with its own cue and its own
wrist-safe (TFCC) alternative — 158 exercises total, all checked, no
duplicates inside a pool. Location filtering still applies on top, so Greece
never sees a dumbbell.


WHAT'S NEW IN v53
=================

NO MORE DOING THE SAME FIVE EXERCISES FOREVER
----------------------------------------------
Every leg day was Barbell Back Squat, Romanian Deadlift, Bulgarian Split Squat,
Nordic Curl, Plank. Every single time. Same for push, pull, and every custom
type — each group was a fixed five-item list that got sliced whole.

Each group is now a DEEP MENU split into anchors (the compound the session is
built around) and accessories. The session is drawn by ROTATION: whatever
you've gone longest without doing comes up first, read from what you actually
logged.

Six consecutive leg days now look like this:

  wk1  Barbell Back Squat, Front Squat, Bulgarian Split Squat, Walking Lunge,
       Reverse Lunge
  wk2  Deadlift, Romanian Deadlift, Step-up, Nordic Curl, Single-leg Glute Bridge
  wk3  Leg Press, Goblet Squat, Calf Raise, Wall Sit, Glute Bridge
  wk4  Hip Thrust, Barbell Back Squat, Pistol Squat, Jump Squat, Bulgarian Split
  wk5  Front Squat, Deadlift, Walking Lunge, Reverse Lunge, Step-up
  wk6  Romanian Deadlift, Leg Press, Nordic Curl, Single-leg Glute Bridge, Calf Raise

You still always get a real compound to progress — the anchors come first, so
it can't hand you five accessories and no squat. Underneath, it cycles.


PILATES IS ACTUALLY PILATES NOW
--------------------------------
v52 built "Pilates" out of dead bugs and bird dogs. That's generic core work.

The classical mat repertoire is now in the app — 20 movements with proper
cues: The Hundred, Roll-Up, Roll Over, Single Leg Circles, Rolling Like a Ball,
Single Leg Stretch, Double Leg Stretch, Scissors, Criss-Cross, Spine Stretch
Forward, Saw, Swan, Single Leg Kick, Shoulder Bridge, Spine Twist, Teaser,
Swimming, Side Kick Series, Leg Pull Front, Mermaid Stretch.

Three Pilates sessions in a row:

  1  The Hundred, Roll-Up, Single Leg Stretch, Double Leg Stretch, Criss-Cross,
     Scissors
  2  Teaser, The Hundred, Single Leg Circles, Spine Stretch Forward, Saw, Swan
  3  Roll-Up, The Hundred, Swimming, Shoulder Bridge, Side Kick Series, Spine Twist

The Hundred keeps coming back because it opens every Pilates session — that's
correct, not a bug.

All wrist-safe (TFCC) alternatives are filled in, and everything is filtered by
location, so Greece gives you the mat work with no kit required.

THE COACH STILL OVERRIDES ALL OF IT
  This rotation is the offline backbone — what you get with no internet and no
  API call. The AI can still rewrite any session, invent movements, and swap
  exercises on the fly. It just no longer has to, to stop you repeating
  yourself.


WHAT'S NEW IN v52
=================

FIXED: PILATES, CORE DAY AND HIIT ALL BUILT THE SAME GENERIC SESSION
--------------------------------------------------------------------
Adding a session type created an empty shell with no exercises. The builder
only knew three kinds — mobility, cardio, and "strength" — so Pilates, Core Day
and HIIT all fell through to "strength", and a strength day with no exercise
list fell back to the FULL BODY pool.

So switching today to Core Day DID rebuild the session. It rebuilt it into
squat / bench / row / overhead press / plank — the same thing it showed before.
That's why it looked like nothing happened.

It was NOT because you'd already logged legs, and NOT because the coach didn't
know. Logged sets live separately from the plan and never block a rebuild, and
the coach was already being told your custom day types.

NOW RECOGNISED, each with its own exercise pool per location:

  Core Day   Hanging Knee Raise, Plank, Side Plank, Dead Bug, Farmer Carry
  Pilates    Dead Bug, Hollow Hold, Glute Bridge, Side Plank, Bird Dog
  HIIT       DB Thruster, Burpee, Jump Squat, Mountain Climber, Farmer Carry
  Arms       DB Curl, Hammer Curl, Triceps Pushdown, Overhead Ext, Face Pull
  Mobility   full mobility flow (this one was already working)

Each also gets a note that matches — "bracing and anti-rotation, not endless
crunches" rather than "custom day your coach built".

The pools resolve PER LOCATION at build time, so the same Core Day gives you
Hanging Knee Raises and Farmer Carries in Dubai, and floor work in Greece.
Adding a type now tells you what it will build: "Added · Core Day — builds
core work".

Matching is on meaning, so "Abs", "Conditioning", "Metcon", "Circuit",
"Tabata", "Barre" and "Biceps" all land in the right place too.


WHAT'S NEW IN v51
=================

PICK TOMORROW FROM A LIST — NO MORE TAPPING THROUGH
----------------------------------------------------
Today tab, above the coach's suggestion: "Tomorrow — what do you fancy?" with
a dropdown of every session type you have, custom ones included. One tap,
choose Pilates, done. It writes straight into your weekly plan.

The coach's "what should I do tomorrow" call is still there underneath as an
opinion you can take or ignore.

THE WEEKLY PLAN USES DROPDOWNS TOO
  Every day in the plan had to be TAPPED THROUGH one type at a time to reach
  the one you wanted — six taps to get to Pilates. Each row now has the same
  dropdown. Changing today rebuilds today's session immediately rather than
  just relabelling the row.


LOCATION — WHAT CHANGES AND WHAT DOESN'T
-----------------------------------------
Set yourself to Madrid and:

  YOUR WEEKLY PLAN DOES NOT CHANGE. Monday is still Push Day. The split is
  what you're training, and that's independent of where you are.

  THE TODAY TAB DOES SAY MADRID. The title stays "Push Day"; the line under it
  reads "Today · Madrid · Dumbbells Only" — so you see at a glance which kit
  the session was built for.

  THE TRAIN TAB REBUILDS FOR THE KIT. Madrid is dumbbells + bodyweight + bands
  only, so no barbell, no machines, no rower, and the Concept2 block doesn't
  appear at all. Change location and the session regenerates by itself.

  Greece goes further — no equipment at all, so it's bodyweight, shorter, and
  AMRAP-style rather than fixed loads.

Same plan, same intent, different tools.


WHAT'S NEW IN v50
=================

DATES ARE DAY-FIRST EVERYWHERE YOU SEE THEM
--------------------------------------------
Already day-first before this: every date on screen (en-GB throughout).
Changed now:

  Backup filename      amirpt-backup-04-08-2026.json   (was 2026-08-04)
  Exercises filename   amirpt-exercises-04-08-2026.json
  Version stamp        Amir PT · v50 · 04/08/2026

Open a backup file and it now starts with a readable header — when it was
taken, which app version — plus a "_readable" block listing every session,
row and finished workout in plain day-first text:

  "04/08/2026: 40kg x 10, 40kg x 10, 40kg x 9"

ONE THING DELIBERATELY LEFT ALONE, AND WHY
  Inside the data, each session is still keyed YYYY-MM-DD. That is not a
  displayed date, it is a SORT KEY the app compares as text. Day-first sorts
  wrongly as text:

     correct  2025-12-31, 2026-01-01, 2026-08-04
     wrong    01/01/2026, 04/08/2026, 31/12/2025

  Changing it would also break matching (today's sets would stop being found),
  and — the real danger — your phone and desktop would no longer agree on what
  a date looks like, so the cloud merge would treat every session as new and
  DUPLICATE your entire history on whichever device updated second.

  You never see these keys. Every human-facing surface is day-first.


WHAT'S NEW IN v49
=================

0. IT NOW KNOWS YOU'VE BEEN AWAY
---------------------------------
The load recommendation read your last logged session and never asked WHEN it
was. Two weeks in Greece still got you "45kg — you mastered 40kg, earned it".
The number in the box was wrong in the dangerous direction.

THE GAP IS MEASURED FROM YOUR LAST WEIGHT SESSION OF ANY KIND — not from the
last time you did that particular lift. Training through in Spain means you
are not detrained, you just haven't squatted lately, and you get your full
progression. Missing the time entirely is the different thing this catches.

  0-7 days     normal progression, unchanged
  8-13 days    hold last session's weight, no bump however good it felt
  14+ days     ~90% of your last top weight, ramp back up

CAPPED AT 14+ DELIBERATELY. There is no 12-week "start from scratch" tier,
because you don't take breaks like that and a stale log shouldn't be able to
trigger one. 40 days off gets treated exactly like 14.

Weights round to loadable increments (2.5kg above 20kg, 0.5kg below), so 40kg
comes back as 35kg rather than an unloadable 36kg.

The exercise shows an amber line — "⚠ Back after 17 days: start about 10%
under and ramp back up" — and the coach is told in its prompt, so its chat
advice matches the numbers in the boxes instead of contradicting them.

One trap closed: logging your first lift of the day no longer collapses the
gap to zero and quietly restores full loads halfway through the session.


WHAT'S NEW IN v48
=================

1. THE SESSION CLOCK
--------------------
A green "Start training" card now sits directly above the warm-up.

  Start    — begins the clock and logs the session as started
  Pause    — nothing counts while paused. Use it every time you get pulled away
  Resume   — picks up exactly where it stopped
  Finish   — stops the clock and scrolls you to the "Workout complete" button

The clock records timestamps, not a ticking counter, so locking the phone,
switching apps, or reloading loses nothing — it recalculates from wall-clock
time whenever you come back.

Forget to press start? Logging any set, hold or row starts it automatically
rather than silently recording nothing.

A clock left running overnight is discarded, not counted as a 14-hour session.

THE FLOATING PAUSE PILL
  A round pause button hovers bottom-right, showing the live time, wherever you
  are on the page. One tap pauses or resumes. Drag it anywhere you like and it
  stays there. Double-tap it to send it back to its corner.

WHERE THE TIME SHOWS UP
  - On the completion card: "45 min on the clock · 12 min paused"
  - In History: a ⏱ chip on each day
  - In the coach's prompt, so it knows how long you've actually been at it and
    how that compares to your recent sessions


2. CONCEPT2 ROW IS ITS OWN BLOCK
---------------------------------
It's out of the warm-up entirely. It now sits as its own section between the
warm-up and the first exercise, with its own stopwatch — start it, stop it, and
the mm:ss drops straight into the log box. The warm-up no longer duplicates the
row as its pulse-raiser.

Unchanged: the block only appears where there's actually an erg (not Greece).


3. EVERY TAB REMEMBERS WHERE YOU WERE
--------------------------------------
Leaving Train mid-session to check something and coming back used to dump you
at the top of the page. Each tab now keeps its own scroll position and puts you
back exactly where you were.

Tapping the tab you're already on scrolls to the top — the usual gesture.


4. COOL-DOWN TIMERS
--------------------
Every stretch reads its own dose and gets a countdown button. "60s each side"
runs 60 seconds, beeps, tells you to swap, runs 60 more. Rep-based moves get no
timer, correctly.

"Run the whole cool-down" walks the entire thing for you, move by move, side by
side. Tap any running timer again to stop it.

Mobility days and cardio days get the same treatment.


5. FLEXIBILITY AND MOBILITY ARE NOW A STATED GOAL
--------------------------------------------------
Your goal read as physique-only. It now reads strength AND range of motion, and
the coach has a new permanent rule: program mobility properly, hold real
durations, track range of motion the way it tracks load, ask about stiff spots,
and never let mobility be what gets dropped when time is short.

If you had edited your goal text yourself, it's left alone — only the untouched
default was upgraded. Settings → Profile and rules to change it.


6. THREE THINGS FIXED ALONG THE WAY
------------------------------------
AUTO CLOUD SYNC ACTUALLY WORKS NOW
  See the section below — this was the big one.

COMPLETED SESSIONS NOW COME BACK FROM THE CLOUD
  Your "session complete" receipts were being uploaded but never merged back
  down on a restore. A fresh install rebuilt every lift and lost every receipt.
  They now merge by date, keeping whichever record logged more.

THE REST TIMER IS ACTUALLY DRAGGABLE AGAIN
  The drag code was looking for a grip handle that wasn't in the page, so it
  silently did nothing. The handle is there now, along with a "–" button to
  shrink the timer to a small pill.


CLOUD SYNC IS NOW ACTUALLY AUTOMATIC
====================================

You were right that it wasn't. You shouldn't have had to press Sync now.

WHAT WAS WRONG
  Auto-sync was a single 4-second setTimeout, cleared and restarted on every
  save. That's a nudge, not a backup, and it failed in four ordinary ways:

    - iOS FREEZES PENDING TIMERS the moment you background or lock the app.
      The last write of a session — the one that matters most — was usually
      still sitting in that 4-second window when you put the phone down. It
      died there and nothing ever retried it. This is almost certainly what
      happened to you.
    - A failed push (a moment of bad signal in the gym) was reported once and
      then forgotten forever. Nothing retried it.
    - Each save cleared the previous timer, so a busy run of changes could keep
      pushing the deadline out.
    - If the startup PULL failed, the startup PUSH was skipped entirely, so one
      bad moment of signal at launch meant nothing synced all session.

WHAT IT DOES NOW
  A dirty flag, and a push on every route out of the app:

    - 4s after you stop changing things
    - a hard 20s ceiling that later saves cannot push out
    - a 60s sweep as belt and braces
    - THE MOMENT YOU BACKGROUND, BLUR OR CLOSE THE APP
    - immediately when you press "Workout complete"
    - immediately when you come back to the app with anything unsynced
    - retries on failure at 5s, 15s, 45s, then every 2 min
    - and the instant the connection comes back

  If a change lands while a push is already in the air, it's pushed again after
  rather than being wrongly marked as saved.

  Idle app with nothing to send makes no requests at all.

HOW YOU CAN SEE IT
  A small status line now sits under the "Workout complete" button and in
  Settings → Cloud sync:

      ● backed up just now      (green — the cloud has everything)
      ● unsynced — saving…      (amber — a write is pending or retrying)

  Glance at it before you close the app. Green means you can redeploy freely.

TWO THINGS WORTH KNOWING ANYWAY
  1. Redeploying index.html does NOT touch your data, and never did.
     localStorage is keyed to your domain, not to the file. Even with sync
     completely off, a new index.html on the same site keeps every logged set.
  2. The real risk is deleting the home-screen app on iOS — that deletes its
     storage with it. That's what cloud sync is for: reinstall, same Sync ID,
     "Restore from cloud". The app pulls before it pushes and refuses to upload
     from a device with no history, so an empty reinstall can't overwrite you.

  Settings → Cloud sync → "Check my cloud backup" still gives you the full
  picture: the cloud count and the device count should match.

  Not synced deliberately: photos and chat (too big for one Firestore doc),
  your API keys unless you opt in, and the live session clock (device state).
  The clock's RESULT — the duration on the finished session — is synced.


EVERYTHING FROM v47 STILL APPLIES
=================================
The exercise catalogue, demo matching, coach tone, colour coding, time-budgeted
sessions, the tomorrow call and the storage advice are all unchanged. Keep the
v47 notes for those.
