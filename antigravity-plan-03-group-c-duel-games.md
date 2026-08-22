# Antigravity Plan: Group C — Turn-Based Duel Games

Covers: Ink Fleet (`/rift/fog`), Rimaya (`/rift/arrow`). Requires the
Foundation plan complete first. These two share a "reveal after both sides
commit" turn structure conceptually, but not literal shared code — each
gets its own implementation below.

**STANDING INSTRUCTION:** any implementation decision not resolved below
must be paused on and asked to Jabir directly, with 2–3 concrete options
and a real argument for/against each. Do not guess.

---

## 1. Ink Fleet — `/rift/fog`

**New route:** `app/rift/fog/page.tsx`

### Core types

```ts
type GridSize = 5 | 10;
type Fleet = { size: number; cells: [number, number][]; hits: Set<number> }[];
type CellState = 'unknown' | 'hit' | 'miss';
type Mode = 'cpu' | 'local';
```

Fleet composition by grid size:
- **Small (5×5):** one size-3 ship, two size-2 ships.
- **Classic (10×10):** the traditional five-ship set — sizes 5, 4, 3, 3, 2.

### Placement

Both manual (drag/click) and auto-random offered as a choice each game.
Manual placement needs standard adjacency validation (ships can't overlap,
and depending on your convention, may or may not be allowed to touch —
confirmed below as an open decision).

**ASK JABIR — can ships touch edge-to-edge during placement?**
- *Option A:* ships may be placed directly adjacent to each other (only
  overlap is illegal) — more placement freedom, slightly denser boards.
- *Option B:* ships must have at least one empty cell of separation
  (classic Battleship house-rule in some variants) — clearer visual
  separation, but meaningfully restricts placement options especially on
  the 5×5 board where space is already tight.

### The critical two-player rule (locked, not open)

Once both fleets are placed and locked in, **ship positions are never
rendered again for either player** — not even to the player whose fleet it
is. Only accumulated hit/miss marks display from that point forward. This
is what allows both players to share one screen with no pass-the-device
step. Do not accidentally leave a debug/dev view that shows ship positions
— this must hold in the actual shipped build, not just "usually" true.

### CPU AI

- Random targeting while no hit is currently "live" (i.e., no unsunk ship
  has been hit yet).
- Once a hit lands: switch to targeting the four orthogonal neighbors of
  that hit cell, continuing in whichever direction produces further hits,
  until that ship is fully sunk.
- Revert to random targeting once the ship sinks.
- Reference approach: github.com/jlekowski/battleships-offline (per
  Jabir's note) — read that repo's AI logic for structural guidance on the
  hunt-and-target state machine, don't just reinvent it from the
  description alone if the reference is available.

### Rendering

Ink-brush outline for ships (visible only during your own placement
phase, per the rule above), solid ink dot for a hit, faint ripple ring for
a miss. Two-party color convention from the Foundation plan applies to
each player's own grid border/accent, not to the hit/miss marks themselves
(hit/miss should probably be neutral ink tones, not tied to the
sepia/vermillion pairing, since both players see the same hit/miss marks
on the *opponent's* grid — there's no "my color vs their color" concept
for a miss ripple).

**ASK JABIR — grid size default:** should the game default to opening on
Small (5×5, faster games) or Classic (10×10, more traditional), with the
other as a manual pre-game choice?
- *Option A:* default Small — faster to discover/play in a hidden-link
  context, better fit for a quick "found it, let's see what this is" visit.
- *Option B:* default Classic — more recognizable as "real Battleship" to
  a first-time visitor, at the cost of a longer typical session.

---

## 2. Rimaya (archery) — `/rift/arrow`

**New route:** `app/rift/arrow/page.tsx`

Mechanic confirmed against a real reference video during planning
(frame-by-frame, including pixel-tracked reticle drift) — this is not a
guessed spec, it's a verified one. Implement exactly as follows.

### Core sequence

1. Turn starts, bow visible, static first-person camera on the target —
   bow does **not** disappear automatically.
2. Player presses and holds anywhere on the play area → bow disappears,
   a reticle appears and begins **continuous, unpredictable drift** (not
   a static point the player can "set and forget").
3. A ring begins sweeping clockwise from empty to a complete circle over
   roughly 1.5–2 seconds — a **maximum hold duration**, not the only
   trigger.
4. **Two valid ways to fire:** release early (fires immediately at the
   reticle's current position), or hold through to the ring's completion
   (auto-fires at that point).
5. Camera zooms in on the shot's flight and landing point, shows a "+N"
   score popup based on which ring it landed in.
6. Wind (icon + numeric readout) is re-rolled once per turn, applied as a
   trajectory displacement independent of the player's aim precision.

### Reticle drift implementation

**ASK JABIR — exact drift model:** the planning-phase frame analysis
confirmed drift is real and continuous, but did not (and couldn't, from
video alone) establish the precise underlying math. Options:
- *Option A:* a slow constant-velocity drift in a randomly chosen
  direction per hold, with the player's own finger/mouse movement adding a
  direct offset on top — closest to "the reticle has its own momentum plus
  your input," matching the reference's felt behavior.
- *Option B:* a random-walk drift (small random perturbation applied every
  frame, no fixed direction) — less predictable turn to turn, arguably
  harder to develop "muscle memory" against, which may or may not be
  desirable.
- *Option C:* drift magnitude scales with how long the hold has lasted
  (starts still, gradually drifts more the longer you hold) — adds a
  distinct "don't wait too long" pressure on top of the ring timer.

This is a genuine game-feel decision, not just an implementation detail —
worth playtesting more than one option if time allows, rather than
committing to a single approach purely on paper.

### Match structure

8 arrows per side total, 2 shots per turn (4 alternating turns per side).
Score accumulates across all 8 arrows; highest cumulative total wins.

### Mode

Both vs. CPU and local pass-and-play two-player — unlike Ink Fleet, this
game doesn't expose hidden information between turns (both players see the
same target, same wind, same everything), so there's no reveal-mechanic
complexity here at all; local two-player is just straightforward
turn-alternation.

**CPU behavior (vs. CPU mode):** the CPU needs to simulate the same
hold/drift/release mechanic, not just "compute a good landing spot and
skip the mechanic" — otherwise CPU shots would feel disconnected from how
the player experiences their own turns. Simplest honest approach: CPU
picks a target release-ring-size (its "skill level") and a release timing
within that, then applies the same drift+wind math the player experiences.

### Target visual

Enso-style ink-brush circle standing in for the traditional ringed
archery target — concentric scoring bands within it, reusing the
ink-bleed filter for the brush-circle's outer edge specifically (not
necessarily for the precise scoring rings themselves, which likely need
crisp/legible boundaries rather than a bled/fuzzy edge — flagging this
tension explicitly).

**ASK JABIR — how literally "fuzzy" should the scoring rings look:**
- *Option A:* crisp, precisely legible ring boundaries (like a real
  target), with only the outermost silhouette getting the ink-bleed
  treatment — prioritizes fairness/clarity of where a shot actually landed.
- *Option B:* every ring rendered with some ink-bleed softness for visual
  consistency with the rest of the site — more thematically unified, but
  risks making it genuinely harder to tell which ring a shot landed in,
  which matters since scoring depends on it.

---

## QA checklist

- [ ] `npm run build` succeeds, `tsc --noEmit` clean
- [ ] Ink Fleet: verify ship positions are never rendered post-placement,
      for either player, at any point during actual play — check this by
      inspecting the rendered DOM/canvas state directly during a live
      two-player game, not just by reading the component code
- [ ] Ink Fleet: verify CPU hunt-and-target behavior correctly switches
      modes on a hit and correctly reverts to random after a sink, at both
      grid sizes
- [ ] Ink Fleet: verify manual placement correctly rejects illegal
      placements (overlaps, and adjacency per whichever option was chosen)
- [ ] Rimaya: verify both release methods (early release, ring completion)
      correctly fire a shot and that only one shot fires per hold (no
      double-fire race condition between a release event and the ring's
      auto-fire timer)
- [ ] Rimaya: verify wind re-rolls exactly once per turn, not per-frame or
      per-shot within a two-shot turn
- [ ] Rimaya: verify score accumulates correctly across all 8 arrows and
      the match ends after exactly 4 turns per side
- [ ] Both: confirm correct behavior in both light and dark in-game theme
      states
