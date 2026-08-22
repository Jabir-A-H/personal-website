# Antigravity Plan: Group B — RAF Game-Loop Games

Covers: Falling Ink (`/rift/spill`), Ink Rush (`/rift/current`). Requires
the Foundation plan complete first. Both games share a
`requestAnimationFrame`-driven spawn-and-collide loop — built once here,
consumed by both.

**STANDING INSTRUCTION:** any implementation decision not resolved below
must be paused on and asked to Jabir directly, with 2–3 concrete options
and a real argument for/against each. Do not guess.

---

## 1. Shared game-loop skeleton

**New file:** `lib/games/useRafLoop.ts`

```ts
'use client';

import { useEffect, useRef } from 'react';

export function useRafLoop(callback: (deltaMs: number) => void, active: boolean) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!active) return;
    let rafId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      callbackRef.current(delta);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active]);
}
```

**Trap:** the cleanup function (`cancelAnimationFrame`) is not optional —
both games mount/unmount as the player navigates to and from `/rift/spill`
or `/rift/current`, and a leaked RAF loop continues consuming CPU in the
background after the component unmounts. Verify this specifically during
QA, not just by reading the code — leaks like this don't throw errors,
they just silently waste battery.

Both games use this hook identically; only what happens inside the
callback differs.

---

## 2. Falling Ink — `/rift/spill`

**New route:** `app/rift/spill/page.tsx`

### Core state

```ts
type Drop = {
  id: string;
  x: number;       // horizontal position, free (not lane-locked)
  y: number;       // current vertical position
  color: 'black' | 'red';
  speed: number;   // pixels/ms, increases with score
};

type RatioMode = 'A' | 'C'; // player-toggleable, see locked spec
```

### Spawn logic

- Random X position per spawn, no lane snapping.
- Color: red capped at ≤10% of drops spawned overall (not the same as the
  scoring ratio in §"Fail condition" below — this is spawn-rate, that's a
  caught/missed ratio; keep these two percentages conceptually separate
  even though both reference "10%").
- Spawn rate and fall speed both increase as a function of current score
  — write this as a simple continuous function (e.g. `speed = baseSpeed +
  score * speedFactor`) rather than discrete difficulty steps, matching
  the locked "difficulty ramps with rising score" design.

### Fail condition — the two ratio modes

```ts
// Option A: red ratio only counts what was actually caught
ratioA = redCaught / totalCaught;

// Option C: missed black drops count against the player too
ratioC = redCaught / (totalCaught + missedBlack);
```

Both must be implemented, player-toggleable per the locked design (not a
one-time build decision — this is a real runtime toggle in the game's own
settings, not a config flag Antigravity picks once).

**Trap:** in Option C, make sure "missed black" is counted the instant a
black drop passes the pot's Y-position uncaught, not retroactively at
"round end" — the ratio needs to update live so the player gets real-time
feedback on their current risk level, matching the locked "difficulty
should feel earned by success" framing.

### Controls

Drag, tap-zones, and arrow keys all active simultaneously — implement as
three independent event listeners all writing to the same pot-position
state, not as three separate mutually-exclusive input modes the player has
to pick between.

### Ink-pot and drop rendering

Reuse the ink-bleed SVG filter from `Logo.tsx` for the droplet visuals.

**ASK JABIR — visual distinction between black and red drops beyond
color alone:** relying on color alone for a pass/fail mechanic risks
accessibility issues for colorblind players. Options:
- *Option A:* color only, matching the locked spec exactly as discussed —
  simplest, but a real accessibility gap worth being aware of.
- *Option B:* add a secondary visual cue (e.g. red drops rendered with a
  slightly different shape or a small icon overlay) so the distinction
  doesn't rely on color perception alone.

---

## 3. Ink Rush — `/rift/current`

**New route:** `app/rift/current/page.tsx`

Modeled on Ketchapp's *Rush*, simplified to flat 2D (confirmed decision
from planning — no pseudo-3D perspective tunnel).

### Core state

```ts
type LaneSegment = { type: 'obstacle' | 'gap' };
type TrackRow = [LaneSegment, LaneSegment]; // always exactly 2 lanes

type GameState = {
  currentLane: 0 | 1;
  track: TrackRow[];  // scrolls toward the player
  speed: number;      // increases continuously with survival time
  survived: number;   // ms — this IS the score, per the locked decision
};
```

### Loop behavior (using `useRafLoop` from §1)

- Each tick: advance `survived` by `deltaMs`, increase `speed` as a
  continuous function of `survived`, scroll the track array toward the
  player at the current `speed`.
- When a track row reaches the player's fixed Y position: if that row's
  segment in `currentLane` is `'obstacle'` → game over. If it's `'gap'` →
  game over (falling through). Otherwise the player passes through safely.
- Single input: tap always toggles `currentLane` between 0 and 1.

### Track generation

New rows are generated ahead of the player as needed (not the whole track
upfront) — each lane's segment independently randomized as obstacle or
gap, mixed per the locked design. Avoid generating a row where *both*
lanes are simultaneously impassable (both obstacle, or both gap, or one of
each) — a row must always leave at least one lane safely passable, or the
game becomes unwinnable by design rather than by player error.

**Trap:** that last rule is easy to accidentally violate if obstacle/gap
assignment per lane is fully independent random — explicitly check "is at
least one lane clear" after generating each row, and regenerate if not,
rather than trusting randomness to rarely produce an impossible row (it
will happen often enough at higher speeds to be a real, noticeable bug).

### Rendering

Ink droplet avatar (reusing the shared filter), flat 2D lane visualization
— see the earlier sketch from planning for the intended layout (two
side-by-side columns, segments scrolling toward the player).

---

## QA checklist

- [ ] `npm run build` succeeds, `tsc --noEmit` clean
- [ ] Both games: confirm `useRafLoop`'s cleanup fires correctly on
      unmount — navigate away mid-game, check DevTools performance/memory
      tab for a lingering animation frame loop
- [ ] Falling Ink: verify red-drop spawn rate never exceeds 10% of total
      spawns even at high difficulty/speed
- [ ] Falling Ink: verify both Option A and Option C ratio modes compute
      correctly and the game-over trigger fires at the right threshold in
      each mode independently
- [ ] Falling Ink: verify drag, tap-zone, and keyboard controls all
      independently move the pot correctly and don't conflict/fight each
      other when used in combination
- [ ] Ink Rush: verify no track row is ever generated with both lanes
      simultaneously impassable
- [ ] Ink Rush: verify score (survival time) persists correctly to
      `localStorage` via the shared high-score utility with
      `higherIsBetter = true`
- [ ] Ink Rush: verify speed increases smoothly (no visible stutter/jump)
      as a continuous function of survival time, not in visible discrete
      jumps
- [ ] Both games: confirm they render correctly and remain playable in
      both light and dark in-game theme states
