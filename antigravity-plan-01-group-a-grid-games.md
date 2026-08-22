# Antigravity Plan: Group A — Grid Win-Check Games

Covers: Grid Strategy (`/rift/stones`), Connect-4 (`/rift/column`), Claim the
Scroll (`/rift/seal`). Requires the Foundation plan to be complete first.

**STANDING INSTRUCTION:** any implementation decision not resolved below
must be paused on and asked to Jabir directly, with 2–3 concrete options and
a real argument for/against each. Do not guess.

---

## 1. Shared win-check engine

**File:** `lib/games/lineWinCheck.ts`

```ts
export type Cell = 0 | 1 | 2; // 0 = empty, 1 = player one, 2 = player two

export function checkLineWin(
  board: Cell[][],
  lastRow: number,
  lastCol: number,
  winLength: number
): { won: boolean; player: Cell; line: [number, number][] } {
  const player = board[lastRow][lastCol];
  if (player === 0) return { won: false, player: 0, line: [] };

  const directions: [number, number][] = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal down-right
    [1, -1],  // diagonal down-left
  ];

  for (const [dr, dc] of directions) {
    const line: [number, number][] = [[lastRow, lastCol]];
    for (const sign of [1, -1]) {
      let r = lastRow + dr * sign;
      let c = lastCol + dc * sign;
      while (
        r >= 0 && r < board.length &&
        c >= 0 && c < board[0].length &&
        board[r][c] === player
      ) {
        if (sign === 1) line.push([r, c]);
        else line.unshift([r, c]);
        r += dr * sign;
        c += dc * sign;
      }
    }
    if (line.length >= winLength) {
      return { won: true, player, line: line.slice(0, winLength) };
    }
  }
  return { won: false, player: 0, line: [] };
}
```

This single function serves Grid Strategy (any board size/win-length) and
Connect-4 (7×6/win-4) unchanged. Claim the Scroll does **not** use this
function — its win condition is shape-completion, not line-formation — see
§4.

---

## 2. Grid Strategy — `/rift/stones`

**New route:** `app/rift/stones/page.tsx`

### State & types

```ts
type BoardSize = 3 | 9 | 15;
type Mark = 'cross' | 'ring';
type GameMode = 'cpu' | 'local';
type Difficulty = 'easy' | 'medium' | 'hard';
```

### CPU logic

- **Easy:** pick a random empty cell; if the player has a line one move
  from completion, block it.
- **Medium:** as Easy, plus: if the CPU itself has a line one move from
  completion, take the win instead of blocking; otherwise prefer cells
  adjacent to existing marks (center/near-existing heuristic).
- **Hard, 3×3 board only:** full minimax with alpha-beta pruning —
  computationally trivial at this size, genuinely unbeatable.
- **Hard, 9×9/15×15 boards:** minimax is not computationally realistic at
  these sizes. Use Medium's logic plus a 2-ply lookahead specifically for
  blocking/creating open-ended two-in-a-rows (a common, well-documented
  Gomoku heuristic — not a novel algorithm to invent from scratch).

**Trap:** do not attempt full minimax on the 9×9 or 15×15 boards "to see
how far it gets" — the branching factor makes this either freeze the
browser tab or require a Web Worker with a hard time-cutoff, neither of
which was scoped or asked for. Stay with the heuristic approach as written.

### Marks rendering

Ink brush cross and ink brush ring — reuse the `ink-bleed` SVG filter from
`components/Logo.tsx` (`feTurbulence`/`feDisplacementMap`, `scale="4.5"`)
rather than defining a new filter. Apply the two-party color convention
from the Foundation plan (`--color-ink-primary` / `--color-ink-secondary`).

**ASK JABIR — mark geometry:** the cross and ring need actual brush-stroke
path data, not simple geometric shapes (a plain circle/X would look
inconsistent with the rest of the site's hand-drawn aesthetic). Options:
- *Option A:* commission/hand-draw SVG path data once per mark (matches
  `Logo.tsx`'s approach exactly — bezier paths with the ink-bleed filter
  applied), highest visual consistency, most upfront effort.
- *Option B:* procedurally vary a simple base shape with slight random
  rotation/scale per placement (cheaper to build, looks less "hand-drawn"
  but still reads as brushy once the ink-bleed filter is applied).

---

## 3. Connect-4 — `/rift/column`

**New route:** `app/rift/column/page.tsx`

### State & types

```ts
type Column = Cell[]; // bottom-to-top, length 6
type Board = Column[]; // length 7
```

Uses `checkLineWin` from §1 with `winLength = 4`, called after computing
which row a dropped piece lands in (first empty slot from the bottom of
its column).

### Drop animation

Liquid free-fall (slight vertical stretch proportional to fall distance)
then a squash-and-settle "jelly" bounce on landing — no flattening, no
dissolving. Recommended approach: CSS `transform: scaleY()` keyframes
driven by the `motion` package (already a project dependency), animating
from a stretched falling state to an overshoot-then-settle squash, rather
than hand-rolled physics — `motion`'s spring transition type is a
reasonable fit for the "jelly settle" specifically.

**ASK JABIR — exact timing:**
- *Option A:* fast drop (~300–400ms fall, ~150ms settle) — snappier,
  matches a casual mobile-game pace.
- *Option B:* slower, more deliberate drop (~600–800ms fall, ~250ms
  settle) — more weight to each move, closer to the "liquid ink" framing,
  but slows down repeated play.

### CPU difficulty

Same three-tier structure as Grid Strategy, but **Hard here is a genuine,
realistic minimax** (7×6 board with alpha-beta pruning is computationally
fine, unlike Grid Strategy's larger boards) — truly unbeatable at Hard,
worth confirming this difference is communicated somewhere in the UI (a
tooltip or label) so players aren't confused why Connect-4's Hard feels
categorically tougher than Grid Strategy's Hard on the larger boards.

### Blob rendering

One uniform blob shape reused for every drop (no per-drop randomization,
per the locked design — keeps the board readable). Ink-bleed filter
reused from `Logo.tsx`. Colors: sepia/black (light/dark mode respectively)
for player one, vermillion for player two — pulled from the Foundation
plan's tokens, not redefined here.

---

## 4. Claim the Scroll — `/rift/seal`

**New route:** `app/rift/seal/page.tsx`

This game does **not** use `lineWinCheck.ts` — its logic is
shape-completion on a dot grid, not line-formation. Separate module:

**New file:** `lib/games/shapeClaimEngine.ts`

### Core data model

```ts
type GridShape = 'square' | 'triangle';
type Edge = { from: [number, number]; to: [number, number]; owner: Cell };
type ClaimedShape = { cells: [number, number][]; owner: Cell };
```

### Algorithm outline

1. Represent the dot grid as a graph — nodes are dots, edges are the
   possible lines between adjacent dots (differs by `GridShape`: square
   grids connect orthogonal neighbors only; triangle grids additionally
   connect diagonal neighbors within each triangular cell).
2. On a drawn edge, check every shape (square or triangle) that edge could
   complete — mark `owner` on any shape where all its edges are now drawn.
3. A single edge can complete two shapes at once where the grid geometry
   allows it (a shared edge between two adjacent shapes) — award both to
   the same player, and both grant the extra-turn rule.
4. If any shape was claimed this turn, the same player goes again;
   otherwise turn passes.

**ASK JABIR — triangle-grid edge definition:** the exact adjacency rule
for which diagonals count as valid lines in triangle mode is a real design
decision, not just an implementation detail, since it changes how many
legal moves exist per turn. Options:
- *Option A:* every dot connects to its 6 hexagonal-lattice neighbors
  (matches the cardgames.io Triangles reference most closely).
- *Option B:* a simpler square-lattice-plus-one-diagonal-per-cell pattern
  (easier to implement and reason about, slightly different game feel,
  less faithful to the reference).

### CPU logic (single difficulty tier, per the locked design)

Standard "avoid handing the opponent a free shape" heuristic: never draw
an edge that completes a shape's second-to-last side unless no other legal
move exists, prefer edges that don't set up a future free capture for the
opponent. This is well-documented Dots-and-Boxes strategy, not something
to invent from scratch — implement the "avoid the third side" rule as the
core heuristic and nothing more elaborate.

### Shape picker & grid sizes

`square` or `triangle` mode, `4×4`/`6×6`/`8×8` dot grid sizes — both
chosen at game start via a simple pre-game menu, consistent with how Grid
Strategy and Connect-4 present their pre-game options.

---

## Shared visual notes across all three games in this group

- Claimed shapes / marks fill with the two-party ink color convention
  (§3 of the Foundation plan) — do not introduce a different color scheme
  for any one of these three games.
- All three respect `useGameTheme()` from the Foundation plan.
- All three use `getHighScore`/`setHighScoreIfBetter` with
  `higherIsBetter = true` in every mode these games have (win-count based
  scoring, not time-based) — no special case needed here unlike some
  Group D games.

---

## QA checklist

- [ ] `lineWinCheck` unit-testable in isolation: confirm correct detection
      of horizontal, vertical, and both diagonal wins at both win-length-3
      and win-length-5 configurations, and confirm it returns `won: false`
      correctly on a full board with no winner
- [ ] Grid Strategy: verify Hard mode is provably unbeatable on 3×3 (play
      it out, or verify via exhaustive game-tree reasoning) and verify the
      9×9/15×15 Hard heuristic doesn't freeze the browser on a large board
- [ ] Connect-4: verify gravity-drop lands in the correct row every time,
      including edge cases (dropping into an already-full column should be
      rejected as an illegal move, not silently overflow)
- [ ] Connect-4: verify Hard mode's minimax completes each move within an
      acceptable time budget (should be near-instant at this board size —
      if it's not, something is wrong with the alpha-beta implementation)
- [ ] Claim the Scroll: verify a single edge can correctly claim two
      shapes at once where the grid geometry allows it, and that the extra
      turn rule fires correctly in that case
- [ ] Claim the Scroll: verify both square and triangle modes at all three
      grid sizes produce a fully legal, playable game with no orphaned
      dots/edges
- [ ] All three: confirm high scores persist correctly per-game (distinct
      `localStorage` keys, no cross-contamination between the three games)
- [ ] All three: confirm the ink-bleed filter renders correctly across
      both light and dark in-game themes without visual artifacts
