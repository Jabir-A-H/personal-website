# Hidden Mini-Arcade & Easter Eggs — Master Plan (Human Review Copy)

This is the full consolidated spec from planning, written for you to review and
mark up — not the Antigravity implementation version. Nothing here has been
built yet. Once you've reviewed/edited this, a separate diff-ready plan file
gets generated from it for actual implementation.

---

## 1. Philosophy & scope

- Not a selling website — the arcade is a personality flourish, not a feature
  to advertise. No hub page, no nav entry, no mention anywhere on the visible
  site that it exists.
- Discovery is entirely through disguised links hidden inside real, existing
  page copy — no visual affordance (no underline, no color change) marks them
  as links. Cursor stays as pointer for baseline usability; keyboard/
  screen-reader users can still Tab to them since they're real anchors.
- Hidden links only live in **static, hardcoded JSX copy** — never inside
  `data.json`-sourced content — so nothing here fights the site's
  data-driven-over-hardcoded principle, and editing your actual content later
  can't accidentally break a hidden link.
- Every game is excluded from `sitemap.ts` and disallowed in `robots.txt`, plus
  a page-level `robots: noindex` as a second layer.
- Shared architecture and shared visual language across games wherever the
  mechanics genuinely overlap — the goal is to build once, reuse often, not
  hand-roll eleven unrelated one-off games.

---

## 2. Route slugs

All under a shared `/rift/` prefix for organizational tidiness — there is
still no hub page or index linking them together, this is purely a folder
convention.

| Game | Slug |
|---|---|
| Ink-stroke toy | `/rift/wash` |
| Grid Strategy (tic-tac-toe + Gomoku) | `/rift/stones` |
| Connect-4 | `/rift/column` |
| Memory / Matching | `/rift/echo` |
| Claim the Scroll (Dots-and-Boxes + Triangles) | `/rift/seal` |
| Falling Ink | `/rift/spill` |
| Ink Rush | `/rift/current` |
| Ink Fleet (Battleship) | `/rift/fog` |
| Rimaya (archery) | `/rift/arrow` |
| Ink Shed (Uno) | `/rift/deck` |
| Sudoku | `/rift/grid` |

---

## 3. Hiding spots — fully resolved

Pulled from real, existing static copy already on the pages (verified
against the live repo, including a second pass on Now/Journey/Home that was
originally left open). Every entry below is confirmed hardcoded JSX text,
not `data.json`-sourced content.

| Page | Existing static text it lives in | Word converted to a link | Game |
|---|---|---|---|
| Education | "Core Professional Identity" | `Core` | Grid Strategy |
| Education | "Research & Publications" | `Research` | Sudoku |
| Experience | "Leadership & Community" | `Community` | Ink Shed |
| Experience | "Achievements & Competitions" (section heading) | `Achievements` | Ink Rush |
| Projects | "Featured_Projects" (section heading) | `Featured` | Connect-4 |
| Whispers | "Fragments of thought & reflection" | `Fragments` | Ink-stroke toy |
| Contact | "communication channels" | `channels` | Ink Fleet |
| Contact | copyright year in the footer | the year itself | Claim the Scroll |
| Now | "Currently" (status indicator label) | `Currently` | Falling Ink |
| Journey | "The walkthrough" (header subtitle) | `walkthrough` | Rimaya |
| Home | "Still learning. Always building." (footer sign-off quote) | `building` | Memory/Matching |

Deliberately **not** used: Home's "Download Resume" button — that's a real
functional control, not decorative copy, and shouldn't double as a disguised
game link. Also deliberately avoided: both pages' "Jump to section"
in-page nav — that text only exists as an `aria-label` on a `<nav>` element
(an accessibility attribute, never rendered on screen), so it can't host a
visible disguised link at all. Every spot in this table has been directly
re-verified against the live repo as genuinely visible, non-interactive
static text.

---

## 4. Shared architecture — build-once, reuse-often where it genuinely fits

These are starting defaults, not hard rules. If a shared component would
force a mediocre fit onto a game just to avoid writing new code, build that
game its own component instead — quality of the individual game wins over
reuse-for-its-own-sake. Treat each item below as "check this first," not
"must use this."

- **Shared win-check engine** — Grid Strategy (N-in-a-row on a free-placement
  grid), Connect-4 (N-in-a-row with gravity-drop placement), and Claim the
  Scroll (shape-completion on square or triangular dot grids) all reduce to
  variations on one generalized adjacency/line-check function.
- **Shared game-loop skeleton** — Falling Ink and Ink Rush both are
  `requestAnimationFrame`-driven, spawn-object-and-check-collision loops.
  Same skeleton, different spawn rules and collision consequences.
- **Shared two-party color convention** — sepia (dark mode) / black (light
  mode) ink for "player one," vermillion/cinnabar red for "player two,"
  historically the two most common ink colors after black. Applies uniformly
  to: Connect-4 droplets, Grid Strategy marks, Claim the Scroll claimed
  shapes, Ink Fleet's two fleets, the card game's two hands. One shared color
  token pair, referenced everywhere rather than redefined per game.
- **Shared ink-bleed SVG filter** — the existing `feTurbulence`/
  `feDisplacementMap` filter from `Logo.tsx` is the visual basis for: the
  Ink-stroke toy's brush strokes, Falling Ink's droplets, Ink Rush's droplet
  avatar, and the archery game's arrow. One filter definition, many
  consumers — but if any one of these needs a meaningfully different visual
  treatment to look right, give it its own filter rather than distorting the
  shared one to fit.
- **Shared CPU-difficulty pattern** — "Easy: random + block immediate loss,
  Medium: block/take immediate wins + heuristic, Hard: minimax where
  computationally realistic (3×3 Grid Strategy, Connect-4), heuristic
  lookahead where it isn't (larger Grid Strategy boards)" is the same shape
  of difficulty ladder reused across every CPU opponent in the roster.
- **Shared theme handling** — every game respects the site's light/dark
  toggle and also carries its own in-game theme toggle button (a standing
  rule established during planning, applies to all eleven).
- **Shared high-score storage convention** — per-game `localStorage` keys,
  wrapped defensively in try/catch (private-browsing guard), following the
  same TypeScript-inference discipline already used elsewhere in the repo.
- **Cross-promotion hints** — a small, optional "you might also like..."
  nudge shown on some (not all) game-over screens, linking to a thematically
  similar game. Proposed pairings: Falling Ink ↔ Ink Rush (both fast reflex
  games), Grid Strategy ↔ Connect-4 (both quick tactical grid duels), Ink
  Fleet ↔ the archery game (both turn-based 1v1 duels with a reveal moment),
  Sudoku ↔ Memory/Matching (both calm, solo-friendly puzzles). Deliberately
  skipped for the Ink-stroke toy, the card game, and Claim the Scroll — some
  games should stay dead ends so the hunt doesn't feel like a guided tour.

---

## 5. Suggested development order

Grouped by shared code, not by when each game was first proposed —
recommended sequence for build efficiency, not a strict rule. Reorder freely.

**Group A — grid win-check engine (build the shared engine once, reuse for
all three):** Grid Strategy, Connect-4, Claim the Scroll

**Group B — RAF game-loop engine (build the shared loop once, reuse for
both):** Falling Ink, Ink Rush

**Group C — turn-based duel games (share the "reveal after both sides
commit" pattern, but not much literal code):** Ink Fleet, archery game

**Group D — standalone, no shared engine with anything else:** Memory/
Matching, the card game (Ink Shed/Discard/whichever name), Sudoku

**Group E — creative tool, not a competitive game, build in isolation:**
Ink-stroke toy

---

## 6. Per-game specs

### 6.1 Ink-Stroke Toy — `/rift/wash`

Not a competitive game — a drawing canvas.

- **Two distinct ink layers:**
  - *Ambient hover trail* (desktop only, no click) — full-strength color,
    fades after 2–4 seconds, purely decorative, never saved.
  - *Permanent draw layer* (click/touch-drag) — the actual artwork, does
    **not** fade on its own, brush width varies with movement speed, color
    from a picker.
- **Wash/eraser tool** — toggleable brush mode, permanently removes ink along
  the dragged path (same permanence as drawing, since erasing is a deliberate
  edit).
- **Undo/redo** — every stroke or erase is one discrete history entry.
- **Canvas bounds** — viewer-toggleable between a bordered "paper" rectangle
  and full-viewport.
- **Backgrounds** — all procedural (no photos, no licensing risk): mountain
  ridge silhouette, river wave-lines, nature/forest silhouette, cityscape
  skyline silhouette, and plain in three paper shades (white, cream/aged, and
  a soft gray-wash). Viewer-selectable.
- **Export** — both PNG and SVG, each with a transparent-background toggle
  (artwork only) vs. normal (artwork + chosen background baked in). The
  ambient hover trail never appears in any export.
- **Theme** — respects site theme, plus its own in-page theme toggle.

Honest flag: despite being the "simplest" idea originally, this ended up the
most feature-dense single game in the roster (background picker, bounds
toggle, 4-way export combination, color picker, tool switcher, theme toggle).
Budget accordingly.

### 6.2 Grid Strategy (tic-tac-toe + Gomoku merged) — `/rift/stones`

- **Board size picker:** 3×3/win-3 (classic tic-tac-toe), 9×9/win-5, or
  15×15/win-5 (traditional Gomoku scale).
- **Marks:** ink brush cross vs. ink brush ring (no dots/stones despite the
  slug name — that was decided before the Connect-4 droplet idea existed).
- **Mode:** vs. CPU or local two-player, toggle at game start.
- **Difficulty:** Easy (random + block immediate loss), Medium (block/take
  immediate wins + heuristic), Hard (true minimax, genuinely unbeatable, but
  **only on the 3×3 board** — minimax is computationally impractical at 9×9/
  15×15, so Hard there means a stronger heuristic with 2-move lookahead, not
  a mathematically perfect player).
- **No move timer** — untimed turns.
- Win detection: any line of N marks through the last-placed cell, checked
  horizontally/vertically/diagonally.

### 6.3 Connect-4 — `/rift/column`

- **Fixed 7×6 board**, win-4 — no size variants (it's a solved, well-known
  format; variable size would just add work for no real gain).
- **Marks:** ink droplet/blob per player, **one uniform shape reused every
  drop** (no per-blob randomization — keeps the board readable at a glance).
- **Colors:** Player 1 = black ink (light mode) / light sepia (dark mode);
  Player 2 = vermillion/cinnabar red, consistent across both themes. This
  color pairing is the project-wide convention (see §4).
- **Drop animation:** liquid free-fall with a slight stretch, then jellies
  into a settled rounded blob on contact — no flattening or dissolving.
- **Mode:** vs. CPU or local two-player.
- **Difficulty:** Easy/Medium/Hard, and Hard is a genuine, realistic minimax
  here (the board is small enough for it to be truly unbeatable, unlike
  Grid Strategy's larger boards).

### 6.4 Memory / Matching — `/rift/echo`

- **Grid sizes:** 4×4 (8 pairs), 6×6 (18 pairs), 8×8 (32 pairs), picker at
  start.
- **Modes:** Solo, vs. CPU, local two-player (three modes, confirmed — not
  four despite an earlier miscount during planning).
- **Turn rule:** match → same player continues; miss → turn passes. This is
  the standard rule the whole genre uses — it's fair specifically because
  every flip (hit or miss) is visible to both players, not because misses
  don't matter.
- **Scoring:** Solo = time-to-clear (lower is better); CPU/two-player =
  pairs claimed per side.
- **CPU difficulty:** tunable memory. Easy/Medium has a chance to "forget" a
  previously-seen card and re-flip it anyway. Hard = perfect recall as a
  baseline, but with a small periodic defect chance built in — so it stays
  genuinely tough without being flatly unbeatable even on the 8×8 board.
- **Card backs:** show the shodo mark (from `Logo.tsx`).
- **Shape set (32 total, covers the largest board with no repeats):**
  mountain, river, sun, moon, star, flower, cloud, rain, wave, leaf, branch,
  bamboo, lotus, pine tree, wind-swirl, snowflake, lightning bolt, fish,
  crane, butterfly, dragonfly, reed, stone, bridge, lantern, boat, feather,
  vine, crescent, droplet, ripple, ember.

### 6.5 Claim the Scroll (Dots-and-Boxes + Triangles merged) — `/rift/seal`

- **Grid sizes:** 4×4, 6×6, or 8×8 dots, picker at start.
- **Shape picker:** square-grid mode or triangle-grid mode, chosen at game
  start — this merge works because both games are mechanically the same
  "draw a line, close a shape, claim it, get an extra turn" engine, just a
  different grid geometry underneath.
- **Interaction:** click one dot, drag to an adjacent dot to draw a line
  between them (same gesture as the cardgames.io Triangles reference).
- **Mode:** vs. CPU or local two-player.
- **Difficulty:** single tier only — the standard, well-known "avoid drawing
  a line that hands the opponent a free 3rd/4th side" safe-play heuristic.
  Not a novel algorithm, and not worth splitting into Easy/Hard since the
  smart version isn't meaningfully harder to build than a naive one.
- **Claimed shapes** fill with the claiming player's ink color (sepia/
  vermillion convention).
- A single line can close two shapes at once where the grid allows it — both
  get claimed, and the extra-turn rule still applies.

### 6.6 Falling Ink — `/rift/spill`

- **Single unified mechanic** (not two separate modes, despite the original
  "catch vs. dodge" framing early in planning): an ink pot at the bottom
  collects falling ink drops.
- **Drop spawn:** random X position along the top, falling along a free
  (non-lane-locked) trajectory — confirmed this is not harder to build than
  fixed lanes, actually simpler (no snapping logic needed).
- **Drop composition:** mostly black, with red capped at **no more than 10%**
  of the ink the player has actually caught (ratio, not a raw count).
- **Fail condition:** if the red ratio climbs above 10%, game over.
- **Ratio denominator — viewer-toggleable between two rule sets:**
  - *Option A:* red caught ÷ total caught. Missing a black drop has no
    penalty at all — it's just a lost point.
  - *Option C:* red caught ÷ (everything caught, including drops the
    player let fall past). Passivity doesn't protect the score here — you
    have to actively catch black ink to dilute any red mistakes.
- **Difficulty ramp:** tied directly to rising score — the more black ink
  caught, the faster drops fall and the more frequently (still capped at
  10%) red drops appear. Succeeding is what makes the game harder.
- **Controls:** drag, tap-zones, and arrow keys all active simultaneously —
  player uses whichever suits their device.
- **Solo only** — no CPU/two-player variant, matches its reflex-game nature.

### 6.7 Ink Rush — `/rift/current`

Modeled directly on Ketchapp's *Rush* (rolling-ball lane-switcher), simplified
to flat 2D instead of the original's pseudo-3D perspective tunnel — same
mechanic, much less rendering complexity.

- **2 lanes**, single-tap control that always toggles to the other lane (no
  distinct left/right inputs needed at 2 lanes).
- **Avatar:** an ink droplet, auto-advancing forward.
- **Track segments** scroll continuously toward the player; each lane's
  segment is independently either a solid ink-blot obstacle or a clear gap
  — a mix of both types, matching the reference.
- **Fail condition:** colliding with an obstacle, or being in a lane whose
  segment is a gap when it passes underneath.
- **Difficulty ramp:** speed increases continuously with survival time — this
  is the entire difficulty curve, same as the reference.
- **Score:** time survived.
- **Solo only.**

### 6.8 Ink Fleet (Battleship) — `/rift/fog`

- **Grid size picker:** Small (5×5, trimmed fleet — one size-3 ship, two
  size-2 ships) or Classic (10×10, traditional fleet — sizes 5,4,3,3,2).
- **Placement:** manual (drag/click to place your own fleet) or auto-random,
  offered as a choice each game.
- **Mode:** vs. CPU, or local two-player on the same device — with a key
  design decision: **once both fleets are placed and locked in, ship
  positions are never rendered again for either player**, only accumulated
  hit/miss marks. This means no pass-the-device or "look away" screen is
  needed between turns — both players can freely view the shared screen the
  whole game, since there's nothing to peek at.
- **Marks:** ink-brush outline for your own placed ships (visible only during
  your own placement phase), solid ink dot for a hit, faint ripple ring for
  a miss.
- **CPU AI:** random guessing while no hit is "live"; switches to hunting
  adjacent cells once a hit lands, reverts to random once that ship sinks.
  Scales the same way at both grid sizes. (Reference for implementation
  approach: github.com/jlekowski/battleships-offline, per your note.)
- **Win condition:** sink the opponent's entire fleet first.

### 6.9 Rimaya (archery) — `/rift/arrow`

Mechanic confirmed against a real reference video (frame-by-frame, including
pixel-tracked reticle drift) rather than assumed.

- **Aiming:** press-and-hold to begin — the bow visually disappears **only
  once the player starts holding**, not automatically at turn start. A
  reticle appears and **drifts continuously and unpredictably** while held
  (confirmed via frame analysis: real, compounding movement, not something
  you can just hold still through).
- **Timer ring:** a ring sweeps clockwise around the reticle from empty to a
  complete circle over roughly 1.5–2 seconds — this acts as a **maximum
  hold cap**, not the only way to fire.
- **Release — two valid methods:** lift your finger early (fires immediately
  at wherever the reticle currently is), **or** hold through to the ring's
  completion (auto-fires at that point). Both are legitimate ways to shoot.
- **Wind:** shown as an icon (direction + intensity, visually escalating at
  higher values) plus a numeric readout, re-rolled once per turn — displaces
  the shot's landing point independent of the player's aim precision.
- **Camera:** static first-person view of the target throughout — no
  repositioning. Zooms in on each shot to show landing + a "+N" score popup.
- **Target visual:** an Enso-style ink-brush circle standing in for the
  traditional ringed target, scoring zones as concentric bands within it.
- **Match structure:** 8 arrows per side total, 2 shots per turn (4 turns
  each side, alternating). Score accumulates across all 8 arrows; highest
  total wins.
- **Mode:** vs. CPU, and local two-player (pass-and-play, since aiming here
  doesn't expose hidden information the way Ink Fleet's grid does).

### 6.10 Ink Shed (Uno) — `/rift/deck`

Deliberately the most system-heavy game in the roster, kept simple per your
explicit call.

- **Deck:** trimmed for 1v1 scale — numbers **1–7** (not the standard 0–9)
  across 4 ink colors, plus special cards: Skip, Reverse, Draw-2, Wild, Wild
  Draw-4.
- **Hand size:** 7 cards to start.
- **Turn loop:** play a card matching the discard pile's color or number, or
  play a wild card (always legal); if no legal play, draw one and play it
  immediately if now legal, otherwise turn passes. Special cards trigger
  their effect immediately.
- **Win condition:** first to empty their hand, single round — no
  cumulative scoring across rounds, no "Call Ink" callout mechanic (both
  explicitly dropped for simplicity).
- **Mode:** vs. CPU only — no pass-and-play here, since a shared-hand card
  game on one device is a meaningfully bigger UI problem than the other
  two-player games in this roster, and wasn't worth the complexity for a
  hidden mini-game.
- **CPU logic:** play any legal card (prefers dumping specials/wilds early to
  disrupt the player), draw if none legal. No lookahead needed — Uno's turn
  structure doesn't reward it the way board games do.

### 6.11 Sudoku — `/rift/grid`

The architectural odd-one-out — no opponent, no CPU, no turns. A solo logic
puzzle.

- **Puzzle source: pre-generated bank**, not runtime generation. Runtime
  Sudoku generation (building a full valid grid, then removing cells while
  continuously verifying a still-unique solution) is real constraint-solving
  code — the heaviest possible backend logic in the whole arcade, for
  arguably the simplest-looking game. A static bank generated once, offline,
  by any existing Sudoku tool avoids that entirely and matches how every
  other "generate vs. precompute" decision in this plan was made.
- **Difficulty:** split into tiers within the bank (easy/medium/hard).
- **On load:** starts at a random puzzle from the default/chosen difficulty;
  player can request a different puzzle from the same bank at any point —
  not locked into one attempt.
- **Input:** both a tap-to-select-cell + number palette, and direct keyboard
  entry.
- **Validation:** no live mistake-highlighting — checked only when the
  player submits/completes the grid.
- **Visual:** brush-stroke ink digits instead of typed numerals, consistent
  with the rest of the roster.

---

## 7. What's still genuinely open

1. Any per-game visual details not yet specified here (e.g. exact wind-icon
   escalation stages for Rimaya, exact procedural background rendering
   approach for the Ink-Stroke Toy) — these are implementation-level detail
   that the Antigravity plan file will need to pin down more precisely, but
   don't require another decision from you first (see §8 on how those get
   surfaced to you when the time comes).

All 11 hiding spots are now resolved (see §3) — nothing left unplaced.

---

## 8. Standing convention: mid-execution decisions

Every Antigravity plan file produced from here on — including the per-game
plans still to be written — must flag any remaining implementation-level
micro-decision as an explicit inline instruction telling Antigravity to
**pause and ask you** before proceeding, rather than guessing or having me
decide unilaterally on your behalf. Each such instruction must include 2–3
concrete options with a genuine argument for and against each, so you can
make an informed call in the moment rather than being handed a vague open
question. This applies to genuine implementation detail (exact numeric
tuning, animation timing, specific asset choices) — not to anything already
locked in this document, which Antigravity should treat as settled.

Once you've marked this up, say the word and the Antigravity-ready diff plan
gets generated from whatever's confirmed here.
