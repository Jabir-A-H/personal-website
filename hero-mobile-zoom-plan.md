# Hero Section — Mobile Stacked Layout + Face Zoom (Combined Plan)

**Repo:** Jabir-A-H/personal-website
**Branch:** `hero` (already contains the Phase 0 containment/position fix — see Section 0)
**Target file:** `app/page.tsx`, the hero `<FadeIn>` block only (currently lines 26–66)
**Out of scope:** `Shell.tsx`, `FadeIn.tsx`, `data.json`, any page other than the homepage, the image assets themselves (no re-crop, no new files), the `srcSet`/`sizes` values, the constrained-content sections below the hero (Education/Experience/Credentials/Footer).

This plan replaces the entire hero `<FadeIn>...</FadeIn>` block in one pass — do not apply it as an incremental diff on top of the current single-image structure, since the layout itself is changing shape (single overlay → split name/photo/content). Treat this as one atomic replacement.

---

## 0. Current state (already live on `hero` branch — context only, no action needed)

```tsx
<FadeIn className="relative w-full mb-16 md:mb-24 min-h-[max(70vh,560px)] flex flex-col justify-center pt-16 md:pt-24 pb-24 md:pb-32 mt-[-3rem] md:mt-[-6rem]">
  <div className="absolute inset-0 z-0 pointer-events-none">
    <img 
      src="/images/hero-bg.webp" 
      srcSet="/images/hero-bg-640w.webp 640w, /images/hero-bg-1024w.webp 1024w, /images/hero-bg-1920w.webp 1920w"
      sizes="100vw"
      alt=""
      aria-hidden="true"
      className="w-full h-full object-cover object-[78%_30%] md:object-[78%_32%] opacity-90"
      fetchPriority="high"
    />
    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fafafa] via-[#fafafa]/80 to-transparent"></div>
    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/80 to-transparent"></div>
    <div className="absolute inset-y-0 left-0 w-full md:w-2/3 bg-gradient-to-r from-[#fafafa] via-[#fafafa]/90 to-transparent"></div>
    <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#fafafa] to-transparent"></div>
  </div>
  <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
    <div className="max-w-3xl">
      <AnimatedHeading className="text-[clamp(3rem,11vw,8rem)] leading-[0.85] font-sans font-bold tracking-tighter text-neutral-900 uppercase mb-8">
        {personal.name.split(' ').slice(0, 2).join(' ')}<br/>{personal.name.split(' ').slice(2).join(' ')}
      </AnimatedHeading>
      <p className="text-2xl md:text-4xl font-serif italic text-neutral-800 leading-snug mb-8 max-w-2xl drop-shadow-sm">
        {personal.headline}
      </p>
      <div className="font-mono text-xs uppercase tracking-widest text-neutral-600 space-y-1 mb-8">
        <p>{personal.location}</p>
        <p>{personal.email}</p>
      </div>
      <p className="text-lg text-neutral-700 max-w-xl leading-relaxed font-medium">
        {personal.bio}
      </p>
    </div>
  </div>
</FadeIn>
```

Confirmed working: photo stays contained to the hero, doesn't bleed into other sections, face stays in frame at all tested viewport shapes. **Confirmed still broken:** on mobile, the single-column overlay means the bio paragraph text visually collides with the photo (jersey text bleeding through behind body copy), and on typical non-maximized desktop windows the subject reads too small (explained in Section 2). Both are addressed below.

---

## 1. What's changing and why

Two independent problems, being fixed together since they touch the same block:

**A. Mobile layout collision.** A single full-bleed photo overlay assumes horizontal room for text and image to share space side-by-side. Mobile has no such room, so text stacks straight down *through* the photo. Fix: restructure into three stacked pieces — name, then photo (with a slight overlap for visual continuity), then content — so nothing sits on top of the image on mobile. Desktop keeps the current full-bleed overlay unchanged.

**B. Subject reads too small on wide/short viewports.** This is a distinct issue from the crop-position problem already fixed in Phase 0.

> **Why `object-position` alone can't fix this:** `object-fit: cover` scales the image to fill whichever box dimension is proportionally tighter. When the box is *wider relative to its height* than the 4:3 source photo (true of most non-maximized desktop/laptop windows — see the reference screenshot from this conversation), the image is scaled to match the box's **width**, which means **the image's full horizontal extent is always shown, uncropped** — there is no horizontal overflow for `object-position` to hide. Since the subject occupies roughly the right 20–25% of the photo's width, he'll read small on any box in this aspect regime no matter how `object-position` is tuned. Position controls *which slice* is visible; it cannot make the subject *larger* relative to the frame. Only actual zoom (`transform: scale`) can do that.
>
> The opposite regime — box *narrower relative to height* than the image (true of the new mobile photo block below, and of portrait phones generally) — behaves oppositely: full image **height** is shown, sides get cropped, and since the subject's vertical extent is a large fraction of the photo's height, he already reads reasonably prominent there without help. This is why the zoom fix below is weighted much more heavily toward desktop (`md:`) than mobile.

Fix: add `scale-*` + a matching `origin-[x%_y%]` (same coordinates as `object-position`) to the image. Matching the origin to the position anchor is required — without it, scaling zooms from the image's center, which pushes the subject *further* off-frame instead of closer. With it, scaling only crops further into the surrounding environment while keeping the subject's position fixed, which is exactly the desired effect.

**Decided defaults** (resolving the two open questions from the earlier draft plan):
- Mobile photo-block height: **`h-[50vh]`** — enough room for the face to read as a focal point without eating too much of the fold.
- Name/photo overlap: **`-mt-6`** — a subtle overlap so the composition reads as intentional rather than colliding, without repeating the "text over photo" problem this plan is fixing.
- Zoom: **`scale-105`** mobile / **`scale-125`** desktop (`md:`) — light touch on mobile (already reasonably framed by the aspect regime above), meaningfully more on desktop (structurally needs it per the math above). `1.25` is a conservative ceiling before upscaling softness becomes noticeable given the existing `srcset` steps top out at `1920w`.

---

## 2. Full target code (replace the entire hero `<FadeIn>` block with this)

```tsx
<FadeIn className="relative w-full mb-16 md:mb-24 flex flex-col md:min-h-[max(70vh,560px)] md:justify-center md:pt-24 md:pb-32 mt-[-3rem] md:mt-[-6rem]">
  {/* Name — always first */}
  <div className="order-1 relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-8 md:pt-0">
    <div className="max-w-3xl">
      <AnimatedHeading className="text-[clamp(3rem,11vw,8rem)] leading-[0.85] font-sans font-bold tracking-tighter text-neutral-900 uppercase mb-0 md:mb-8">
        {personal.name.split(' ').slice(0, 2).join(' ')}<br/>{personal.name.split(' ').slice(2).join(' ')}
      </AnimatedHeading>
    </div>
  </div>

  {/* Photo — stacked block with overlap on mobile, absolute full-bleed overlay on desktop */}
  <div className="order-2 relative h-[50vh] -mt-6 md:absolute md:inset-0 md:h-auto md:mt-0 z-0 pointer-events-none overflow-hidden">
    <img 
      src="/images/hero-bg.webp" 
      srcSet="/images/hero-bg-640w.webp 640w, /images/hero-bg-1024w.webp 1024w, /images/hero-bg-1920w.webp 1920w"
      sizes="100vw"
      alt=""
      aria-hidden="true"
      className="w-full h-full object-cover object-[80%_25%] origin-[80%_25%] scale-105 md:object-[78%_28%] md:origin-[78%_28%] md:scale-125 opacity-90"
      fetchPriority="high"
    />
    {/* Top fade — always visible */}
    <div className="absolute inset-x-0 top-0 h-24 md:h-32 bg-gradient-to-b from-[#fafafa] via-[#fafafa]/70 to-transparent"></div>
    {/* Bottom fade — always visible */}
    <div className="absolute inset-x-0 bottom-0 h-32 md:h-48 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/80 to-transparent"></div>
    {/* Left fade — desktop only */}
    <div className="hidden md:block absolute inset-y-0 left-0 w-full md:w-2/3 bg-gradient-to-r from-[#fafafa] via-[#fafafa]/90 to-transparent"></div>
    {/* Right fade — desktop only */}
    <div className="hidden md:block absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#fafafa] to-transparent"></div>
  </div>

  {/* Content — below photo on mobile, overlaid on desktop */}
  <div className="order-3 relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-8 md:pb-0">
    <div className="max-w-3xl md:max-w-2xl">
      <p className="text-2xl md:text-4xl font-serif italic text-neutral-800 leading-snug mb-6 md:mb-8 max-w-2xl drop-shadow-sm">
        {personal.headline}
      </p>
      <div className="font-mono text-xs uppercase tracking-widest text-neutral-600 space-y-1 mb-6 md:mb-8">
        <p>{personal.location}</p>
        <p>{personal.email}</p>
      </div>
      <p className="text-lg text-neutral-700 max-w-xl leading-relaxed font-medium">
        {personal.bio}
      </p>
    </div>
  </div>
</FadeIn>
```

### Notes for the implementing agent

- **`flex flex-col` stays on the outer `FadeIn` at all breakpoints.** On desktop the photo block becomes `md:absolute`, which removes it from flex flow entirely, so `order-1`/`order-3` end up adjacent in flow — this is correct and matches the current desktop look (name block, then content block, photo behind both as a background layer).
- **`origin-[x%_y%]` requires Tailwind's arbitrary-value support for `transform-origin`.** Confirmed available — this repo is on Tailwind v4.2.1, which supports arbitrary origin values natively. No config changes needed.
- **Do not add a `transform` utility class separately.** Tailwind's `scale-*` and `origin-*` utilities compose automatically; adding a redundant `transform` class is unnecessary in v4 (and harmless if added, but skip it for a cleaner diff).
- **The mobile photo block's `overflow-hidden`** is required — without it, the scaled/zoomed image can visually overflow the `h-[50vh]` block's edges into surrounding content.
- **`pointer-events-none` and `aria-hidden="true"`/`alt=""`** are preserved from the current code — the image remains decorative, no accessibility regression.

---

## 3. QA checklist

Everything from the original Phase 0 checklist still applies (photo doesn't bleed past hero, no horizontal scrollbar regression), plus:

**Mobile (< 768px):**
- [ ] Name renders first, cleanly, on plain background
- [ ] Photo block reads as a distinct visual band — no body text overlapping the image (this is the primary bug being fixed)
- [ ] Face is clearly visible and reasonably prominent within the photo band, not a tiny sliver
- [ ] The `-mt-6` overlap between name and photo looks intentional, not like a layout glitch
- [ ] Content block (headline, location/email, bio) renders fully readable below the photo on a plain background

**Desktop (≥ 768px):**
- [ ] Layout is visually unchanged from the current full-bleed overlay — this restructuring should be invisible at desktop widths except for the zoom
- [ ] Face reads noticeably larger/more prominent than before, especially on **non-maximized, moderately-wide browser windows** (the specific case from the reference screenshot — this is the case to prioritize checking, not just fullscreen 1920×1080)
- [ ] No part of the face or hair is clipped at the edges from the added scale
- [ ] Image doesn't look visibly soft/blurry from the upscale — check at both a typical laptop width (~1366px) and a large desktop width (~1920px)

**Both:**
- [ ] Gradient fades still blend smoothly against the new zoom level — no hard edge where photo meets fade
- [ ] Page transition / `FadeIn` animation still plays correctly on load

---

## 4. Explicitly deferred (not part of this plan)

- Re-cropping or regenerating `hero-bg*.webp` source assets
- Adding a larger `srcset` step for very large/high-DPI displays (separate concern; only worth revisiting if QA shows visible softness from the `scale-125` upscale)
- Any change to `Shell.tsx`, `FadeIn.tsx`, or other pages

## 5. Rollback

Single-file, single-block change. If QA fails, revert the `<FadeIn>` block to the Section 0 "current state" code shown above — no other files are touched by this plan.
