# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

Kelly Neuroth's portfolio site, at https://kneuroth.github.io/kneuroth/ (Vite
`base: '/kneuroth/'`). Vite + React 19 + React Router + Tailwind 4; a static
SPA, no backend — content is data in source. It was an Angular app until the
React rewrite; that version is in this repo's history.

The design-system components come from **kneuroth-ui** (`../kneuroth-ui`), a
shadcn registry, installed into `src/components/ui/`. Read
`../kneuroth-ui/DESIGN.md` for the component rules and `DESIGN.md` here for the
desk and page layouts.

## The about page (the pyramid)

`src/pages/about/` — `kelly.json` drawn as a three.js glass pyramid.

- `pyramid-scene.ts` is **framework-free** three.js (~1.8k lines): it owns its
  canvas, CSS3D label layer, input and render loop, and talks to React only
  through `PyramidEvents` (`front`, `choose`) and `finish(endings)`. Keep React
  out of it.
- `about.tsx` mounts it in an effect and disposes it on unmount — `dispose()`
  must keep removing everything it adds, or StrictMode's double mount shows two
  pyramids in dev.
- `sentence.ts` turns a choice into the words finishing each face's sentence;
  the phrasing lives in `kelly-phrases.data.ts`, the graph in `kelly-graph.ts`.
- `about.css` is plain CSS scoped under `.kp-about` (the scene builds its DOM
  outside React). Type sizes there are mirrored by the `FLAT_*` constants in the
  scene — change them together. The `--neon-*` kind colours live there too;
  nothing else uses them.
- The page is `React.lazy` + `Suspense` in `routes.tsx`, so three.js is its own
  chunk (~150 kB gzipped) and the rest of the site never loads it. Vite's 500 kB
  warning on that chunk is expected.

## Commands

pnpm only.

```bash
pnpm dev          # http://localhost:5173/kneuroth/
pnpm build        # tsc -b + vite build, then copies index.html → 404.html
pnpm typecheck
pnpm run deploy   # build, then push dist/ to the gh-pages branch (goes live)
npx prettier --write "src/**/*.{ts,tsx,css}"
```

`404.html` is the GitHub Pages SPA fallback: a deep link like
`/kneuroth/portfolio/3d-art` is served the app, which then routes it.

**Deploying publishes the site** — Pages serves the `gh-pages` branch, and
`pnpm run deploy` (not `pnpm deploy`, which is a pnpm built-in) overwrites it.
Pushing `master` alone deploys nothing. Only deploy when Kelly asks.

## kneuroth-ui

- `src/components/ui/` is **installed code — don't hand-edit it.** Change the
  component in `../kneuroth-ui`, then pull it:
  `npx shadcn@latest add @kneuroth/<item> --overwrite` (`--diff` to preview).
  `components.json` registers `@kneuroth` at the deployed registry URL.
- The search field is in the library but deliberately not installed here yet:
  `npx shadcn@latest add @kneuroth/search-field` when a page needs it.
- Library `<a>`s (GlowButton/GlassButton with `href`) don't know the router. For
  an internal link, spread `useRouterLink(to)` from `@/lib/router` onto them;
  for a text link use `SweepNavLink`; for a swept word inside another link use
  `SweptLabel`. Files in `public/` go through `asset()` so they resolve under
  the base at any route depth.

## Architecture

- `src/main.tsx` creates the browser router from `src/routes.tsx` (a plain route
  table, each route's tab title in `handle.title`).
- `src/layout.tsx` mounts the desk once, the outlet over it, scroll restoration,
  and the tab title.
- `src/desk/` — the photograph and everything projected onto it;
  `desk-state.tsx` is the context that tells the home page whether the desk is
  projecting.
- `src/pages/` — one folder per area. Projects with a page of their own live
  under `pages/portfolio/` and route to `/portfolio/<name>`; the cards are data
  in `pages/portfolio/projects.ts`.
- Icons: `lucide-react`, plus the one brand glyph (`GithubIcon`) in
  `src/icons.tsx`. Every icon renders in `--sweep-base` via the library.

## Conventions

- Prettier: single quotes, 80 cols, `proseWrap: always`.
- Strict TS, including `noPropertyAccessFromIndexSignature`.
- Lower case is a CSS transform; write sentence case in source. Tab titles are
  lower case in source because CSS can't reach them.
- No print styles — the site isn't designed for paper.
- Every animation needs a `prefers-reduced-motion` off-switch.
