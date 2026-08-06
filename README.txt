AMIR PT — v64 · 06/08/2026
==========================

Upload index.html AND sw.js.


HOW I AUDITED IT
================
I stopped looking at the code and asked a simpler question instead: if I were
your PT and you told me something, is there a verb for it?

The coach had 49 directives and a [[RUN]] escape hatch, so on paper it could
already do anything. In practice, when there was no proper verb it either
guessed at raw JavaScript and got the data shape wrong, or reached for
SET_WORKOUT — which REBUILDS the session from scratch and throws away sets you
have already logged. Both of those look identical from your side: "he didn't
understand".

Fourteen ordinary coaching instructions had no verb at all.


THE BIGGEST HOLE
================
SET_SETS was GLOBAL. It changed every exercise in the session.

"Make bench 4 sets of 6 with 3 minutes rest" — the most ordinary sentence a
coach says — could not be expressed at all. Not sets for one lift, not reps,
not rest, not load, not tempo.


WHAT THE COACH CAN NOW DO THAT IT COULDN'T
==========================================
PER-EXERCISE PRESCRIPTION  (the whole missing category)
  sets, reps, rest, starting load, tempo, timed holds, and supersets — each on
  ONE named lift without touching the rest of the session or your logged sets.
    "make bench 4 sets of 6"      "3 minutes rest on bench"
    "start at 60kg"               "slow the tempo to 3-1-1"
    "hold the plank for 45s"      "superset the fly with the pushdown"

LOAD CAN GO DOWN
  There was INCREASE_LOAD and KEEP_LOAD and nothing else — the coach could only
  ever add weight. There is now DELOAD, and it's told to use it when you're
  beaten up, in pain, or back from a layoff.
    "deload bench 10%"            "drop the squat 5kg next time"

YOUR PROGRAMME, GOALS AND LIMITS
  Goal, phase, injuries and session length had no verbs — the coach could READ
  them and never change them.
    "we're switching to a strength block"    "new goal is ..."
    "my shoulder hurts, no overhead"          "I've only got 30 minutes"
  SET_INJURY and SET_TIME_BUDGET rebuild today's session around the constraint
  automatically. The coach is now told to USE them when you mention pain or
  being short of time, rather than just sympathising.

BODY DATA
  It could see your measurements and rowing but never write them.
    "waist is 84, chest 106, arm 37.5"       "rowed 2k in 8:30"
  Numbers you say go straight in. You never retype them into Progress.

REORDERING  (from v63.1)
    "put bench first"   "do face pulls last"   "order: bench, rows, flyes"


AND NOTHING FAILS SILENTLY ANY MORE
===================================
This was the worst one, and it explains a lot.

If a directive matched its pattern but the handler returned null — almost
always an exercise name that isn't in the session — it vanished without a
word. The coach would say "done!" and absolutely nothing had changed. You had
no way to tell the difference between that and a bug.

Now every per-exercise verb names what it couldn't find:

    "Couldn't set sets — no "Squat" in today's session"

and any reply where nothing at all applied says so plainly instead of
pretending.


TESTED, NOT ASSUMED
===================
All fourteen verbs were run against the phrasing you'd actually use, plus:
  - a per-exercise change leaves the other exercises untouched
  - logged sets survive it
  - the session isn't rebuilt
  - a wrong exercise name produces a visible warning, not silence


WHERE IT STILL HAS EDGES
========================
Carb and fat targets (calories and protein are covered), meal planning, and
triggering a progress photo. Say the word and I'll add them — but I'd rather
you use this for a week and tell me what you actually reached for and couldn't
get, than have me guess at another fourteen.


Upload index.html AND sw.js.


REORDER THE SESSION YOURSELF
============================
Every exercise block now has a row at the top: its position ("4 of 6") and
three buttons.

  ⇈ top   straight to the front — because moving a main lift up from the
          bottom is the common case and shouldn't take five presses
  ↑ ↓     one place at a time

Arrows rather than drag-and-drop on purpose. Dragging inside a long scrolling
sheet is fiddly on a phone, worse with chalk on your hands, and a mis-drag
mid-set is more annoying than one extra tap.

The moved exercise scrolls into view and flashes an outline so you can see
where it landed.

SETS YOU'VE ALREADY LOGGED TRAVEL WITH IT
  They're stored against the exercise NAME, not its position, so moving Bench
  Press from the bottom to the top keeps every set you've logged today. Tested.

ONE GUARD
  If a hold timer is running it refuses and tells you to stop it first. The
  timer tracks a POSITION, so reordering underneath it would log your time
  against the wrong exercise.


AND THE COACH UNDERSTANDS IT NOW
================================
It didn't ignore you — it had no verb for it. There were directives for
swapping, adding and removing exercises, but nothing for ORDER, so "put bench
press first" had nowhere to land. Worse, its nearest option was SET_WORKOUT,
which rebuilds the session from scratch and would have thrown away your logged
sets.

Two new instructions it can now use:

  MOVE_EX     one exercise to a position — accepts a number, or "top",
              "first", "last", "bottom"
  REORDER     the whole running order in one go

Both only rearrange what is already in the session. Neither adds or removes
anything, and anything you don't name keeps its place at the end rather than
being silently dropped.

So all of these now work: "put bench press first", "move the bench to the top",
"do face pulls last", "order: bench, rows, face pulls".

Partial names are fine — "bench press" finds "Barbell Bench Press". A name it
can't find is ignored rather than guessed at.


Upload index.html AND sw.js. Nothing you've logged is touched.


WHAT WAS ACTUALLY WRONG
=======================
Eight patches, a new fault each time. That pattern was the real symptom: I was
fixing the thing in front of me instead of the structure underneath it.

There were TWO image systems in the app that didn't know about each other.

  The single-clip path:  mediaFor -> mediaFail -> mediaFallback -> swapMedia
                         built for one animated WorkoutX GIF.
  The two-frame path:    fedResolve -> fedTileHTML -> fedPaintCached
                         built for the free pack's start/end pair.

Every fault you hit was at the seam, one painting over the other's work:

  - a saved free-pack FRAME resolved as if it were a finished clip, so it
    rendered alone and frozen                                    (the "static image")
  - the painter looked frames up by EXERCISE NAME, so changing your pick
    read the same key and the old picture came straight back      (the "it does nothing")
  - the coverage report asked the strict matcher while the tile beside it used
    the near matcher, so it invented gaps that weren't there      (the "66 exercises")
  - the browse list asked WorkoutX only and hid everything on 401 (the blank rows)
  - swapMedia wrote its own markup with no data-exname, so nothing
    could ever repaint that tile afterwards

And while collapsing them I found FIVE DUPLICATE FUNCTION DECLARATIONS — two
mediaFail, two mediaFallback, two paintSavedGifs, two fedPaintCached, two
anyThumb. In JavaScript the LAST one wins, and in every case the last one was
the old version. v62.2 would have shipped with the new logic present but
completely inert. That is the sort of thing that keeps a bug alive across
several "fixes".


WHAT IT IS NOW
==============
ONE function decides what an exercise shows. ONE renders it. ONE handles a
failure. Nothing else touches the image.

The order is the whole policy, in your stated priority:

  1. WHAT YOU CHOSE YOURSELF   always wins, never overwritten by anything
  2. A REAL ANIMATED GIF       saved on the phone, or live from a working source
  3. START/END FRAMES          a real photograph from the free pack, animated
  4. A LINK TO A VIDEO         only when all of the above are genuinely absent

A failure no longer does bespoke DOM surgery. It records the dead source and
re-renders through the same renderer, so a broken clip simply steps DOWN the
ladder — to frames, not to a blank.

Every tile carries the "> demo" button. Every one, including the frames and the
link tiles. Tap it any time to check the movement is the one you think it is.


VERIFIED, NOT ASSUMED
=====================
  precedence      pack match / near match / chosen clip / your pick / "no demo"
                  — correct in all five cases
  demo button     present on gif, frames AND link tiles
  changing a pick image changes immediately, and SURVIVES a re-match attempt
  a dead clip     steps down to frames — never blanks
  the report      agrees with the tile beside it on every exercise


HOW TO MAKE SURE THE RIGHT IMAGE IS ON THE RIGHT EXERCISE
=========================================================
SETUP, ONCE
  1. Settings -> Exercise catalogue -> check "Use WorkoutX" is OFF.
     It's forced off by this build. Your key stays saved; switch it back on
     next month if you want its animated clips and have requests left.
  2. Settings -> Exercise demos -> "Get the free demo pack".
     Free, no key, no limit. Also copies itself to Firebase so it comes back
     on its own if the phone clears its storage.
  3. "Save the matched ones to this phone"  — for offline use in the gym.

CHECKING AND CORRECTING
  4. Settings -> Exercise demos -> "Which of my exercises have no demo?"
     Sorted so anything needing attention is at the top:

       none        nothing at all      -> tap "Find one"
       ~ closest   a real photo, but of a RELATED movement in the same muscle
                   group, not that exact lift  -> tap "Change" if it looks wrong
       match       confident, leave it

  5. On any exercise, in the list OR mid-session, tap "Change demo", type a
     word ("landmine", "press"), pick the right one. That choice is stored
     against the exercise and NOTHING overrides it afterwards — not a re-match,
     not a catalogue sync, not a failed clip, not the matcher. "Undo my choice"
     hands it back to automatic when you want that.

  6. Anything badged "~ closest" on the image itself is the app telling you it
     guessed. It never guesses across muscle groups — a hamstring exercise
     cannot show a biceps photo — but within a group it will show the nearest
     real movement rather than nothing.

IF SOMETHING IS STILL MISSING
  Settings -> Exercise demos -> "Check what's working" reports which mirror is
  reachable, whether the pack is loaded, whether Firebase has it, and how many
  of your exercises matched. Then "Copy the list to fix" puts the exact names
  on your clipboard. Send me that and I'll work through them by name.


THE ONE HONEST LIMIT
====================
The free pack gives two frames, start and end, not true motion. It shows you
the positions, labelled, and it is free and unlimited and cannot run out. It
does not show the path between them — that's what the "> demo" button is for.

Real animated GIFs come back the moment you switch WorkoutX on with requests
available, and they sit at level 2 of the ladder, above the frames. Everything
you've chosen by hand stays exactly as you set it either way.
