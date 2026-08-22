# Antigravity Plan: Arcade Foundation (Build This First)

Verified against the live repo pulled today. This is infrastructure only —
no game logic lives here. Every group plan (A–E) that follows assumes this
foundation already exists. Do not start any per-game plan before this one
is complete and passing its own QA checklist.

**STANDING INSTRUCTION FOR ANTIGRAVITY:** if you reach any implementation
decision not explicitly resolved in this document, stop and ask Jabir
directly. Present 2–3 concrete options with a real argument for and against
each — do not guess, and do not silently pick the option that seems most
reasonable to you. This applies throughout every plan in this series, not
just this file.

---

## 1. Route group structure

**What was found:** Next.js App Router (v16) supports only one active root
layout per deployed app unless the project is restructured into route
groups with fully separate root layouts — a risky, invasive change to a
working site. `Shell.tsx` currently wraps `{children}` for every route
directly inside `app/layout.tsx` (confirmed at line 109), applying site
navigation, page-transition animation, and `PAGE_THEMES` background color
to literally every page, with no existing opt-out mechanism.

**Decision:** rather than restructure the routing architecture, add a
single conditional bypass inside `Shell.tsx` itself. When the pathname
starts with `/rift`, render children directly with no site navigation, no
`PAGE_THEMES` lookup, no page-transition motion wrapper — just a plain
full-height container. Each game page is fully self-contained (its own
layout, its own theme toggle, its own "return" link) and manages its own
UI from scratch.

**File:** `components/Shell.tsx`

```diff
 export default function Shell({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();
   const prefersReducedMotion = useReducedMotion() ?? false;
   const { isDark } = useDarkMode();

+  if (pathname.startsWith('/rift')) {
+    return <div className="min-h-screen w-full">{children}</div>;
+  }
+
   const theme = getThemeForRoute(pathname);
```

**Trap:** this check must come before any of the `getThemeForRoute`/
`getAnimationForRoute` calls, not after — those functions still work fine
on an unmapped path (they fall back to the `/` preset via `matchRoute`'s
fallback), but running them is wasted work and risks an unwanted flash of
the homepage's background color before the bypass kicks in if ordered
wrong.

**Also verify:** the `<a href="#main-content">` skip-link and `id="main-
content"` landmark are part of the bypassed section — game pages lose this
accessibility feature. Each game page's own layout must include its own
skip-link if it has enough content to warrant one (most won't, given how
short these pages are, but confirm this per-game rather than assuming).

---

## 2. Shared game shell layout

**New file:** `app/rift/layout.tsx`

A minimal layout wrapping every game page — provides the "return" link
(never a full nav, per the locked design) and the per-game theme toggle
button, both rendered consistently so every game doesn't reinvent this
chrome.

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function RiftLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative">
      {children}
    </div>
  );
}
```

**ASK JABIR — return link placement and styling:**
- *Option A:* a small, quiet text link fixed to one corner (e.g. top-left),
  low-contrast until hovered — matches the site's restrained aesthetic
  everywhere else, but risks being genuinely hard to notice on a mobile
  screen where corner-tapping isn't an established pattern.
- *Option B:* a persistent small bar at the very top or bottom of every
  game, slightly more visible, costs a small amount of vertical space on
  every game screen.
- *Option C:* no persistent link at all — only a "return" option on the
  game-over/pause screen, keeping the play area completely clean but
  meaning there's no way out mid-game without using the browser back
  button.

This decision affects every single game's layout, so it belongs at the
foundation level, not repeated per-game.

**Per-game theme toggle:** each game renders its own toggle button (not
provided by this shared layout, since its placement will vary by each
game's specific UI), but all toggles read/write the same underlying
mechanism — see §4.

---

## 3. Color tokens — the ink/sepia/vermillion convention

**What was found:** `app/globals.css` currently defines only
`--color-accent`, `--color-accent-light`, `--color-accent-dark` (all
orange-toned, the site's existing accent palette) — no black/sepia/
vermillion tokens exist anywhere in the repo.

**New tokens**, added to the existing `@theme` block in `app/globals.css`:

```diff
 @theme {
   --color-accent: #e8915a;
   --color-accent-light: #f4b88a;
   --color-accent-dark: #9f552d;
   --color-muted: var(--theme-muted);
+  /* Arcade-only ink tokens — two-party convention across every game
+     needing to distinguish "player one" from "player two." */
+  --color-ink-primary: #1a1a1a;      /* player one, light mode: true black ink */
+  --color-ink-primary-dark: #d4c4a8; /* player one, dark mode: light sepia */
+  --color-ink-secondary: #b3312c;    /* player two, both modes: vermillion/cinnabar */
 }
```

**Trap:** `--color-ink-primary-dark` is a *value*, not a dark-mode variant
resolved automatically by the existing `@variant dark` mechanism — because
this token needs to swap based on the arcade's own theme toggle (§4), not
necessarily the site-wide dark mode class, each game component must
explicitly select between `--color-ink-primary` and
`--color-ink-primary-dark` based on its own local theme state, not rely on
CSS cascade alone. Confirm this against §4's actual implementation once
that's built, since if the arcade toggle simply reuses the site's `.dark`
class, a `dark:` variant would work fine and this note becomes moot —
flagging now because it depends on a decision not yet made.

**ASK JABIR — exact hex values:** the three values above are reasonable
starting points (true black, a warm light-sepia, a red-leaning vermillion)
but were not separately color-picked/approved by you. Options:
- *Option A:* accept these three as-is.
- *Option B:* provide your own exact hex values before implementation
  starts, so the palette is intentional rather than a placeholder.

---

## 4. Per-game theme toggle mechanism

**Decision:** each game reads the site's existing dark-mode state on
mount (via the existing `useDarkMode()` hook from
`components/DarkModeProvider`, already used by `Shell.tsx`) as its
*initial* value, but maintains its own local toggle from that point
forward — per the earlier locked requirement that games "respect site
theme AND have their own in-game toggle." Toggling in-game does **not**
write back to the site-wide dark mode preference; it's a local override
for that game session only.

**New file:** `lib/games/useGameTheme.ts`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useDarkMode } from '@/components/DarkModeProvider';

export function useGameTheme() {
  const { isDark: siteIsDark } = useDarkMode();
  const [isDark, setIsDark] = useState(siteIsDark);

  useEffect(() => {
    setIsDark(siteIsDark);
  }, [siteIsDark]);

  return { isDark, toggle: () => setIsDark(d => !d) };
}
```

**Trap:** the `useEffect` syncing to `siteIsDark` means if the site's dark
mode changes *while a game is open* (unlikely, since the toggle lives only
on the Contact page per existing memory, but not impossible if the person
has two tabs open), the game's local override gets silently reset. This is
almost certainly fine/desired behavior, but flagging since it's a subtle
interaction, not an obviously-correct default.

---

## 5. Shared high-score storage utility

**New file:** `lib/games/highScore.ts`

```ts
export function getHighScore(gameKey: string): number | null {
  try {
    const raw = localStorage.getItem(`rift:${gameKey}:highscore`);
    return raw === null ? null : Number(raw);
  } catch {
    return null;
  }
}

export function setHighScoreIfBetter(
  gameKey: string,
  score: number,
  higherIsBetter: boolean = true
): boolean {
  try {
    const current = getHighScore(gameKey);
    const isBetter =
      current === null || (higherIsBetter ? score > current : score < current);
    if (isBetter) {
      localStorage.setItem(`rift:${gameKey}:highscore`, String(score));
    }
    return isBetter;
  } catch {
    return false;
  }
}
```

**Key convention:** `rift:{gameKey}:highscore` — `gameKey` is the game's
route slug segment (e.g. `wash`, `stones`, `column`), not its display name,
so a future rename (like the Rimaya/Kyudo rename) doesn't orphan existing
players' saved scores.

**Trap:** `higherIsBetter` must be set correctly per game at the call site
— e.g. Ink Rush (time survived) and most games want `true`, but Memory/
Matching's Solo mode (fastest time) and Sudoku (if ever timed) would want
`false`. Getting this backwards silently breaks high-score tracking without
throwing any error, so double-check this parameter for every game
individually rather than copy-pasting a call site.

---

## 6. Shared win-check engine (for Group A only, staged here since it's shared)

**New file:** `lib/games/lineWinCheck.ts`

Generalized adjacency/line-check for Grid Strategy, Connect-4, and any
future N-in-a-row style game. Full implementation happens in the Group A
plan (since its exact interface depends on decisions made there about
board representation), but the **file location and shared-ness** is locked
here so Group A doesn't reinvent where this lives.

---

## 7. SEO exclusion

**File:** `app/sitemap.ts` — no changes needed. The `routes` array is a
hardcoded static list; `/rift/*` paths are simply never added to it.

**File:** `public/robots.txt`

```diff
 User-agent: *
 Allow: /
+Disallow: /rift/

 Sitemap: https://jabirah.pages.dev/sitemap.xml
```

**Trap:** `robots.txt` is a static file, not a generated route — confirm
there isn't a competing `app/robots.ts` before editing (checked: there
isn't one in the current repo, only the static file).

---

## QA checklist for this foundation

- [ ] `npm run build` succeeds, `tsc --noEmit` clean
- [ ] Visiting any existing site page (`/`, `/education`, etc.) shows no
      change whatsoever — nav, transitions, and theming all still work
      exactly as before
- [ ] Visiting a placeholder route under `/rift/` (create a throwaway
      `app/rift/test/page.tsx` temporarily if needed to verify, then
      delete it) confirms: no site nav renders, no page-transition
      animation plays, background is plain (not a `PAGE_THEMES` color)
- [ ] `robots.txt` correctly disallows `/rift/` — verify with a robots.txt
      testing tool or manual inspection of the built output
- [ ] `getHighScore`/`setHighScoreIfBetter` tested in isolation (e.g. a
      throwaway test page) confirms values persist across a page reload
      and fail silently (no thrown error) with `localStorage` mocked to
      throw, simulating private-browsing restrictions
- [ ] `useGameTheme` correctly picks up the site's current dark-mode state
      on first render, and toggling it does not affect the site's actual
      dark-mode preference when navigating back to any real site page

---

## What this foundation deliberately does NOT include

- Any actual game logic, UI, or route pages beyond the shared layout shell
- The hidden-link placement on the 11 host pages (Education, Experience,
  etc.) — that's a separate, small plan of its own once this foundation
  and at least one real game exist to link to, so the links have somewhere
  real to point
- The shared RAF game-loop skeleton (Group B), shared win-check engine's
  actual implementation (Group A), or any other group-specific shared code
  — those are staged in their respective group plans, not here
