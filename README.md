# Out Of Box Studio

A cinematic, immersive marketing site for the fictional independent game studio
**Out Of Box Studio** — _"Creating Worlds Beyond Reality."_ Built to feel less
like a website and more like the opening sequence of a AAA game.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme` design tokens)
- **Framer Motion** — scroll/reveal/micro animations
- **Lenis** — luxurious smooth scrolling
- **React Three Fiber + Drei + Three.js** — the hero 3D scene
- **Lucide React** — UI icons (brand marks are inline SVG in `BrandIcons.tsx`)
- Fonts: **Space Grotesk** (display), **Sora** (body), **Geist Mono** (mono)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

## Architecture

```
src/
├─ app/                     # layout, metadata/SEO, global design system (globals.css)
├─ components/
│  ├─ experience/           # SiteFrame, LoadingScreen, CustomCursor, Background,
│  │                        # SmoothScroll (Lenis), ScrollProgress, LoadingContext
│  ├─ hero/HeroScene.tsx    # React Three Fiber scene (lazy, client-only)
│  ├─ layout/               # Navbar (glass, scroll-aware), Footer
│  └─ ui/                   # reusable primitives: Reveal, TextReveal, TiltCard,
│                           # MagneticButton, Marquee, SectionHeading, Artwork, Logo
├─ sections/                # Hero, FeaturedGame, About, OurGames, Journey,
│                           # Process, BehindScenes, Stats, Devlogs, Contact
├─ hooks/                   # useMediaQuery, usePrefersReducedMotion, useCountUp
└─ lib/                     # data.ts (content source), utils.ts (helpers + easing)
```

## Notes

- **Content** lives in `src/lib/data.ts` — swap for a CMS later without touching UI.
- **Key art** is rendered procedurally (`ui/Artwork.tsx`) from layered gradients +
  noise, so there are no heavy image assets to ship.
- **Accessibility / performance**: honors `prefers-reduced-motion` (loader, cursor,
  starfield, 3D scene and counters all degrade gracefully); the 3D scene is code-split
  and skipped for reduced-motion users; custom cursor only activates on fine pointers.
```
