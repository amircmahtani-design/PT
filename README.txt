AMIR PT — v63 · 06/08/2026
==========================

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
