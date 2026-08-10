# Jabir Abdullah Haian — Personal Portfolio

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)
![Deployed on Cloudflare Pages](https://img.shields.io/badge/Deployed-Cloudflare%20Pages-f38020?logo=cloudflare)

Statically exported personal portfolio site. Every route has its own distinct visual theme, palette, and heading treatment rather than one global design system reused everywhere.

**Live site:** [jabirah.pages.dev](https://jabirah.pages.dev)

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

| Route | Description |
|---|---|
| `/` | Home |
| `/education` | Education history |
| `/experience` | Work experience |
| `/projects` | Project showcase (Solarized-light-inspired theme) |
| `/whispers` | Short-form writing, with per-entry editorial styles |
| `/now` | Current focus |
| `/journey` | Chronological personal timeline |
| `/contact` | Contact links, resume, sitemap, dark mode toggle |

## Project Structure

```
├── app/                  # Next.js App Router routes (one folder per page)
├── components/           # Shared React components (cards, headings, shell, nav)
├── lib/
│   └── theme.ts          # Per-route animation/heading presets
├── data.json             # Single source of truth for all page content
├── public/                # Static assets (images, resume PDF, OG images, icons)
└── next.config.ts         # Static export config
```

Content (education, experience, projects, whispers, etc.) is driven entirely by `data.json` — most updates to page content don't require touching component code.

## Getting Started

**Prerequisites:** Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

| Command | Description |
|---|---|
| `npm run build` | Production build (static export to `out/`) |
| `npm run start` | Serve a production build locally |
| `npm run lint` | Run ESLint |
| `npm run clean` | Clean the `.next` build cache |

## Deployment

The site is statically exported (`output: 'export'` in `next.config.ts`) and deployed to Cloudflare Pages on every push to `main`. Because it's a static export, there are no server-side API routes or server actions — all data comes from the build-time `data.json`.

An optional `BASE_PATH` environment variable can be set at build time if the site is ever served from a subpath.

## Design Notes

- Every route defines its own light/dark palette rather than inheriting one global theme.
- Page transitions are enter-only (no exit animations) — this avoids a known Next.js App Router + `AnimatePresence` incompatibility where the router discards the outgoing page tree before exit animations can finish.
