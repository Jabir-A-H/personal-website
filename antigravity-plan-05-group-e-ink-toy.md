# Antigravity Plan: Group E — Ink-Stroke Toy

Covers: Ink-Stroke Toy (`/rift/wash`). Requires the Foundation plan
complete first. Not a competitive game — a drawing canvas. Despite being
the "simplest" idea in the original roster, this ended up the most
feature-dense single build in the whole arcade (background picker, bounds
toggle, 4-way export combination, color picker, tool switcher, theme
toggle) — budget accordingly, don't treat it as a quick build just because
it has no win condition.

**STANDING INSTRUCTION:** any implementation decision not resolved below
must be paused on and asked to Jabir directly, with 2–3 concrete options
and a real argument for/against each. Do not guess.

---

## 1. Two distinct ink layers

This is the core architectural decision for the whole game — get this
separation right first, everything else builds on it.

```ts
type StrokePoint = { x: number; y: number; pressure: number; timestamp: number };
type PermanentStroke = { id: string; points: StrokePoint[]; color: string; tool: 'ink' | 'wash' };
type AmbientTrailPoint = { x: number; y: number; timestamp: number }; // never saved
```

- **Ambient hover trail** (desktop only, no click held): rendered on a
  separate canvas layer (or separate SVG group) from the permanent artwork
  — full-strength color, fades out 2–4 seconds after each point is laid
  down, purely decorative. This layer is **excluded entirely** from any
  export.
- **Permanent draw layer** (click/touch-drag): the actual artwork. Brush
  width varies with pointer movement speed (slower = thicker/wetter,
  faster = thinner/drier). Does not fade on its own, ever.

**Trap:** do not implement these as the same underlying stroke type with
an `ephemeral: boolean` flag — keep them as genuinely separate rendering
layers/canvases. Mixing them into one data structure risks a bug where a
hover-trail point accidentally gets included in a save/export, which would
directly violate the locked "ambient trail never appears in any export"
rule.

---

## 2. Wash/eraser tool

Toggleable brush mode — instead of adding ink, removes it along the
dragged path. Same permanence as drawing (does not fade), since erasing is
a deliberate edit, not part of the ambient decay system. Implementation:
either a destination-out compositing operation (if using Canvas 2D) or a
mask/clip-path approach (if using SVG strokes) — the exact technical
approach depends on which rendering technology is chosen (see §5).

---

## 3. Undo/redo

Every stroke or erase action is one discrete history entry, in order.

```ts
type HistoryEntry = { type: 'stroke' | 'erase'; data: PermanentStroke };
type History = { entries: HistoryEntry[]; currentIndex: number };
```

Standard undo/redo stack — undo decrements `currentIndex` and hides
everything after it, redo increments and reveals the next entry, drawing a
new stroke after undoing truncates any "redo-able" future entries (the
standard behavior any text editor uses, nothing novel needed here).

---

## 4. Canvas bounds — viewer-toggleable

Both bordered "paper" rectangle and full-viewport modes must be
implemented and switchable at runtime, per the locked decision (this was
explicitly resolved as "make both options" rather than picked once).

**ASK JABIR — does switching bounds mid-drawing preserve or clear the
current artwork?** This wasn't specified during planning.
- *Option A:* preserve the artwork and simply resize/reflow the canvas
  viewport around it — more forgiving, but coordinates need careful
  rescaling so strokes don't distort.
- *Option B:* switching bounds prompts a confirmation and clears the
  canvas — simpler to implement correctly, but destructive and possibly
  surprising if triggered accidentally.

---

## 5. Backgrounds — procedural only, no photos

Five options, no image assets: mountain (layered ridge silhouettes), river
(flowing wave lines), nature/forest silhouette, cityscape (blocky skyline
silhouette), and plain in three paper shades (white, cream/aged, soft
gray-wash).

**ASK JABIR — rendering technology for the whole game (this decision
affects everything above, not just backgrounds):**
- *Option A:* HTML5 Canvas 2D — better performance for freehand drawing
  with many points, easier pixel-level export (PNG is native), but SVG
  export requires either re-tracing strokes into SVG path data after the
  fact or maintaining a parallel vector representation alongside the
  canvas.
- *Option B:* SVG strokes directly (each stroke as an SVG `<path>`) — SVG
  export is trivial (it already is one), but PNG export requires
  rasterizing the SVG (a real but well-solved problem, e.g. via an
  off-screen canvas draw of the SVG), and very long/complex drawings with
  many strokes can have more DOM-node overhead than a single canvas
  bitmap.

Since the locked spec requires **both** PNG and SVG export, this choice
has real consequences either way — there's no option that makes both
exports "free." Recommend resolving this before writing a single line of
the drawing logic, since it shapes the entire component's architecture.

The procedural backgrounds themselves (ridges, waves, forest silhouette,
skyline) are simple geometric/path shapes either way — a handful of
overlapping curves or polygons, not complex generative art, so this
particular piece of work is roughly equal effort under either rendering
approach.

---

## 6. Export

Both PNG and SVG, each with a transparent-background toggle (artwork only)
vs. normal (artwork + selected background baked in) — 4 total export
combinations. The ambient hover trail is never included, per §1.

**Trap:** "transparent" export must actually produce a transparent PNG
(not a white or black background standing in for transparency) — verify
this specifically, since it's an easy thing to get subtly wrong depending
on how the canvas/SVG is rasterized.

---

## 7. Ink color picker

A straightforward color picker feeding the stroke's fill color. Low
complexity relative to everything else in this game — no open decisions
here, just confirm it's wired to affect new strokes going forward, not
retroactively recolor already-drawn strokes.

---

## 8. Theme

Respects the site's dark/light state on load via `useGameTheme()` from the
Foundation plan, plus its own in-page toggle button, consistent with every
other game in the roster.

---

## QA checklist

- [ ] `npm run build` succeeds, `tsc --noEmit` clean
- [ ] Confirm the ambient hover trail never appears in any of the 4
      export combinations — test this explicitly, don't just assume the
      layer separation holds
- [ ] Confirm undo/redo correctly handles both stroke and erase actions,
      including truncating redo history after a new stroke is drawn post-undo
- [ ] Confirm brush width genuinely varies with pointer speed (slow vs.
      fast strokes should look visibly different)
- [ ] Confirm the wash/eraser tool permanently removes ink (survives a
      subsequent export, doesn't just visually hide it)
- [ ] Confirm all 5 backgrounds render correctly in both canvas-bounds
      modes (bordered paper and full-viewport)
- [ ] Confirm all 4 export combinations (PNG/SVG × transparent/normal)
      produce correct, expected output files
- [ ] Confirm switching canvas bounds mid-drawing behaves per whichever
      option was chosen in §4
- [ ] Confirm the game respects site theme on load and its own toggle
      works independently afterward
