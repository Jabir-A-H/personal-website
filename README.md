# Jabir Abdullah Haian — Personal Portfolio

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)
![Deployed on Cloudflare Pages](https://img.shields.io/badge/Deployed-Cloudflare%20Pages-f38020?logo=cloudflare)

A statically exported personal website where every route has its own visual identity — distinct background palette, heading animation, and transition style — rather than one global theme reused everywhere.

**Live:** [jabirah.pages.dev](https://jabirah.pages.dev)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js](https://nextjs.org) 16 (App Router, static export) |
| UI library | React 19 |
| Styling | Tailwind CSS 4 |
| Animation | [Motion](https://motion.dev) (Framer Motion) 12 |
| Icons | lucide-react |
| Language | TypeScript |
| Hosting | Cloudflare Pages |

## Routes

| Route | Description | Heading style |
|---|---|---|
| `/` | Home — curated overview | Typewriter effect |
| `/education` | Academic timeline | Page-turn entry (left-hinged) |
| `/experience` | Leadership, certs, skills | Rack-focus blur |
| `/projects` | Project showcase | Clip-path reveal |
| `/whispers` | Short-form writing | Fuzzy blur fade |
| `/now` | Current focus | Vortex spin-in |
| `/journey` | Chronological timeline | Horizontal slide |
| `/contact` | Links, resume, sitemap | Letter unfold |

## Architecture

### Content model

All page content lives in a single [`data.json`](data.json) file — education entries, experience items, projects, whispers, certifications, skills, achievements, and the journey timeline. Most site updates require editing only this file; no component code changes needed.

### Per-route theming

Each route defines its own light and dark palette in [`lib/theme.ts`](lib/theme.ts) via the `PAGE_THEMES` map. At runtime, [`Shell.tsx`](components/Shell.tsx) reads the current pathname and picks the matching theme: background color is animated directly via Framer Motion (`animate={{ backgroundColor }}`), while `--theme-muted` and `--theme-focus-ring` are injected as CSS custom properties that the `text-muted` and `bg-muted` Tailwind utilities resolve to. Colors that don't vary by route (like divider lines) use plain Tailwind `dark:` variants instead.

### Dark mode

A blocking `<script>` in `<head>` reads `localStorage` before first paint to avoid a flash of wrong theme. The [`DarkModeProvider`](components/DarkModeProvider.tsx) context then manages state for the rest of the session. Colors that need to vary by route use semantic tokens (see above); colors that are globally consistent across all routes use standard Tailwind `dark:` variants.

### Animations

Page transitions and heading animations are defined as presets in `lib/theme.ts` (`ANIMATION_PRESETS` and `HEADING_PRESETS`). Each route maps to a different enter transition — clip-path reveals, page turns, blur racks, vortex spins — while exit animations are deliberately omitted to avoid a known Next.js App Router + `AnimatePresence` incompatibility.

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout, fonts, global metadata
│   ├── page.tsx                # Home (/)
│   ├── globals.css             # Tailwind config, CSS custom properties
│   ├── global-error.tsx        # Error boundary
│   ├── education/page.tsx
│   ├── experience/page.tsx
│   ├── projects/
│   │   ├── page.tsx            # Project list
│   │   └── [slug]/page.tsx     # Project detail + case study
│   ├── whispers/
│   │   ├── page.tsx            # Whisper list (paginated, filterable)
│   │   └── [slug]/page.tsx     # Whisper detail
│   ├── now/page.tsx
│   ├── journey/page.tsx
│   ├── contact/page.tsx
│   ├── sitemap.ts              # Dynamic sitemap generation (Next.js metadata file)
│   └── rss.xml/route.ts       # RSS feed generation
├── components/
│   ├── Shell.tsx               # Layout shell — applies per-route theme
│   ├── DarkModeProvider.tsx    # Dark mode context
│   ├── JsonLd.tsx              # Structured data (Person schema)
│   ├── AnimatedHeading.tsx     # Route-aware heading animations
│   ├── TypewriterHeading.tsx   # Home page heading effect
│   ├── FuzzyHeading.tsx        # Whispers heading effect
│   ├── VortexHeading.tsx       # Now page heading effect
│   ├── TimelineCard.tsx        # Reused across education/journey
│   ├── ExperienceCard.tsx
│   ├── WhisperBody.tsx         # Per-whisper editorial styling
│   └── AllProjectsList.tsx     # Filterable project grid
├── lib/
│   ├── theme.ts                # PAGE_THEMES, animation presets
│   └── utils.ts                # Reading time calculation, helpers
├── data.json                   # Single source of truth for all content
├── public/                     # Static assets (images, resume, OG images)
└── next.config.ts              # Static export config, base path support
```

## Getting Started

**Prerequisites:** Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (static export to `out/`) |
| `npm run lint` | Run ESLint |
| `npm run clean` | Clean the `.next` build cache |

## Editing Content

Most updates only require editing `data.json`:

- **Add a project:** Add an object to the `projects` array with `title`, `slug`, `status`, `category`, `description`, `tech`, and optionally `repo`, `live`, and `caseStudy`.
- **Add a whisper:** Add an object to the `whispers` array with `title`, `slug`, `date`, `tags`, `content` (array of paragraphs), and optionally `style` (`dropcap`, `boldFirstLine`, `pullQuote`, `leadParagraph`, `decorativeRule`, `indentedBlock`, or `plain`).
- **Update the "Now" page:** Edit the `now.items` array and `now.lastUpdated` date.
- **Add a journey milestone:** Add a reference to the `journey` array — either `{ "type": "education", "title": "..." }` to pull from existing data, or `{ "type": "custom", ... }` for standalone entries.

After editing, run `npm run build` to regenerate static pages.

## Deployment

The site is statically exported (`output: 'export'` in `next.config.ts`) and deployed to Cloudflare Pages on every push to `main`. There are no server-side API routes or server actions — all data is baked in at build time from `data.json`.

An optional `BASE_PATH` environment variable can be set at build time if the site is served from a subpath.

## Future Considerations

- **Clickable tags + URL-synced filters.** Make whisper/project detail-page tags link back to a pre-filtered list, with the active tag reflected in the URL so filtered views are shareable and survive a page refresh.
- **Per-entry structured data.** Extend the existing `PersonSchema` pattern in `JsonLd.tsx` to whisper detail pages (`Article`/`BlogPosting` schema — author, datePublished, etc.) and project detail pages (`CreativeWork`/`SoftwareApplication` schema), to unlock richer search results for individual entries rather than relying solely on the sitewide Person schema.
- **Twemoji for country flags.** Windows natively renders country flag emojis as two-letter regional indicator codes (e.g., "PS"). Implement a Twemoji wrapper (like `react-twemoji`) around text elements like `FuzzyHeading` and `WhisperBody` so flags render consistently as SVG images across all operating systems.

## License

The **source code** in this repository is licensed under the [MIT License](LICENSE).

**Personal content** — including text, images, biographical data, writings (whispers), and case studies contained in `data.json` and `public/` — is © Jabir Abdullah Haian and is not licensed for reuse. Individual projects referenced on the site have their own separate repositories and licenses.
