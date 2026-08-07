# Hero Background Photo — Fix & Bounded-Position Plan

**Repo:** Jabir-A-H/personal-website
**Target file:** `app/page.tsx` (single file, lines ~24–43)
**Scope:** Fix a layout containment bug + make the subject's face stay in frame across all realistic viewport shapes, without re-cropping the source image.
**Out of scope (do not touch unless explicitly asked):** `Shell.tsx`, `FadeIn.tsx`, `data.json`, image assets themselves, any other page, the srcset width steps, the gradient-fade divs' color stops.

---

## 0. Context an agent needs before editing

- Framework: Next.js, static export (`output: 'export'`, `images.unoptimized: true` in `next.config.ts`) — no server-side image optimization exists. All responsive image handling is manual (`srcSet`/`sizes` on a plain `<img>`).
- The hero photo is `public/images/hero-bg*.webp`, source aspect ratio **4:3** (1.333). Do not regenerate or recrop these files as part of this plan.
- The subject's face in the current image sits at approximately **x: 73–85%, y: 33–50%** of the frame (right-of-center, upper-middle).
- Current bug: the hero's background `<img>` sits in a `div.absolute.inset-0`, but its containing `FadeIn` wrapper has no `position: relative`. This makes it escape to the nearest positioned ancestor — `<main>` in `Shell.tsx` (`relative z-10`), which wraps the *entire* page — so the photo bleeds across the whole homepage instead of staying inside the hero. This is a regression from a prior scrollbar fix that removed a `relative` class along with an unrelated full-bleed trick it used to be bundled with.
- Root cause of "face gets cropped on some screens": `object-position` is currently `80% 90%` (anchored near the bottom), and the hero's height (`min-h-[70vh]`) has no floor in absolute pixels — on short/wide viewports (landscape phones, small laptop windows, ultrawide monitors) the box's aspect ratio can become extreme enough that the top of the image, including the face, gets cropped out of the visible window.

## 1. Goal

Without modifying the image asset:
1. Fix the containment bug so the photo is scoped to the hero section only.
2. Bound the hero box's possible aspect-ratio range so a worst-case `object-position` can be computed and guaranteed to keep the face visible, rather than tuned by eyeballing.
3. Apply that computed `object-position`, with one responsive breakpoint override as a safety margin.

## 2. The math (why these specific numbers)

`object-fit: cover` crops the image so it fully fills the box; `object-position` sets the anchor point that's protected from cropping. The danger case is a **short, wide** box — the taller relative to width the risk drops, the shorter relative to width the risk rises.

Currently `min-h-[70vh]` has no floor in pixels, so on a very short viewport (e.g. a landscape phone at 375px tall, giving 70vh ≈ 262px, against a width that could be 700–800px in landscape) the box can become extremely flat, which is when the top of the frame (where the face is) gets cropped hardest.

**Fix:** give the hero a pixel floor so height can never collapse below a known minimum, which puts a calculable ceiling on how extreme the width:height ratio can get:

```
min-h-[max(70vh,560px)]
```

Worst realistic case: a very wide viewport (e.g. 2560px ultrawide) with a browser window short enough to still only clear the 560px floor → aspect ratio ≈ `2560:560` ≈ **4.57:1**.

Running the `object-fit: cover` crop math for a 4:3 (1024×768-equivalent) image against a 4.57:1 box:
- Image must scale so height covers the box; width overflows and gets cropped.
- At `object-position-y = 30%`, the visible vertical window sits high enough in the frame that the face (at y ≈ 33–50%) stays inside it even at this extreme ratio, with margin to spare.
- At `object-position-x = 78%`, the visible horizontal window (after the vertical-driven scale) still contains the face's x ≈ 73–85% range across all box widths tested (375px through 2560px).

**Result: `object-[78%_30%]`** is the base value, safe down to the 4.57:1 worst case. A `md:` breakpoint override (`78%_32%`) is added purely as a fine-tuning safety margin for mid-size layouts, not because the base value is unsafe there — this can be dropped if testing shows it's unnecessary.

## 3. Implementation

### Task 1 — Fix containment bug (do this first, verify independently)

**File:** `app/page.tsx`, line 26

Before:
```tsx
<FadeIn className="w-full mb-16 md:mb-24 min-h-[70vh] flex flex-col justify-center pt-16 md:pt-24 pb-24 md:pb-32 mt-[-3rem] md:mt-[-6rem]">
```

After:
```tsx
<FadeIn className="relative w-full mb-16 md:mb-24 min-h-[max(70vh,560px)] flex flex-col justify-center pt-16 md:pt-24 pb-24 md:pb-32 mt-[-3rem] md:mt-[-6rem]">
```

Changes in this one line:
- Added `relative` — fixes the containment bug (Section 0).
- Changed `min-h-[70vh]` → `min-h-[max(70vh,560px)]` — adds the pixel floor the math in Section 2 depends on.

Do **not** change `mt-[-3rem] md:mt-[-6rem]` — that's an unrelated negative-margin trick for pulling the hero up under the nav, and adding `relative` does not interfere with it (negative margins affect layout flow position, not containing-block resolution for absolutely positioned children).

### Task 2 — Update the object-position

**File:** `app/page.tsx`, line 35

Before:
```tsx
className="w-full h-full object-cover object-[80%_90%] opacity-90"
```

After:
```tsx
className="w-full h-full object-cover object-[78%_30%] md:object-[78%_32%] opacity-90"
```

### Task 3 — Sanity-check the gradient fades (verify only, likely no change needed)

**File:** `app/page.tsx`, lines 39–42 — the four fade `<div>`s (top/bottom/left/right).

These were tuned against the old `80%_90%` anchor. Since the new anchor (`78%_30%`) keeps the subject in a similar relative screen position (right-of-center, just higher up in-frame), the existing fade widths (`md:w-2/3` on the left fade, `w-16 md:w-32` on the right) should still read correctly. **No code change expected here** — this is a visual-verification-only step during QA (Section 4). Only touch these divs if QA reveals the face now sits too close to the top fade or the left fade cuts across it.

## 4. QA checklist (manual, post-implementation)

Check the hero at minimum these viewport shapes (browser dev tools device toolbar, or physical devices):

| Viewport | Approx size | What to verify |
|---|---|---|
| Mobile portrait | 375×812 | Full photo visible, no bleed past hero into sections below |
| Mobile landscape | 812×375 | Face fully visible, not cropped by top fade |
| Tablet | 768×1024 | Face visible, composition looks intentional |
| Laptop | 1366×768 | Face visible — this is a known-risky shape |
| Desktop | 1920×1080 | Face visible, photo doesn't look overly zoomed |
| Ultrawide | 2560×1080 (or resize browser to simulate) | Face visible — worst-case shape from Section 2 |
| Resize test | Drag browser window to be very short + very wide | Face stays in frame down to ~560px height floor |

Also confirm, once for any viewport:
- [ ] Scrolling past the hero shows the photo ends cleanly at the hero boundary — no photo visible behind Education/Experience/Credentials/Footer sections (this is the regression test for the containment bug).
- [ ] No new horizontal scrollbar reappears (this hero was previously touched by a scrollbar fix — confirm this change doesn't reintroduce it).
- [ ] Hero content (name, headline, bio) still renders above the photo with `z-10`, unaffected.

## 5. Explicitly deferred (not part of this plan)

- Re-cropping or regenerating `hero-bg*.webp` assets.
- Adding a larger `srcset` step (e.g. 2560w) for very large displays — separate concern, unrelated to the positioning bug.
- Any change to `Shell.tsx`'s `<main>` positioning — the fix is scoped to the hero's own container per Task 1, not by removing `relative` from `<main>` (which likely serves other purposes across the site and shouldn't be touched for this).

## 6. Rollback

Single-file, single-section change. If QA fails, revert lines 26 and 35 in `app/page.tsx` to the "Before" blocks shown above — no other files are touched by this plan.
