# 🔍 Personal Website — Comprehensive Review

A full audit of [jabirah.pages.dev](https://jabirah.pages.dev) covering bugs, UX, performance, accessibility, SEO, content, and psychological/structural improvements.

> [!NOTE]
> **Excluded from this review** (per your request): Projects page entries being outdated, and Whispers page posts needing your content — these are acknowledged but not detailed here.

---

## 🚨 Critical Bugs (Must Fix)

### 1. Global Error Page Renders Completely Unstyled
[global-error.tsx](file:///f:/WebDev/personal-website/app/global-error.tsx) defines its own `<html>` and `<body>` (required by Next.js), but **never imports `globals.css`**. If a runtime error occurs, users see raw unstyled HTML — no fonts, no colors, no layout.

### 2. Private Repo "Source" Buttons → GitHub 404s
[projects/page.tsx](file:///f:/WebDev/personal-website/app/projects/page.tsx) renders a GitHub "Source" link for every project with a `repo` URL. Four projects (`jabirah.pages.dev`, `Gallery`, `LazyLedger`, `Entropy Clock`) are `"visibility": "PRIVATE"` — clicking "Source" takes visitors to a GitHub 404. Need to conditionally hide the button when `visibility !== 'PUBLIC'`.

### 3. Horizontal Scrollbar on Desktop (Hero Section)
The hero uses `w-screen` + `left-1/2 -translate-x-1/2` for full-bleed. On Windows/Linux browsers where scrollbars occupy layout width, `100vw` exceeds `100%` by ~16px, causing a persistent horizontal scrollbar and layout jank.

### 4. Hardcoded Experience Filtering is Fragile
In [page.tsx](file:///f:/WebDev/personal-website/app/page.tsx#L18-L23), homepage experience items are filtered by **exact title string match** (`exp.title === 'International Education Expo 2026'`). If you fix a typo or update a year in `data.json`, the item silently vanishes from the homepage. Should use a `"featured": true` flag or tag system instead.

---

## ⚡ Performance Issues

### 5. Hero Background Image is 6.18 MB
[hero-bg.webp](file:///f:/WebDev/personal-website/public/images/hero-bg.webp) is **6.18 MB** — devastating for mobile LCP and first-visit load times. Should be compressed to ~150–300 KB using Sharp/Squoosh, or served responsively with `srcset`.

### 6. Native `<img>` Instead of Next.js `<Image>`
The hero image uses a raw `<img>` tag without `width`, `height`, or lazy-loading hints — missing automatic WebP/AVIF optimization, responsive sizing, and priority preloading that Next.js `<Image>` provides. Also causes Cumulative Layout Shift (CLS).

### 7. Unused npm Dependencies
`@tailwindcss/typography` and `tw-animate-css` are installed in [package.json](file:///f:/WebDev/personal-website/package.json) but never actually imported/configured in [globals.css](file:///f:/WebDev/personal-website/app/globals.css). Tailwind v4 requires explicit `@plugin` imports. Dead weight in the bundle.

---

## ♿ Accessibility Violations (WCAG AA Failures)

### 8. Widespread Low-Contrast Text
Multiple elements across the site use `text-neutral-400` (#a3a3a3) or `text-neutral-500` (#737373) on light/dark backgrounds, **failing the 4.5:1 minimum contrast ratio**:

| Location | Color Pair | Contrast Ratio | Required |
|---|---|---|---|
| [SectionHeader.tsx](file:///f:/WebDev/personal-website/components/SectionHeader.tsx) — section titles | `#a3a3a3` on `#fafafa` | **1.91:1** | 4.5:1 |
| Skill overflow tags (homepage) | `#a3a3a3` on `#fafafa` | **1.91:1** | 4.5:1 |
| Whisper dates | `#a3a3a3` on `#f8f6f2` | **2.1:1** | 4.5:1 |
| Projects table headers | `#737373` on `#0a0a0a` | **3.24:1** | 4.5:1 |
| Accent buttons (404/error) | `#fff` on `#e8915a` | **2.4:1** | 4.5:1 |

### 9. Hero Image Has Misleading Alt Text
The atmospheric hero background has `alt="Jabir Abdullah Haian"`, causing screen readers to announce it as a meaningful image. Since it's purely decorative, it should use `alt="" aria-hidden="true"`.

### 10. Missing `<h1>` on Error Page
[global-error.tsx](file:///f:/WebDev/personal-website/app/global-error.tsx) starts at `<h2>`, skipping the `<h1>` heading level entirely.

---

## 🎨 Design & UX Issues

### 11. Navigation Theme Logic is Hardcoded & Brittle
[Navigation.tsx](file:///f:/WebDev/personal-website/components/Navigation.tsx#L16-L18) checks `pathname === '/projects'` to switch to white text. If you ever add another dark-themed page, the nav links will be dark-on-dark (invisible). Should derive colors from `PAGE_THEMES` in [theme.ts](file:///f:/WebDev/personal-website/lib/theme.ts).

### 12. Whispers `:first-letter` Styling Catches Punctuation
When a whisper's content starts with `"` (quotation mark), the CSS `first-letter:text-6xl first-letter:float-left` makes the quote mark into a giant floating character instead of the first letter. Needs a workaround (strip leading quotes, or wrap the decorative letter in a `<span>`).

### 13. Education Skills Artificially Truncated
[education/page.tsx](file:///f:/WebDev/personal-website/app/education/page.tsx) hard-slices skills to `skills.slice(0, 4)`, hiding up to 10 relevant skills (DU entry has 14). No "show more" indicator — visitors never know skills are missing.

### 14. Hardcoded Education Footnotes
Static footnotes `[1]–[4]` in the education page duplicate data from `data.json` as raw TSX strings. They'll desync when you update the JSON. Should be data-driven.

### 15. Date Format Chaos Across Pages

| Section | Format Example |
|---|---|
| Projects | `2026-05-15T10:46:11Z` (ISO) |
| Experience | `Apr 2024 — Sep 2025` (em dash) |
| Education | `2024 - Present` (hyphen) |
| Whispers | `2026.02.27` (dot-separated) |

While some variety is intentional for aesthetic, the em-dash vs hyphen inconsistency in experience/education feels unintentional.

### 16. Inconsistent Import Paths
[page.tsx](file:///f:/WebDev/personal-website/app/page.tsx) uses `../components/` relative imports while [layout.tsx](file:///f:/WebDev/personal-website/app/layout.tsx) uses `@/components/` aliases. Should standardize on `@/` for maintainability.

---

## 📧 Contact Page Gaps

### 17. No Contact Form — Only External Links
[contact/page.tsx](file:///f:/WebDev/personal-website/app/contact/page.tsx) is a static list of 8 outbound links. No way for a visitor to send a message without leaving the site. Even a simple mailto: form or embedded form (Formspree/Tally) would reduce friction.

### 18. Resume Download Not Exposed
A `download` prop exists on `ContactLink` but is **never used** — and [Jabir_Abdullah_Haian_Resume.pdf](file:///f:/WebDev/personal-website/public/Jabir_Abdullah_Haian_Resume.pdf) sits in `public/` with no visible link anywhere on the contact page. Major missed opportunity.

### 19. "Preferred" Badges Are Hardcoded
`preferred={endpoint.name === 'Email' || endpoint.name === 'LinkedIn'}` is hardcoded in TSX instead of using a data flag. Fragile and hard to maintain.

---

## 🔍 SEO & Structured Data

### 20. Missing Canonical URL
Root layout metadata lacks `alternates: { canonical: '/' }`. Risk of duplicate content indexing across deployment aliases (e.g., `*.pages.dev` vs custom domain).

### 21. JSON-LD Missing `@id`
[JsonLd.tsx](file:///f:/WebDev/personal-website/components/JsonLd.tsx) `PersonSchema` doesn't include an `@id` (e.g., `https://jabirah.pages.dev/#person`), preventing schema engines from cross-referencing entities.

### 22. All 7 Certification Verify URLs are Empty
Every certification in `data.json` has `"verifyUrl": ""`. The verify link is conditionally rendered, so it never appears — but this means no external credibility proof for any certification.

---

## 🧠 Psychological & Structural Enhancements

### 23. No "What I'm Working On" / Current Status Signal
Visitors have no sense of what you're *currently* doing. A small "now" section or status indicator on the homepage (e.g., "Currently: Preparing for CA Intermediate exams" or "Building: LazyLedger v2") creates **temporal relevance** and makes the site feel alive, not archived.

### 24. No Social Proof Above the Fold
The homepage hero has your name and title but no quick proof of credibility (achievement count, years of experience, key accomplishment). Even subtle stats like "6+ projects · 7 certifications · GPA 3.35" near the hero creates instant authority.

### 25. Missing "Call to Action" Hierarchy
Every page ends, but none guide the visitor to a **next step**. After viewing projects, there's no nudge toward contact. After education, no push toward experience. Adding contextual CTAs at the bottom of each page ("Liked my projects? Let's connect →") creates a natural visitor flow and increases engagement.

### 26. No Page Transition Continuity
Each page has its own theme/background color (great for identity), but there's no animated transition between them. Adding a subtle page-transition animation (fade, slide, or color morph) would make the multi-themed approach feel **intentional and cinematic** rather than jarring.

### 27. No Keyboard Navigation Indicators
Focus states aren't visually distinct. Tab-navigating through the site shows default browser outlines at best. Custom `:focus-visible` styles matching each page's theme would signal polish and accessibility care.

### 28. Skills Section Lacks Context
The homepage skills grid shows names and levels (1–5 dots/bars), but no context for *how* or *where* each skill was applied. Even a tooltip or subtitle connecting a skill to a project/role adds perceived depth.

### 29. No Visitor "Journey" or Storytelling Arc
The site is structured as isolated pages (projects, education, experience). But there's no **narrative thread** connecting them — why you went from accounting to coding, how your projects relate to your academic journey. A brief "My Story" or integrated timeline that weaves education + experience + projects chronologically would be psychologically compelling.

### 30. Footer is Minimal — Missed Branding Opportunity
The footer quote `"Still learning. Always building."` is great, but the footer overall is thin. Adding a mini sitemap, quick social links, or a subtle "last updated" timestamp reinforces professionalism and makes the site feel maintained.

### 31. No Dark Mode Toggle
The projects page is dark-themed, others are light. But there's no user-controlled dark mode. Many developer/tech-savvy visitors (your likely audience) expect and prefer dark mode. Even a simple toggle that remembers preference via `localStorage` would be a strong quality-of-life feature.

### 32. No Loading States or Skeleton Screens
Page transitions and content loading happen without visual feedback. Adding skeleton placeholders or subtle loading animations for the hero image, project cards, etc., prevents the "flash of unstyled content" feel.

### 33. No Micro-Interactions on Cards
Project cards and experience cards are static hover states. Adding subtle micro-interactions (slight scale, shadow elevation, border glow on hover) makes the interface feel more responsive and premium.

---

## 🧹 Small Polish / Quality-of-Life

### 34. Unused Component: `AnimatedHeading.tsx`
[AnimatedHeading.tsx](file:///f:/WebDev/personal-website/components/AnimatedHeading.tsx) is defined but never imported or used anywhere. Dead code.

### 35. Unnecessary `suppressHydrationWarning`
[layout.tsx](file:///f:/WebDev/personal-website/app/layout.tsx) has `suppressHydrationWarning` on `<body>` with no dynamic SSR attributes to justify it. This can silently mask real hydration bugs.

### 36. No Favicon in Multiple Formats
Only [favicon.svg](file:///f:/WebDev/personal-website/public/favicon.svg) exists. Some browsers/platforms need `.ico`, `apple-touch-icon.png`, or `manifest.json` entries for proper bookmark/PWA icons.

### 37. Sitemap `<lastmod>` is Static
[sitemap.xml](file:///f:/WebDev/personal-website/public/sitemap.xml) has a hardcoded `<lastmod>2026-07-30</lastmod>`. Should be auto-generated at build time to stay accurate.

---

## Priority Matrix

| Priority | Items | Impact |
|---|---|---|
| 🔴 **Critical** | #1 (error page), #2 (404 links), #3 (scrollbar), #5 (6MB image) | Broken functionality, terrible first impression |
| 🟠 **High** | #4 (fragile filtering), #8 (contrast), #11 (nav theme), #18 (resume link), #20 (canonical) | Accessibility violations, missed opportunities |
| 🟡 **Medium** | #12 (first-letter), #13 (skills truncation), #17 (contact form), #23 (current status), #25 (CTAs), #31 (dark mode) | UX friction, engagement gaps |
| 🟢 **Polish** | #14–16, #26–30, #32–37 | Professional feel, attention to detail |
