# Website Redesign — Walkthrough

**Build Status:** ✅ All 7 pages generated, zero errors

---

## What Changed

### New Files (5)
| File | Purpose |
|---|---|
| [lib/theme.ts](file:///f:/WebDev/personal-website/lib/theme.ts) | Centralized theme config — page colors, animation presets, accent constants |
| [components/AvatarPlaceholder.tsx](file:///f:/WebDev/personal-website/components/AvatarPlaceholder.tsx) | Geometric avatar with "JAH" initials in warm gradient |
| [components/JsonLd.tsx](file:///f:/WebDev/personal-website/components/JsonLd.tsx) | JSON-LD Person schema for SEO |
| [public/robots.txt](file:///f:/WebDev/personal-website/public/robots.txt) + [sitemap.xml](file:///f:/WebDev/personal-website/public/sitemap.xml) | Search engine fundamentals |
| [public/favicon.svg](file:///f:/WebDev/personal-website/public/favicon.svg) + og-image.png | Warm "J" favicon + social sharing card |

### Modified Files (13)

#### Foundation
- **globals.css** — Was just `@import "tailwindcss"`. Now has: warm solaris `@theme` colors, custom scrollbar, selection colors, smooth scroll, `prefers-reduced-motion` support
- **Shell.tsx** — Fixed `any` type → proper `AnimationProps`. Imports from `lib/theme.ts`. Added reduced-motion support. Removed hardcoded theme values
- **Navigation.tsx** — Active underline + focus rings now use warm accent color
- **layout.tsx** — Added OpenGraph, Twitter card, JSON-LD, `metadataBase`, title template

#### Home Page
- **page.tsx** — Education promoted above Experience. Only shows University of Dhaka (current) with "Full academic timeline →" link. Avatar placeholder added. Skill dots use accent color. "Explore more" footer links to /projects and /whispers. Education duplication with /education removed.

#### Sub-Pages
- **projects/page.tsx** — All emerald accents → warm solaris. Corner dots, status badges, hover states, Launch button all use accent
- **whispers/page.tsx** — Timeline dots glow accent on hover. Tags get accent hover
- **contact/page.tsx** — Arrow circles turn accent on hover. Focus rings use accent
- **education/page.tsx** — Divider line, link hovers use accent. Title uses template
- **TimelineCard.tsx** — Timeline dots → accent on hover
- **not-found.tsx** — Button uses accent color
- **global-error.tsx** — Replaced inline styles with proper site-matching design

---

## The Warm Solaris Color System

```
--color-accent:       #e8915a  (copper-amber — primary)
--color-accent-light:  #f4b88a  (warm peach — hovers, tints)
--color-accent-dark:   #c97040  (deep amber — text accents)
```

Available as Tailwind utilities: `bg-accent`, `text-accent-light`, `border-accent-dark`, etc.

---

## What You Need To Fill In Later

| Placeholder | Where | What To Do |
|---|---|---|
| Hero tagline | `app/page.tsx` line 38 | Replace `personal.headline` with your philosophy |
| Avatar photo | `components/AvatarPlaceholder.tsx` | Replace component with `<Image>` of yourself |
| Project descriptions | `data.json` → projects | Expand from 1-line to 2-3 sentences with the "why" |
| Whispers content | `data.json` → whispers | Write your own thoughts, replace AI-generated ones |
| OG image | `public/og-image.png` | Replace with a better designed version if desired |
