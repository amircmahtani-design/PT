AMIR PT — v80 · 06/08/2026
==========================

Upload index.html AND sw.js.


EVERYTHING ON HOME MOVES NOW
============================
The workout hero and the "Food today" line weren't in the reorder system at
all — only the collapsible cards were. So the two biggest things on the page
were the two you couldn't move.

Both move now. Tap "Rearrange cards" and every block on Home gets arrows,
including the ones that aren't collapsible: they get a small bar above them
with the name and the controls, because they haven't got a header to put them
in. Want food at the top and the workout under it? Two taps.


AND THE REAL FIX UNDERNEATH
===========================
There were TWO reordering systems: one written for Home in v74, and the
generic one written for Progress in v77. That is exactly the duplication that
let a stale weeklyReview silently override the new one for ten versions.

So I deleted the Home-only one — about 1,800 characters of it — and put Home
on the generic system. One implementation now covers Home, Progress and Food,
which means:

  - a fix to ordering lands on all three at once
  - a new screen is a matter of tagging its blocks, nothing more
  - there is no second copy to drift out of step

Any layout you had already set on Home is carried across automatically.

Each screen keeps its own order, so rearranging one never disturbs another.
Verified across all three, including an old Home-only layout migrating with
nothing lost.


STILL TO DO IF YOU WANT IT
  Train and Settings aren't tagged yet. Train is mostly the session sheet,
  which already reorders exercise by exercise, and Settings is one long
  collapsible list — so neither felt urgent. Say the word and they're a few
  lines each now that the system is shared.


Upload index.html AND sw.js.


FOOD SECTIONS REARRANGE
=======================
"Rearrange sections" at the bottom of the Food tab, same as Progress and Home.
Add a meal, Add a drink, Whole day at once, Today, Recent days — put them in
whatever order suits how you actually log.

The running total stays pinned at the top. You asked for a counter at the top
and it should stay there.

Each screen keeps its own order, so rearranging Food doesn't disturb Progress.


TWO BUGS THIS TURNED UP BEFORE YOU SAW THEM
===========================================
1. EVERY FOOD SECTION WOULD HAVE OPENED SHUT.
   The default open/closed state was hardcoded to two Progress section names.
   Anything else defaulted closed — including "Add a meal" and "Today", which
   are written as open in the markup. Sections now remember how they shipped
   and use that as the default, with your own choice on top.

2. REORDERING COULD THROW SECTIONS PAST THE BUTTON.
   The ordering chained everything after whichever section came first in your
   saved order. On Progress the sections are one contiguous block so it
   happened to work. On Food there's a running total above and a button below,
   so moving a section to the top would have dragged the entire block down
   past the button at the bottom of the page.

   It now anchors to where the block actually starts rather than to one of its
   members.


Upload index.html AND sw.js.


1. THE DRINK ICONS
==================
"U0001F377" on every button. My mistake, and a specific one: I wrote the emoji
as Python escapes (\U0001F377), which JavaScript does not recognise — it drops
the backslash and prints the rest as text.

Real emoji now. 🍷 🥂 🍺 🥃 🍸

The pre-flight check has been taught this exact pattern, so it cannot ship
again. That check has now caught three separate faults it was written for.


2. HOME AND FOOD SHOW THE SAME READOUT
======================================
The Home card had its own small-text layout while the Food tab had the big
one. Two different-looking readouts of the same number is how you end up
unsure which is authoritative.

There is one renderer now, used in both: calories large, then protein with
your g/kg, carbs, fat, and alcohol when there is any.


3. "WHOLE DAY AT ONCE" IN THE FOOD TAB
======================================
For the days your nutritionist has it covered and you just want the totals in,
without leaving the Food tab. Same two buttons as Home — save the day's totals,
or add to what's there.

IT WON'T QUIETLY FIGHT THE MEAL LOG
  If you have meals logged and then save a whole-day total, it asks first, then
  clears the meal list — because a day cannot be both an itemised list and a
  hand-typed total without one of them being wrong.

  Testing that found a real bug: clearing the meals left their carbs, fat and
  alcohol behind, so a day you had just re-entered by hand still carried
  figures from meals that no longer existed. Those are wiped properly now, and
  anything you leave blank shows as blank rather than as a stale number.


Upload index.html AND sw.js.


A FOOD TAB, WHERE HISTORY WAS
=============================
History wasn't earning a tab — it's something you look at occasionally. Food is
daily. So Food takes the slot and History moves into Progress as a section
(collapsible and reorderable like the rest, nothing lost).

THE RUNNING TOTAL SITS AT THE TOP
  Calories in big type, then protein with your g/kg, carbs, fat, and alcohol
  when there is any. It counts up as you add things.

ADD A MEAL
  Describe it — "chicken shawarma wrap and a side salad" — and the coach works
  out the macros and fills the boxes. Change anything before you add it. Or
  skip the description and type the numbers straight in.

  Give it macros without calories and it works the calories out for you.

ADD A DRINK
  Ten common ones, one tap each: wine (standard and large), prosecco, beer
  (pint and bottle), single and double spirits, G&T, cocktail, Aperol spritz.
  Anything else, give it a volume and an ABV and it does the maths.

ALCOHOL IS HANDLED PROPERLY
  It is NOT a macro. It's its own fuel at 7 kcal per gram, and counting it as
  carbs would overstate your carbs while counting it nowhere would quietly
  lose 300 calories on a night out.

  So it gets its own column, it counts toward your calories, and any real carbs
  in the drink — mixers, residual sugar — are added separately on top.

    175ml wine at 13%   ->  18g alcohol, 130 kcal
    pint of beer at 5%  ->  22g alcohol, 209 kcal (13g of that is carbs)
    double spirit       ->  16g alcohol, 110 kcal, no carbs
    G&T                 ->   8g alcohol,  91 kcal (9g carbs from the tonic)


THE TWO WAYS OF LOGGING DON'T FIGHT
===================================
The daily-total box stays on Home, because that's right for the days your
nutritionist has it covered. The meal-by-meal log is for the days you don't.

They cannot disagree, because there is still only ONE store. Meals are the
detail; adding one recalculates the day and writes it back to the same place
the coach, the weekly averages and the Plan card already read. Delete the last
meal of a day and the derived total clears rather than leaving a stale number
with nothing behind it.

That's deliberate. I've shipped a bug twice now where one fact lived in two
places and one of them was always wrong. Not a third time.


RECENT DAYS
  Any day you build meal by meal is kept, with its totals and alcohol, so a
  weekend out is visible next to a normal week rather than vanishing into a
  single number.


Upload index.html AND sw.js.


1. PROGRESS IS COLLAPSIBLE AND REORDERABLE
==========================================
You asked for this and I only did Home. Home was already built out of
collapsible parts so it was easy; Progress was plain cards, so it got neither.

All eight sections now collapse and remember it:
  Bodyweight · Your lifts · Physique photos · The plan · Week in review ·
  Then & now · Coach's read · Measurements

At the bottom: "Rearrange sections". Same up/down arrows as Home and the
exercises. Photos to the top takes two taps.

Built generically rather than as another one-off — any card tagged with a key
becomes a collapsible, reorderable section automatically. History and Settings
can have it whenever you want, and it carries over to Lia's app.

Bodyweight and Your lifts start open, the rest closed. Change any of it and it
stays that way.


2. THE ESCAPE CODES AGAIN — AND WHY IT KEEPS HAPPENING
======================================================
"\ud83d\udcf7" and "\u2014" printing as literal text on the check-in. Same
mistake as v73.2 and I reintroduced it.

The cause is specific: those codes are real escapes inside JavaScript strings
but meaningless in raw HTML, where they print as characters. The JavaScript
syntax checker cannot catch it because the JavaScript is perfectly valid — the
fault is in the markup.

So I've built a PRE-FLIGHT CHECK that runs before every package from now on.
It looks for escape codes in markup, duplicate function declarations,
unbalanced tags, version mismatches between the app and the service worker,
and inline handlers calling functions that do not exist.

The buttons now read "📷 Front photo" and "📷 Side photo" properly.


3. THE PRE-FLIGHT IMMEDIATELY CAUGHT SOMETHING WORSE
====================================================
There were TWO functions called weeklyReview. In JavaScript the last one wins
— and the last one was the OLD version.

Which means the weekly review I built in v68, with the volume landmarks and
the fatigue signals and the deload case, HAS NEVER ONCE RUN. You were getting
a much older one that read your bodyweight list and the last entry of each
lift — including the same "prev" ordering bug I fixed in v72, still live in
that copy.

The old one is gone. The real one runs now.

That is the second time a duplicate function has silently overridden new work
(the first was five of them in v63). It is exactly the class of fault that
survives testing, because everything looks fine and simply does the wrong
thing quietly. It cannot happen again without the pre-flight catching it.


Upload index.html AND sw.js.


1. "I DID LATERAL RAISES YESTERDAY" SHOULD HAVE JUST WORKED
==========================================================
You told it a fact and it answered with a menu of example phrasings. That was
a scripted fallback, not the coach thinking.

The guard behind it was right in principle: if the coach SAYS it changed
something but no actual change fired, don't let it lie to you. The handling
was wrong — it threw the entire reply away and printed a list.

Now, when that happens, it goes BACK TO THE MODEL and tells it exactly what
went wrong: "you said you'd change something but nothing changed — answer him
again and include the instruction that makes it real. If what he said was a
statement of fact — that he already trained something, or correcting your
picture of his week — accept it, say what it changes, and act on it. Do not
list example phrasings at him."

If that second attempt still can't act, your reply is KEPT and one honest line
is added underneath. Never replaced.

AND THE DEEPER FIX
  The coach is now told plainly how you actually talk to it:

    "Most of what he says is not a command and not a question — it is him
     CORRECTING YOUR PICTURE of his training, and it should change what you do."

  With your exact sentence as the worked example: lateral raises yesterday
  means either the volume figures are wrong or a session went unlogged, so
  agree with him, drop the catch-up work you'd planned, and offer to log it.

  Plus: "You can be wrong and he will tell you. When he does, the answer starts
  with agreeing. His memory of his own week is better evidence than your
  figures, because your figures only know what got logged."

  And explicitly forbidden: answering a statement of fact with a list of
  example phrasings, or making you repeat yourself in different words.


2. THE CAMERA OPENS DIRECTLY NOW
================================
You said you'll never upload, only shoot. So the two buttons — 📷 Take front
and 📷 Take side — now open the camera straight away instead of the photo
library. Both on Progress and on the daily check-in.

The shot still files itself under the right pose automatically, from the
button you pressed, and lands in Progress with the timeline, the comparison
and the measurement estimates.


3. THE COACH STAYS IN CHARACTER
===============================
I checked every place the app talks to the AI. The persona was reaching all
the conversational paths already — chat, mid-set replies, the week plan, the
day plan, the weekly review. The two that don't carry it are internal
utilities (matching an exercise name to the catalogue, reading numbers off a
photo), which is correct.

What broke character was scripted text. Fixed:
  - the fallback above no longer exists as a script at all
  - the one line it can still add is written in the coach's voice
  - the photo measurement estimate now speaks as your coach rather than
    switching to clinical app-speak mid-conversation

If you want to pin the voice harder, Settings has "How the coach should talk
to me" — free text, overrides the generic personality, and syncs to the cloud
so you set it once.


Upload index.html AND sw.js.


WHY THE SIDE PHOTO "DIDN'T WORK"
================================
It did work. It saved perfectly. Then it disappeared, which looks identical to
a broken camera — and that was a trap I built.

There were TWO pose controls that looked alike. The chips at the TOP of the
section were a FILTER. The dropdown at the BOTTOM was the LABEL. So if you
tapped "Side" on the chips and then took a photo, it was labelled Front —
the dropdown's default, which you'd never touched — and the Side filter you'd
just set hid it immediately.

The dropdown is gone. There are now two buttons that say what they do:

    📷 Front photo        📷 Side photo

The pose comes from the button you press. It cannot be wrong, and it cannot
disagree with the filter.

And as a backstop: if you take a Front shot while filtered to Side, the filter
resets to All so you SEE the photo you just took. Nothing you capture can
vanish behind a filter again.


FRONT AND SIDE ONLY
===================
Back, Legs and Other are removed — from the capture buttons, the filter chips
and the label picker in the photo viewer. Three controls, all consistent.

Any old photos still labelled Back or Legs are untouched and still show under
All. Open one and you can relabel it Front or Side if you want.


PHOTOS ON THE DAILY CHECK-IN
============================
Same two buttons, on the check-in, above the food fields. Underneath them, a
strip of whatever you've already taken today so you can see it landed without
leaving the screen — tap any of them to open it full size.

It is the SAME set of photos, not a copy. Anything taken at check-in appears
in Progress with the timeline, the comparison and the measurement estimates,
exactly as if you'd added it there. Progress is unchanged; this is just a
second door into it for when you're already stood there doing the check-in.


Upload index.html AND sw.js.


REARRANGE THE HOME CARDS
========================
They already collapsed and remembered whether you'd left them open. What they
couldn't do was move — so whatever mattered most to you sat wherever it
happened to be written in the file.

At the bottom of Home: "Rearrange cards". Tap it and every card grows an up
and a down arrow in its header, reachable whether the card is open or shut.
Move things, tap "Done rearranging".

The moved card scrolls into view and flashes, and the order is saved.

Arrows rather than drag, same reasoning as the exercise reorder: dragging
inside a scrolling page is fiddly on a phone, and a mis-drag is more annoying
than one extra tap.

BUILT SO A FUTURE VERSION CAN'T BREAK IT
  If I add a new card later, it appears at the end of your saved order instead
  of vanishing because it wasn't in the list. If I remove one, the stale entry
  is dropped rather than leaving a gap. Both tested.


GROUNDWORK FOR LIA PT
=====================
Also in this build, invisible to you: everything that identifies WHOSE app
this is now lives in one config block at the top of the file — name, storage
keys, Firestore document, body stats, volume landmarks, physique priorities,
training locations, starting phase.

Previously your name and settings were scattered across 66 places. Building
her version meant find-and-replace, and the two apps would have drifted apart
within a week — my fixes landing in one and not the other.

Now a second app is that block, changed once. Every fix from here lands in
both.

Her data stays completely separate: same Firebase project, her own document
inside the collection your rules already permit. Nothing for you to configure,
no rules change, and neither coach can see the other's training.

Sharing your API key is fine — same string in her Settings, same billing,
separate conversations.


Upload index.html AND sw.js.


IT'S NOT A BUDGET
=================
You were right and I'd built the wrong idea in. "1480 / 1500" and "20 left"
frame your food as a target you're spending down. Your nutritionist sends the
food, the daily number varies, and 1480 is just what that day was.

All of that language is gone:

  "Nutrition today"  ->  "Food today". No slash, no target, no remaining.
                         Just what you ate, with protein per kg.
  Home card          ->  the figure, plus your own recent average for
                         context. Not a score against anything.
  Check-in hint      ->  "just record what it was".

The only comparison left is against your OWN recent days — "1480 kcal · 1496
avg over 5 days" — which is context, not a scoreboard, and it disappears until
you have more than one day logged.


AND THE SAME CORRECTION WHERE IT MATTERS MORE
=============================================
The coach was reasoning from 1500 as though it were fixed. It now reads your
ACTUAL logged average over the last 14 days and says so — "actually eating
about 1496 kcal a day (his own logs, 5 days)" — falling back to a rough
stand-in only until you have at least three days recorded.

It's also told explicitly: his nutritionist sends the food and the daily
number varies, there is no target and no budget, never frame his intake as
over, under or "X of Y", and never congratulate or caution him on a number.
Read it purely as how much fuel he had, and let that inform how hard to push.

That last part matters more than the display. A coach that treats a 1620 day
as "going over" would start making training decisions on a rule you never set.


Upload index.html AND sw.js.


1. YOU COULDN'T TYPE DECIMALS
=============================
The intake boxes were set to a whole-number keypad, so iOS never showed you a
decimal point. All eight of them — the four on Home and the four on the
check-in — now bring up the decimal keypad.

Decimals also survive the maths now. 167.5g of protein stays 167.5g, and
adding a 28.5g meal to it gives 196g rather than a rounded guess at each step.

One related fix: the display formatter rounds anything over 100 to a whole
number, which is correct for a barbell and wrong for protein. Nutrition uses
its own formatter that keeps the decimal only when there is one — so you see
167.5g, but plain 168g when it's actually 168.


2. "NUTRITION TODAY" DIDN'T UPDATE
==================================
Same class of bug I hit yesterday, and I only fixed half of it.

There were two places storing today's food. The "Nutrition today" line summed
DB.nutrition.log, while the Home card, the coach, the Plan card and the weekly
averages all read the day's check-in. Saving on the Home card wrote to the
check-in, so the line above it sat frozen at zero.

I'd already pointed the COACH at the check-in in v73. I missed this one.
Everything reads the check-in now, so there is exactly one place today's food
lives and nothing can disagree with anything else.

The line also shows carbs and fat now, not just calories and protein.

TESTED: 1487.5 kcal / 167.5g protein / 118.4g carbs / 44.2g fat saved on the
Home card, and the Nutrition today line reads them back with the decimals
intact — then a 312.5 kcal meal added on top, and both views agree at 1800.


Upload index.html AND sw.js.


LOG YOUR FOOD WHEN YOU ACTUALLY KNOW IT
=======================================
You were right that this was broken by design. Intake lived only on the
check-in, which you do first thing — before you've eaten anything. So the
fields were either blank or a guess, and there was no way back in to correct
them once the day was over.

HOME -> "TODAY'S FOOD"
  Calories, protein, carbs, fat. Open it any time, as often as you like.

  SAVE TODAY'S TOTALS — replaces the day with what's in the boxes.
  ADD THIS TO TODAY   — adds to the running total, for logging meal by meal.

  It shows what you've logged so far, how much is left against your target,
  and your protein in g per kg of bodyweight — which is the number that
  actually matters for holding muscle in a deficit. There's a Clear button if
  you get it wrong.

  You do NOT need to have checked in. If there's no record for today it
  creates one, so logging food never depends on anything else.

OR JUST TELL THE COACH
  "1520 calories, 168 protein, 120 carbs, 45 fat" — any time of day. It writes
  to today and overwrites whatever was there.


TWO BUGS FOUND WHILE BUILDING IT
================================
1. CHECKING IN WOULD HAVE WIPED YOUR FOOD.
   The check-in REPLACED the whole day's record rather than updating it. So
   log breakfast and lunch, then check in, and everything you'd logged was
   silently gone. It merges now: check-in fields win, and anything already
   there that the check-in doesn't mention survives untouched.

   Tested exactly that sequence — 1500 kcal and 170g protein logged across
   three meals, then a full check-in — and the food is still there afterwards,
   alongside the weight, sleep and energy.

2. THE COACH WAS WRITING TO A DIFFERENT PLACE.
   [[LOG_NUTRITION]] wrote into its own list while the Home card and the
   weekly averages read the day's check-in. Two stores for one fact means one
   of them is always wrong, and the coach's own reporting would have
   contradicted the card. Everything writes to the check-in now, so the card,
   the coach, the Plan card and the averages can't disagree.

   It also reads carbs and fat now, not just calories and protein.


Upload index.html AND sw.js.


FIRESTORE: NOTHING TO CHANGE
============================
Your rules are already correct and you don't need to touch them.

Everything the app writes goes to the amirpt collection:

    <syncid>            your training data
    <syncid>__cat0..N   the exercise catalogue
    <syncid>__fed0..N   the free demo pack index   (added in v61.4)

Your rule is:

    match /amirpt/{docId} {
      allow read, write: if request.auth != null;
    }

The {docId} wildcard covers all three patterns, so the demo pack backup was
already permitted without you doing anything.

And every field added since — the never-again rules, favourites, the two-phase
plan, measurements, demo picks, rest preferences, daily intake — lives INSIDE
the main synced document. No new collections, no new rules, ever.


BUT CHECKING THAT FOUND A REAL BUG
==================================
The demo pack was being split into Firestore documents by RECORD COUNT — 400
per document. That was fine when the pack held only names and image paths.

In v69 I started keeping the exercise instructions too, which made each record
roughly four times bigger and varies wildly between exercises. At 400 records
a document, an unlucky run of long entries would have crossed Firestore's 1 MiB
per-document limit and the backup would have failed — quietly, with nothing to
show for it, until the day you needed it back.

It now splits by ACTUAL BYTES with a 600 KB ceiling per document.

Tested against a deliberately worst-case pack (800 exercises, every one with
maximum-length instructions): 4 documents, largest 610 KB, comfortably under
the limit. A typical pack fits in a single 393 KB document.

Restore also raised its part limit to match, so a pack split across more
documents comes back whole.


Upload index.html AND sw.js.


1. TODAY'S BENCH DIDN'T APPEAR — AND WHY
========================================
Your old seeded history carries the literal date "prev". The problem is that
"prev" sorts AFTER every real date alphabetically, because "p" comes after "2".

So anything that grabbed "the last entry" from a lift's history, or sorted by
date, picked up the placeholder instead of the session you logged an hour ago.
That's exactly why Bench Press showed "40x8 40x8 40x8 40x8 · prev" while
Overhead Press correctly showed 6 Aug — Overhead Press had no seeded entry to
outrank it.

It was worse than a display bug. The same wrong entry was feeding your LOAD
RECOMMENDATIONS, so the coach was calculating your next bench weight from
seeded placeholder data rather than what you actually lifted.

Fixed everywhere that reads your history: the lift list, the "last time" line
on the exercise, the load recommendation, the fatigue detection and the coach's
prompt. Nothing takes array order on trust any more — sessions are ordered by
real date with the placeholder pinned to the front where it belongs.

Verified against your exact data shape: the old code returned "prev / 40x8",
the fix returns today's 45x8, and the load call now reads from the right one.


2. HISTORY IS GROUPED BY WORKOUT TYPE
=====================================
Push with push, pull with pull, legs with legs, row separately.

Each section is collapsible and shows how many sessions it holds and when the
last one was, so comparing this week's push to the previous one no longer means
scrolling through everything you did in between. Sections remember whether you
left them open.

There's a toggle at the top if you ever want the old single chronological list
back — it's one tap either way.


3. CHECK-IN FORMATTING
======================
The intake fields were a mess: "\u00b7" and "\u2014" printing as literal text,
and the four boxes overlapping their own labels.

Two causes. Those escape codes only work inside JavaScript strings and I'd
written them into raw HTML, where they mean nothing. And the grid inherited
styling from a form layout it was never designed for — the labels float, which
is why they piled up on top of the inputs.

The intake block now has its own layout instead of borrowing one: four even
cells, labels above their fields, nothing overlapping. I also swept the rest of
the markup for the same escape-code mistake — there were three, all gone.


Upload index.html AND sw.js.


"I'VE GOT PLENTY OF STORED FAT TO BUILD FROM"
=============================================
You're right about the mechanism. Stored fat CAN fund muscle growth — it's
exactly why recomp works at all, and why body fat level is the single biggest
predictor of who manages it while dieting.

The question is rate, not principle. Fat can't be liberated at any speed you
like. The working figure is roughly 30 kcal per kg of fat mass per day, so a
man carrying 20kg of fat can draw about 600 kcal/day from it; one carrying 8kg
gets about 240. Push the deficit past that ceiling and the rest has to come
from somewhere else — and some of that somewhere else is muscle.

The app now does that sum instead of guessing:

    bodyweight x body fat %  ->  fat mass  ->  kcal/day it can supply
    compared against your actual deficit

At your numbers, a ~1,180 kcal/day deficit, here's what it takes to cover it:

    12% bf  ->  10.0kg fat  ->  ~300 kcal/day   short by 879
    18% bf  ->  15.1kg fat  ->  ~453 kcal/day   short by 726
    25% bf  ->  20.9kg fat  ->  ~627 kcal/day   short by 552
    30% bf  ->  25.1kg fat  ->  ~753 kcal/day   short by 426

At 187cm and 83.7kg you're very unlikely to be above about 20%, so the deficit
runs several hundred kcal a day beyond what your fat can hand over. That
doesn't stop you keeping what you have — training is what decides that — but
it does mean meaningful muscle GAIN is unlikely until the deficit narrows.

Which is why your own position is the well-calibrated one: happy to maintain
while the fat goes. Maintenance is the floor, building is the upside, and the
app now programs to guarantee the floor and leave the upside open.

LOG A BODY FAT ESTIMATE AND IT GETS SPECIFIC
  Progress -> Measurements -> "Estimate from my photos", or type one in. Until
  then the coach is told to ASK rather than guess, and it won't pretend to know.

WHAT THE COACH DOES WITH IT
  - It tells you the real number if it comes up, instead of encouragement.
  - It does NOT use it as a reason to train you less. The training is what
    holds your muscle; that argument runs the other way.
  - It sets your expectations up front so flat loads don't read as failure.
  - It stays out of your diet. If you want to build faster, the lever is the
    size of the deficit, and that's your nutritionist's call — not the app's.


Upload index.html AND sw.js.


THE PLAN IS NOW IN THE APP
==========================
Phase 1 (now): hold 1500 kcal, strip the fat, get to a flat stomach. Training
exists to KEEP every gram of muscle you have and add what the deficit allows.
The diet does the fat loss — the workout never turns into cardio to chase
calories.

Phase 2 (after): calories go up and the same framework goes to work building.

The coach is told which phase it's programming for, because "should I add
volume here?" has opposite answers in each. Switching phases genuinely swaps
the rules — I tested it both ways.

PHASE 1 RULES IT NOW WORKS TO
  - Protect muscle first: heavy loads, full range, sets that mean something.
    Muscle is lost when the stimulus disappears, not when calories are low.
  - Keep enough volume to actually grow. Sit between the minimum and target
    figures — NOT scraped to the minimum. That's how people finish a cut
    smaller and softer.
  - Never trade load for sweat. Lighter weight and higher reps to "burn more"
    is the worst thing it could do to you right now.
  - Cut junk before work. Remove filler exercises, not working sets.
  - The stomach is the milestone, not a bodyweight. The coach is told to tell
    you when it thinks you're close.
  - Expect flat weeks and NAME them as wins. Holding loads while the waist
    drops is the whole point, and on the scale it looks like nothing.

THE PLAN CARD (Progress tab)
  Which phase you're in, your deficit in context, what you've actually logged,
  and a button to move to phase 2 when you're ready. Or just tell the coach —
  it can move you, but only when you say so or you've agreed to its case.


DAILY INTAKE ON THE CHECK-IN
============================
Four optional fields: calories, protein, carbs, fat.

The coach uses them to decide HOW HARD TO PUSH YOU, not to comment on your
diet. A run of very low-carb days is a reason to keep session volume sensible,
not a reason to lecture you.

It works out protein per kg of bodyweight automatically — at 173g against
83.7kg that's 2.1g/kg, which is the number that matters for holding muscle in
a deficit.

YOUR NUMBERS ARE IN
  187cm, 83.7kg, 1500 kcal. Your bodyweight now updates itself from whatever
  you enter at check-in, so the maths stays current. The app works your
  maintenance at roughly 2,679 for your size — about a 44% deficit — and gives
  the coach that context.

THE ONE NUTRITION SENTENCE IT'S ALLOWED
  Your nutritionist owns the diet and the coach is told explicitly not to
  advise on it. The single exception: if your lifts fall away sharply for two
  weeks, or sleep and energy stay low, or protein looks persistently low for
  your bodyweight, it says once that it's worth raising with your nutritionist
  — then stops.


AND THE GOAL IS SPECIFIC NOW
============================
It used to say "build the physique I want", which told the coach nothing. It
now says: build real muscle while getting lean — a recomp, not a bulk and not
maintenance. Lean and athletic, visible abs, clear shoulder-to-waist taper.
Not a bodybuilder, not bulky. Judge it by the mirror, photos, waist and the
loads on the bar — not bodyweight.

Volume ceilings came down to match that (a lean athletic build wants less
total volume than a mass programme), with shoulders as the one group worth
pushing toward its ceiling — that's the width end of the ratio, and the only
end you can grow. Core is explicitly told to avoid heavy loaded oblique work,
because a thicker waist ruins the exact ratio you're chasing.


Upload index.html AND sw.js.


FIRST, THE HONEST BIT
=====================
The coach cannot browse the web and study other coaches. It has no live access
and nothing it read would persist between sessions. I'm not going to pretend
otherwise.

But that isn't what makes elite coaches good. They aren't reading each other's
Instagram. They apply a known body of methodology consistently and adapt it to
one person's body, goals and constraints. That framework is what your app has
been missing — it had a personality and a pile of verbs, and no doctrine.

So the doctrine is now encoded, and it reads YOUR numbers every time it speaks.


1. VOLUME LANDMARKS
===================
The coach now works to hard-set-per-muscle-group-per-week landmarks — the
framework every evidence-based coach uses:

  minimum effective volume   below this a muscle simply isn't growing
  target adaptive volume     where most of the growth happens
  max recoverable volume     above this you're accumulating fatigue you can't
                             recover from

It sees your actual logged sets against those numbers for all six groups,
every conversation. Below minimum: it fixes that before adding anything else.
Above the ceiling: it cuts back rather than admiring the total.

Counted from what you DID, not what was programmed. Secondary muscles count
half — a row trains back and biceps, but not equally.


2. VOLUME IS BIASED TOWARD THE SHAPE YOU WANT
=============================================
A coach doesn't spread sets evenly. The doctrine names which muscles build the
look — side delts for width, lats for the V-taper, upper chest specifically,
triceps over biceps since they're two thirds of the arm — and tells it to bias
accordingly rather than distributing volume democratically.


3. EXERCISE SELECTION HAS AN ORDER NOW
======================================
  1. Does it load the muscle in a LENGTHENED position? That's where most of
     the growth stimulus lives.
  2. Can you add load to it over weeks? If not it's a finisher, not a driver.
  3. Is the limiting factor the muscle, or your balance?
  4. Does it respect the wrist? Neutral grip and landmine over straight-wrist
     barbell pressing.

Rep ranges are tied to what you're trying to CAUSE — 3-6 heavy, 6-12 the bulk
of hypertrophy, 12-20 isolation and anything the wrist dislikes loaded, 20+
finishers only. And most sets stop 1-3 reps short of failure, because taking
everything to failure buys little growth and costs a lot of recovery.


4. YOUR TWO GOALS ARE ONE PROGRAMME
===================================
You want the physique AND real range of motion. The doctrine states that
loaded stretch work is where those meet — deep ROM under load on every rep —
and that a session short on mobility is a programming failure, not a missing
extra. It was treating mobility as a cooldown afterthought.


5. DELOADS FROM YOUR NUMBERS, NOT THE CALENDAR
==============================================
A calendar deload is a guess. The app now reads five real signals:

  - lifts going backwards (top weight or total volume down session to session)
  - the same loads starting to feel harder
  - sleep or energy trending low across check-ins
  - any muscle group above its recoverable ceiling
  - weeks since you last backed off

Two or more and the coach is instructed to make the case for a deload week
BEFORE you raise it. Tested both ways: three lifts backwards with sleep at
4/10 triggers it; the same athlete progressing on 8/10 sleep triggers nothing.


6. WEEK IN REVIEW  (Progress tab)
=================================
The thing a real coach does that an app never does. One button:

  what actually went well, using your numbers
  the single biggest problem with the week
  what's changing next week and why
  whether you need a deload

And it emits the directives to make those changes, so a review isn't just
commentary — the programme actually moves.


7. WHAT SEPARATES A COACH FROM AN EXERCISE LIST
===============================================
Written into the doctrine explicitly:
  - notice what you haven't mentioned — a lift stalling three sessions, a
    muscle quietly under-trained for a fortnight — and say so unprompted
  - explain WHY in one line, never a bare instruction, never a lecture
  - hold the long view; don't chase a bad day with a harder session
  - know when to take volume away. Anyone can add it.
  - be specific. "Great work" is worth nothing. "10 clean reps at 45 when it
    was 8 a fortnight ago" is worth something.


Upload index.html AND sw.js.

NOTE ON YOUR SCREENSHOT: the [[ADJUST_NEXT_SET: ...]] brackets were fixed in
v65.2. If you're still seeing them you're on an older build — check
Settings shows v67 after uploading.


1. SUPERSETS ARE THE COACH'S JUDGEMENT NOW, NOT A RULE
======================================================
You were right to push back. What I built paired exercises whenever the
session was under 40 minutes, plus a random roll otherwise. That's scheduling,
not coaching, and it would have supersetted things constantly for no reason
you'd recognise.

The builder now pairs NOTHING on its own. Structure is a decision about your
body, so it belongs to the coach — which can see everything.

WHAT THE COACH CAN NOW SEE
  Hard numbers it never had: logged sets per muscle group over the last 7 and
  14 days, counted from what you ACTUALLY DID, not what was programmed. A
  session written and skipped trained nothing, and the old prompt couldn't
  tell the difference.

  Secondary muscles count half — a row trains back and biceps, but not
  equally. Anything under 8 hard sets in a week is flagged as lagging.

WHAT IT'S TOLD TO DO WITH THAT
  Straight sets are the default and most sessions should be exactly that. It
  reaches for a superset or circuit when the ANATOMY calls for it:
    - a muscle group is behind for the week with no room to add straight sets
    - a small muscle you keep under-training (rear delts, calves, core) that
      can be paired against a big movement at no real cost
    - a genuine finisher, or a travel session with almost no kit

  And it must SAY which muscle group it's catching up and why. You wanted the
  reasoning, not just the pairing.

  It's explicitly told to use every tool — straight sets, supersets, circuits,
  drop sets, holds — and to choose which one the session needs, because you
  should never have to ask for a technique.

RULES IT CANNOT BREAK
  Never superset two heavy compounds; the main lift is always straight sets.
  Never pair two movements on the same muscle — that isn't a rest. Never pair
  two that both load the wrist.

THE TIMING IS HANDLED
  No rest inside a superset or circuit — it sends you straight into the next
  movement — and a full rest only once the round is done. Without that, a
  superset was just two exercises in a row.


2. "+1KG" ON A DUMBBELL YOU DON'T OWN
=====================================
That number came from a rule of thumb — 1kg under 20kg, 2.5kg over — not from
your equipment. It was an instruction you physically could not follow.

The step now comes from your kit: your dumbbell increment for dumbbell work,
a plate each side for barbell work.

AND WHEN THE JUMP IS TOO BIG, IT ADDS REPS INSTEAD
  This is what you suggested and it's what a coach actually does. On light
  dumbbell work the smallest jump you can make is a huge relative leap, so
  forcing it is just grinding.

    8kg lateral raise, 4 clean sets of 12
      -> "Stay at 8kg and go for 14 reps — the next weight up is 10kg, a 25%
          jump you'd be grinding. Earn it with reps first."

    same lift once you're at 18 reps
      -> "10kg. That's mastered. Earned it."

    60kg bench, 4 clean sets
      -> "62.5kg" — a plate each side, a 4% step, perfectly reasonable.

  Anything over roughly a 12% jump becomes reps until you're at the top of the
  rep range, then the weight moves.

TELL IT WHAT YOU OWN
  "my dumbbells go up in 2kg steps"   "the bar weighs 20"
  "I've got 1.25, 2.5, 5, 10 and 20 plates"
  Or Settings, via the coach. It's used for every load call after that.


Upload index.html AND sw.js.


THE COACH WAS ADDING WEIGHT IT HADN'T EARNED
============================================
Your profile has said "only increase load after the previous weight is
mastered, never ego lift" the whole time. The coach was overriding it in two
separate places, and both are now fixed.

WITHIN A SESSION — it was changing the weight BETWEEN SETS
  The mid-set instructions literally told it to give "a load call for the next
  set", so it treated every single set as a decision point. That's why you saw
  42.5kg x 12 followed by 45kg x 9 in the same exercise.

  It is now told plainly: HOLD THE WEIGHT. Same load for all sets of an
  exercise. The only reason to change it mid-exercise is that it's genuinely
  too heavy — form broke down, or you ground out well short of the reps.
  Otherwise the call is "same again".

BETWEEN SESSIONS — one good set was enough to trigger a jump
  The old rule added weight as soon as ONE set at the top weight hit 10+ reps
  and felt "about right". Two things wrong with that. One good set out of four
  is not a mastered weight. And "about right" is the state you want to REPEAT
  — it's the weight to own, not to jump from.

  The rule now: you must complete the FULL number of sets at the same weight,
  with reps holding up across them, feeling about right or easier. Only then
  does it go up.

WHAT THAT LOOKS LIKE
  4 x 45kg, all about right     -> 47.5kg. Mastered, earned it.
  4 x 45kg, all felt easy       -> 50kg. Proper jump.
  3 x 45kg, about right         -> stays at 45kg. "3 of 4 — get all 4 first."
  4 x 45kg but it felt hard     -> stays at 45kg.
  reps fell away 12, 9, 6, 5    -> stays at 45kg. "Even them out first."
  grinding                      -> drops to 41.5kg.
  42.5x12 then 45x9             -> stays. This is the pattern from your
                                   screenshot; it used to trigger a bump.

  A hold is now stated as a good session, not a failure — because it is one.

SETTINGS -> PROGRESSION
  "Sets to master" — 4 by default. Complete that many at one weight feeling
  about right or easier and the load goes up next session. Anything less and
  it holds. Change it if you want a stricter or looser standard.

AND THE COACH IS TOLD TO STOP INVENTING NUMBERS
  The app already calculates the correct call and prints it as "Load:" on the
  exercise. The coach now has explicit instructions to STATE THAT NUMBER
  rather than talking you into a different one. Adding weight because a single
  set looked good is exactly the ego lifting you asked it to prevent.


Upload index.html AND sw.js.


1. THE BRACKETS IN THE COACH BUBBLE
===================================
You saw [[ADJUST_NEXT_SET: Bench Press | +2.5kg]] printed at you. That's the
coach's instruction to the app, and you were never meant to see it.

The mid-set reply — the one that appears under an exercise after you log —
was the ONLY coach reply in the app that never went through the directive
parser. So its instructions were printed raw AND never carried out. Both
halves of that were wrong: it looked broken, and the weight it promised to
bump never actually got bumped.

It now runs through the same parser as everything else: the instruction is
applied, the brackets are stripped, and what did change is confirmed
underneath in gold.


2. "ONE MORE SET" WHEN YOU'D FINISHED
=====================================
The mid-set coach was told your target was DB.workout.sets — the GLOBAL
default for the session, not the number of sets on THAT exercise. So an
exercise set to 3 was being judged against a default of 4, and it cheerfully
asked for a fourth set that didn't exist.

It now uses the actual per-exercise count, and it's told explicitly when a set
was your LAST one — with instructions not to call a load for a next set that
isn't coming, and to point you at the next exercise instead.


3. REST IS YOURS TO SET NOW
===========================
Between exercises was HARDCODED at 150 seconds, in two separate places.
Nothing in the app could change it — not you, not the coach.

Now there are two defaults and both are adjustable:

  SETTINGS -> REST TIMERS
    Between sets       (starts at 90s)
    Between exercises  (starts at 2 min 30s)

  ON ANY EXERCISE (Train)
    A Rest row next to Sets, with − and + in 15-second steps. That exercise
    keeps its own rest and ignores the default from then on.

  ON THE RUNNING TIMER
    −15 and +15. These don't just change the timer in front of you — they
    REMEMBER, so the same rest applies next time. Adjusting mid-session and
    having it reset was the annoying half of the old behaviour.

  THE COACH
    Still sets rest when it has a reason to ("3 minutes on bench"), and that
    counts as an override the same as if you'd tapped it.

Order of precedence: what you set on that exercise beats your default beats
90 seconds. Travelling caps between-exercise rest at 90s so a short session
stays inside the time you've got.

ONE SUBTLETY WORTH KNOWING
  The builder stamps "90s" onto every exercise it creates. If that counted as
  an override, changing your default would have appeared to do nothing at all.
  So only a rest you or the coach deliberately set counts — everything else
  follows the default and moves when you move it.


Upload index.html AND sw.js.


THE SESSION PILL WOULDN'T STAY WHERE YOU PUT IT
===============================================
Not a preference that wasn't saving — the drag was never being RECOGNISED as a
drag at all.

When you pressed the pill it recorded where your finger went down, but it
forgot to record the starting point. The movement check then read:

    Math.abs(newX - undefined) > 4

Any sum with undefined in it is NaN, and NaN > 4 is always false. So the
"you've moved it" flag never flipped, no matter how far you dragged.

On release the code asks "did it move?" — the answer was permanently no — so
every drag was handled as a TAP. And the tap branch calls the function that
puts the pill back in its corner. You were fighting a reset that your own drag
was triggering.

The rest timer never had this because it just marks the drag the moment
anything moves. The pill now does the same.

ALSO FIXED WHILE I WAS IN THERE
  - The whole pill drags now, not only the 19px time text. A small target with
    wet hands was half the problem.
  - It's clamped while you drag, not only when you let go, so it can't be
    thrown off the edge of the screen and stranded.
  - A genuine tap still does nothing, and two quick taps still send it back to
    the corner.

VERIFIED
  drag it            → moves, and the position is saved
  redraw the screen  → stays where you put it (this is what used to reset it)
  single tap         → doesn't move
  double tap         → back to the corner
  drag off-screen    → clamped to the edge, never lost


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
