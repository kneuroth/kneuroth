# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## What this is

Kelly Neuroth's personal portfolio site — an Angular 20 single-page app deployed
to GitHub Pages at https://kneuroth.github.io/kneuroth/. Built with PrimeNG 20
(Aura theme) and Tailwind CSS 4. Requires Node 22.x.

## Commands

**Dependencies are managed with pnpm** (`pnpm-lock.yaml`, and `node_modules` is
a pnpm store). `npm install` fails outright on this tree — use `pnpm install`.

```bash
ng serve        # dev server at http://localhost:4200/ (or: pnpm start)
ng build        # production build into dist/kneuroth/
ng test         # Karma + Jasmine (Chrome launcher) — no specs in the tree today

# run a single spec file, once there is one
ng test --include='**/some.component.spec.ts'

# deploy to GitHub Pages — note the required base-href
ng deploy --base-href "/kneuroth/"
```

Prettier is configured (`.prettierrc`: single quotes, 80-col,
`proseWrap: always`).

## Architecture

- **Standalone components throughout** — there are no NgModules. Bootstrapping
  is `bootstrapApplication(AppComponent, appConfig)` in `src/main.ts`; providers
  live in `src/app/app.config.ts` (router, async animations, image-aware,
  PrimeNG Aura theme).
- **The app shell is a photograph.** `AppComponent` mounts `<app-desk>`
  (`src/app/desk/`) once, behind the router outlet: `opportunities.jpg` fixed
  full-bleed under every page, with live DOM projected onto surfaces inside it
  via the `@image-aware/angular` custom element. The home route _is_ the desk —
  no header, no page content — and every other route lays a panel over it. See
  DESIGN.md.
- **Routing** is flat and component-based in `src/app/app.routes.ts`. Each route
  sets a `title`. Routes map to page components under `src/app/pages/`.
  `withComponentInputBinding()` is enabled, so route params bind directly to
  component `input()`s.
- **TypeScript path aliases** (see `tsconfig.json`) — always use these instead
  of long relative paths:
  - `@pages/*` → `src/app/pages/*`
  - `@shared/*` → `src/app/shared/*`
  - `@app/*` → `src/app/*`
- **Reactive state uses Angular signals**, not RxJS subscriptions in components.
  Pattern of record: state is a `signal()`, anything derived is a `computed()`,
  and a plain service carries state that has to cross component boundaries. See
  `desk/desk.service.ts` with `desk/desk.component.ts` — the desk writes what
  the `<image-surface>` element reported into a signal, and the home page reads
  it to decide whether it needs its fallback panel. `toSignal()` bridges router
  events into a signal in `app.component.ts`.
- **Data is hardcoded in `.data.ts` and `constants.ts` files** colocated with
  the feature (e.g. `roadmap-item.data.ts`, `portfolio/constants.ts`). There is
  no backend or HTTP layer — content is edited in source. Typed models live in
  adjacent `model.ts` / `*.model.ts` files.
- **Styling**: Tailwind 4 via PostCSS. `src/styles.css` imports tailwind and
  defines the custom color palette and print rules in an `@theme` block
  (`--color-frenchgrey` and the three `--color-wordle-*`). Many components use
  inline templates/styles (configured as the schematic default in
  `angular.json`).
- **Images and static assets** live in `public/` (served from root); portfolio
  and 3D-art galleries reference files under `public/portfolio-images/` and
  `public/3d-art/`. `opportunities.jpg` and its `opportunities.surfaces.json`
  manifest are the desk — the manifest is edited with the `@image-aware/editor`
  marking tool, not by hand.

## Conventions

- New components should be standalone with explicit `imports`, and use signal
  inputs (`input()` / `input.required()`) rather than `@Input()`.
- Strict mode is on (`strict`, `strictTemplates`,
  `noPropertyAccessFromIndexSignature`, etc.) — expect the compiler to enforce
  these.

## Design system

The site's visual language is documented in `DESIGN.md` — read it before adding
or restyling UI. The load-bearing rule: **every clickable element uses the
`.glow-link` treatment** (defined in `src/styles.css`). Pick the variant by
surface — base warm on dark/photographic surfaces, `glow-link-azure` on
light/frosted-glass ones. Don't add bare buttons or one-off hover styles.

The design-system patterns are encapsulated as a small in-repo component library
under `@shared/ui` — `<app-glow-button>` (every button) and `<app-glass-panel>`
(every frosted surface), plus the `glowSweep` and `appReveal` directives. Prefer
these over raw markup or bare PrimeNG controls; plain non-button links stay as
`<a class="glow-sweep …">`, and any icon is `.glow-link glow-link-icon`.
