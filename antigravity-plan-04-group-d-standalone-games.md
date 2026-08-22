# Antigravity Plan: Group D — Standalone Games

Covers: Memory/Matching (`/rift/echo`), Ink Shed (`/rift/deck`), Sudoku
(`/rift/grid`). Requires the Foundation plan complete first. These three
share no engine code with each other or with any other group — each is
built independently.

**STANDING INSTRUCTION:** any implementation decision not resolved below
must be paused on and asked to Jabir directly, with 2–3 concrete options
and a real argument for/against each. Do not guess.

---

## 1. Memory / Matching — `/rift/echo`

**New route:** `app/rift/echo/page.tsx`

### Core types

```ts
type GridSize = 16 | 36 | 64; // 4x4, 6x6, 8x8 — 8/18/32 pairs respectively
type Mode = 'solo' | 'cpu' | 'local';
type CardShape =
  | 'mountain' | 'river' | 'sun' | 'moon' | 'star' | 'flower' | 'cloud'
  | 'rain' | 'wave' | 'leaf' | 'branch' | 'bamboo' | 'lotus' | 'pine'
  | 'wind' | 'snowflake' | 'lightning' | 'fish' | 'crane' | 'butterfly'
  | 'dragonfly' | 'reed' | 'stone' | 'bridge' | 'lantern' | 'boat'
  | 'feather' | 'vine' | 'crescent' | 'droplet' | 'ripple' | 'ember';
// exactly 32 values — covers the largest board with zero repeats
```

### Turn rule (standard genre rule, not a novel invention)

Match → same player flips again. Miss → turn passes. This is correct
specifically because every flip (hit or miss) is visible to both players
— nobody has private information, so tracking misses benefits whoever's
turn comes next regardless of who caused the miss.

### CPU memory model

**ASK JABIR — exact "defect chance" rate for Hard mode:** the locked
design calls for "perfect recall as a baseline, with a small periodic
defect chance" so Hard stays tough but beatable even on the 8×8 board, but
no specific probability was set during planning. Options:
- *Option A:* a flat ~10% chance per CPU turn that it "forgets" one
  previously-seen card at random and flips a wrong guess instead of its
  known-correct pair — simple to implement, easy to tune later by changing
  one number.
- *Option B:* defect chance scales inversely with how few cards remain
  face-down (CPU gets *more* fallible as the board empties out) — more
  interesting dynamically, but a more complex rule to implement and reason
  about, and harder to predict how it "feels" without playtesting.

Easy/Medium tiers (higher, more frequent forgetting) should scale down
from whatever base rate is chosen for Hard, not be designed independently.

### Card back rendering

Shodo mark from `Logo.tsx`, reused directly (not redrawn) as the face-down
card back for every game mode.

### Scoring

- **Solo:** time-to-clear, lower is better — `setHighScoreIfBetter(...,
  time, false)` (note the `higherIsBetter: false` parameter, per the
  Foundation plan's warning about getting this backwards).
- **CPU/local:** pairs claimed per side — track and display, but this
  mode's "win" is just whoever has more pairs when the board clears, no
  separate localStorage high-score needed beyond an optional win/loss
  tally if you want one (not specified as required during planning).

---

## 2. Ink Shed — `/rift/deck`

**New route:** `app/rift/deck/page.tsx`

### Core types

```ts
type CardColor = 'sumi' | 'vermillion' | 'indigo' | 'ochre'; // 4 ink colors
type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7
  | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wildDraw4';
type Card = { color: CardColor | 'none'; value: CardValue };
```

Deck: numbers 1–7 across the 4 colors, plus the standard special-card set
(Skip, Reverse, Draw-2 per color, plus color-neutral Wild and Wild
Draw-4). No "Call Ink" mechanic, no multi-round scoring — first to empty
hand wins, single round, per the locked simplifications.

### Turn loop

Play a card matching the discard pile's color or value, or any wild
(always legal). No legal play → draw one card, play immediately if it's
now legal, otherwise pass. Special cards resolve their effect immediately
on play (Skip/Reverse/Draw-2 target the next player in turn order — note
turn order in a strict 1v1 game means Skip and Reverse both effectively
just... skip the CPU's next turn, since there's no third player to
redirect to. Confirm this doesn't make Reverse a functionally dead card in
a 2-player game before implementing it as a distinct effect from Skip).

**ASK JABIR — Reverse in a 2-player game:** in a 2-player match, Reverse
and Skip produce an identical practical effect (the other player's turn is
skipped) — there's no third player for "reverse direction" to meaningfully
redirect toward. Options:
- *Option A:* implement Reverse as functionally identical to Skip in this
  2-player context (technically correct to the source game's rules, but
  the card becomes redundant flavor rather than distinct strategy).
- *Option B:* drop Reverse from the deck entirely for this trimmed 1v1
  version, since it has no real function here, and replace its card count
  with additional Skip or Draw-2 cards to keep deck size consistent.
- *Option C:* keep Reverse in the deck for authenticity/familiarity (most
  players recognize the card) even though it does nothing different from
  Skip here — purely a "this deck looks and feels like Uno" argument.

### CPU logic

Play any legal card, preferring to dump specials/wilds early to disrupt
the player. Draw if no legal play exists. No lookahead/strategy depth
needed — this genre's turn structure doesn't reward it.

### Mode

vs. CPU only — no local two-player (explicitly dropped during planning,
since a shared-hand card game on one device is a meaningfully bigger UI
problem than any other two-player game in this roster, not worth the
complexity for a hidden mini-game).

---

## 3. Sudoku — `/rift/grid`

**New route:** `app/rift/grid/page.tsx`

### Puzzle source: pre-generated bank, not runtime generation

**New file:** `data/sudoku-puzzles.json` (or similar — exact location is
an open call, see below)

```ts
type SudokuPuzzle = {
  difficulty: 'easy' | 'medium' | 'hard';
  clues: (number | null)[][]; // 9x9, null = empty cell
  solution: number[][];        // 9x9, the unique correct solution
};
```

**ASK JABIR — where the puzzle bank actually comes from:** this plan
assumes a static bank exists, but generating it wasn't specified during
planning — someone (or something) needs to actually produce 9×9 puzzles
with verified-unique solutions at each difficulty tier before this game
can ship. Options:
- *Option A:* Antigravity generates the bank itself as a one-time script
  (write a generator+solver, run it once locally, commit the resulting
  JSON, then discard the generator script — the generator never ships to
  production, only its output does).
  - *Argument for:* no external dependency, full control over difficulty
    tuning.
  - *Argument against:* writing a correct constraint-solving generator is
    real, non-trivial work — precisely the kind of "heaviest backend
    logic in the whole arcade for the simplest-looking game" flagged
    during planning. This is a meaningful time investment even though it
    never appears in the shipped bundle.
- *Option B:* use an existing open-source Sudoku puzzle dataset (several
  exist with permissive licenses, containing thousands of pre-verified
  puzzles with difficulty ratings) and select/format a subset into the
  needed JSON shape.
  - *Argument for:* skips writing solver/generator code entirely, faster
    to ship, puzzles are already verified-unique by whoever built the
    source dataset.
  - *Argument against:* introduces a dependency on an external dataset's
    licensing terms and quality/accuracy, and its difficulty ratings may
    not match your own sense of easy/medium/hard.

This decision blocks Sudoku's entire implementation — it should be
resolved before any other Sudoku work starts, not discovered partway
through.

### Difficulty & puzzle selection

On load: random puzzle from the default/chosen difficulty tier. Player can
request a different puzzle from the same bank at any time via a visible
control (not limited to one attempt).

### Input

Both: tap-to-select-cell + a number palette, and direct keyboard entry —
both active simultaneously, same "don't make the player choose an input
mode" principle as Falling Ink's controls in Group B.

### Validation

No live mistake-highlighting. Checked only when the player
submits/completes the grid (compares the filled grid against the stored
`solution`, not by re-deriving correctness via constraint-checking at
submit time — since the solution is already known and stored, just
compare directly).

### Visual

Brush-stroke ink digits instead of typed numerals — needs actual custom
glyph rendering for digits 1–9 in the site's ink aesthetic (not just a
stylized font, per the pattern established elsewhere in this roster of
hand-drawn-feeling marks over typography).

**ASK JABIR — brush-digit implementation approach:**
- *Option A:* a custom SVG glyph set, one path per digit, hand-designed
  once (highest quality, most upfront design work — same category of
  effort as Grid Strategy's cross/ring marks in Group A).
- *Option B:* apply the ink-bleed filter to a bold, simple typed font
  rendering of each digit (much less design work, may not read as
  convincingly "brush-stroke" as fully custom glyphs, but far cheaper).

---

## QA checklist

- [ ] `npm run build` succeeds, `tsc --noEmit` clean
- [ ] Memory/Matching: verify match→continue / miss→pass turn logic is
      correct in both CPU and local modes
- [ ] Memory/Matching: verify Hard-mode CPU defect chance actually allows
      a loss in realistic playtesting on the 8×8 board (i.e., confirm it
      isn't accidentally still unbeatable despite the defect chance)
- [ ] Memory/Matching: verify Solo mode's high score correctly treats a
      *lower* time as better (the `higherIsBetter: false` parameter)
- [ ] Ink Shed: verify special-card effects resolve correctly, especially
      whatever was decided for Reverse in a 2-player context
- [ ] Ink Shed: verify win condition (hand reaches zero cards) triggers
      correctly and immediately ends the round
- [ ] Sudoku: verify the puzzle bank actually exists and loads correctly
      before testing anything else in this game — this game cannot be
      meaningfully QA'd until the bank decision (§3, "ASK JABIR") is
      resolved and implemented
- [ ] Sudoku: verify submit-time validation correctly identifies a fully
      correct grid as solved, and correctly identifies an incorrect grid
      as not-yet-solved, with no live highlighting during entry
- [ ] Sudoku: verify both palette-tap and keyboard input methods write to
      the same underlying grid state without conflicting
