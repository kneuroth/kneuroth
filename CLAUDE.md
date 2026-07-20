# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Kelly Neuroth's personal portfolio site — an Angular 20 single-page app deployed
to GitHub Pages at https://kneuroth.github.io/kneuroth/. Built with PrimeNG 20
(Aura theme) and Tailwind CSS 4. Requires Node 22.x.

## Commands

```bash
ng serve        # dev server at http://localhost:4200/ (or: npm start)
ng build        # production build into dist/kneuroth/
ng test         # Karma + Jasmine unit tests (Chrome launcher)

# run a single spec file
ng test --include='**/banner.component.spec.ts'

# deploy to GitHub Pages — note the required base-href
ng deploy --base-href "/kneuroth/"
```

Prettier is configured (`.prettierrc`: single quotes, 80-col, `proseWrap: always`).

## Architecture

- **Standalone components throughout** — there are no NgModules. Bootstrapping is
  `bootstrapApplication(AppComponent, appConfig)` in `src/main.ts`; providers
  live in `src/app/app.config.ts` (router, async animations, PrimeNG Aura theme,
  `MessageService`).
- **Routing** is flat and component-based in `src/app/app.routes.ts`. Each route
  sets a `title`. Routes map to page components under `src/app/pages/`.
  `withComponentInputBinding()` is enabled, so route params bind directly to
  component `input()`s.
- **TypeScript path aliases** (see `tsconfig.json`) — always use these instead of
  long relative paths:
  - `@pages/*` → `src/app/pages/*`
  - `@shared/*` → `src/app/shared/*`
  - `@app/*` → `src/app/*`
- **Reactive state uses Angular signals**, not RxJS subscriptions in components.
  Pattern of record: a service holds a reactive form and exposes derived state via
  `toSignal(...valueChanges)` + `computed()`. See
  `pages/resume-page/resume/resume-tailor/resume-tailor.service.ts` — the
  "resume tailor" lets the user pick which name/skills/experiences to show, and a
  `computed()` assembles the live `Resume` model that the resume view renders
  (and that prints via the `@media print` / `.no-print` CSS rules).
- **Data is hardcoded in `.data.ts` and `constants.ts` files** colocated with the
  feature (e.g. `resume-options.data.ts`, `roadmap-item.data.ts`,
  `portfolio/constants.ts`). There is no backend or HTTP layer — content is
  edited in source. Typed models live in adjacent `model.ts` / `*.model.ts` files.
- **Styling**: Tailwind 4 via PostCSS. `src/styles.css` imports tailwind and
  defines the custom color palette and print rules in an `@theme` block (e.g.
  `--color-brownsugar`, `--color-wordle-green`). Many components use inline
  templates/styles (configured as the schematic default in `angular.json`).
- **Images and static assets** live in `public/` (served from root); portfolio
  and surface-art galleries reference files under `public/portfolio-images/` and
  `public/surface-art/`.

## Conventions

- New components should be standalone with explicit `imports`, and use signal
  inputs (`input()` / `input.required()`) rather than `@Input()`.
- Strict mode is on (`strict`, `strictTemplates`, `noPropertyAccessFromIndexSignature`,
  etc.) — expect the compiler to enforce these.
