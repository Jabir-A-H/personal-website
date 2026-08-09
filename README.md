# Jabir Abdullah Haian - Personal Portfolio

*One Shell, Multiple Faces. The more you look, the less you see.*

A high-performance, statically exported personal portfolio built to showcase development projects, professional experience, and an interactive personal journey. The architecture heavily leans into a "per-page explicit theming" design philosophy, preserving the distinct personality of every route while seamlessly cross-fading backgrounds via Framer Motion.

## Features & Highlights

- **Per-Page Theming & Dark Mode**: Instead of a generic global inversion, every single route (`/`, `/education`, `/experience`, `/whispers`, etc.) features a hand-tuned Light and Dark mode palette. The `/projects` page specifically features a unique *Solarized Light* theme for daytime reading.
- **Interactive Journey Narrative**: The `/journey` page acts as an immersive timeline, sliding in decades and pivotal eras with smooth animations rather than just listing static dates.
- **Fluid Transitions**: A global `<Shell />` wraps the application, utilizing Framer Motion to smoothly transition background colors and UI elements during client-side navigation.
- **Fully Static Generation**: Everything, including the dynamic `sitemap.ts` file, is compiled into static HTML/CSS/JS via Next.js `output: 'export'` for blazing-fast CDN delivery.
- **Accessible & Responsive**: Keyboard navigable, optimized for `prefers-reduced-motion`, and meticulously styled across all breakpoints.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4 (Class-based Dark Mode + CSS-first architecture)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Source**: Local `data.json` configuration

## Development

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

## Deployment Architecture

This project is configured strictly for **Static Export** (`output: 'export'` in `next.config.ts`). It automatically builds and deploys to **Cloudflare Pages** via GitHub integration on every push to the `main` branch. 

Because it is statically exported, all dynamic APIs and Server Actions are omitted in favor of static generation.
