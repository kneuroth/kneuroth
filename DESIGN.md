# Design system — "Embossed Glow"

The visual language for kneuroth.github.io. This is the source of truth; when a
component and this document disagree, the component is the bug. Keep it short —
if a rule here stops matching the site, fix one of them.

## The thesis

One idea carries the whole site: **light passing through frosted glass.** The
site stands on a single photograph — Kelly's desk, a laptop on a windowsill —
and content sits on translucent panels over it. Interactive things don't look
like buttons; they look like **embossed words with a colored light glowing
behind them.** That glow is the signature. Everything else stays quiet so it can
shine.

## The one rule for interactive elements

**Every clickable thing uses `.glow-link`.** Nav links, contact links, project
links, icon buttons, download/print controls — all of them. No bare PrimeNG
buttons, no one-off `hover:scale-*` classes, no ad-hoc link colors. The class
lives in `src/styles.css` and works on a plain `<a>` or, via the PrimeNG bridge,
on a `<p-button styleClass="glow-link …">`.

The house logo (`.logo-link`) is the same language at a larger, circular scale —
it is the glow rule applied to the brand mark, not an exception to it.

**Text links use `.glow-sweep` — this is the canonical link style.** Every text
link (nav words, resume + project links) rests as a **gentle breathing
white→blue gradient** clipped to the letters (bottom background layer + the
`breathe` animation drifting `--breathe`). On **hover/focus** the `glowSweep`
directive picks one of the four cube groupings at random and fires a single
snappy sweep (the top band layer, `--sweep-c1`/`--sweep-c2` + `.is-sweeping`). A
soft blue glow breathes on the letters at all times (the ambient `drop-shadow`
driven by `--breathe`) and is unaffected by the sweep. There is **no
ambient/random sweep** — hover is the only trigger. On `<app-glow-button>`, pass
`[sweep]="true"` and add `glowSweep`; on a plain `<a class="glow-sweep">`, just
add `glowSweep`. Icon-only action buttons keep the rotating ring; text links
sweep.

### Variant selection is by surface, not by mood

| Surface                                                 | Variant                     | Why                                                                 |
| ------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------- |
| Dark / photographic (home hero)                         | `glow-link` (base warm)     | Warm taupe letters + the cube-triad glow read as the home identity  |
| Very dark, needs more lift                              | `glow-link glow-link-dark`  | Lighter warm letters, inverted emboss                               |
| Light / neutral / frosted-glass (resume, project cards) | `glow-link glow-link-azure` | A light azure that reads on the resume glass; the resume's identity |

Pick the variant from the background the element sits on — never mix warm and
azure on the same surface. If you add a new surface, add a row here.

## Color

Tokens live in the `@theme` block of `src/styles.css`. Use the token, never a
raw hex, in components.

- **Warm identity (default):** letters `rgb(163 151 141)`, cube-triad glow halo.
  Palette accents: `--color-brownsugar #b75f3d`, `--color-glacier #6886b2`,
  `--color-charcoal #3b404d`, `--color-frenchgrey #bbb9be`,
  `--color-smokey #0c0607`.
- **The glow itself (Rubik's cube):** the halo shows three colours at all times
  — white plus two cube colours — and smoothly cycles the four top-face corner
  triads: white+orange+blue → white+orange+green → white+green+red →
  white+red+blue. Driven by the `glowCube` keyframes over `--glow-a`/`--glow-b`;
  cube colours are orange `#ff5800`, green `#009b48`, red `#c41e3a`, blue
  `#0051ba`. This is the base/logo glow only — azure keeps its own blue glows.
- **Azure identity (resume + light surfaces):** a light azure — letters
  `rgb(125 185 240)`, hover `rgb(170 210 250)`, blue-tinted halo. Set via the
  `glow-link-azure` variant, not by hand.
- **Nav / header:** near-white nav words (`.nav-link`) on a smokey-frosted
  header bar (`--color-smokey` at ~0.45 over blur). The logo is `frenchgrey` so
  it reads on the dark bar.
- **Wordle sub-brand (scoped to the Wordle League page only):**
  `--color-wordle-green #538d4e`, `--color-wordle-gold #b59f3b`,
  `--color-wordle-bg #0f172a`. Do not use these outside that page.

The halo is a conic gradient of white + `--glow-a` + `--glow-b`, written inline
where it's painted (must reference the animated properties directly — an
intermediate custom property freezes the animation). `glowSpin` revolves it via
`--glow-angle`; `glowCube` cycles the colours.

## Typography

Current: system sans, one weight scale, Tailwind size utilities. This is the
least developed axis of the system and the clearest next opportunity — a
characteristic display face for page titles (`app-page-title`, the home `h2`)
paired with the current sans for body would give the pages an identity the glow
can't carry alone. **Not yet adopted** — flagged here so it's a deliberate
choice, not an oversight. Until then: titles `text-2xl`+, body `text-sm`–`lg`,
muted secondary text at `/70`–`/60` opacity.

## Structure & layout

- **Frosted glass** is the recurring surface, delivered by `<app-glass-panel>`:
  translucent, `backdrop-blur`, soft shadow, generous rounding on the `floating`
  variant; a full-bleed adaptive-frost bar on the `header`/`footer` variants.
- **Hairline borders** (`border-gray-300`, often `border-double`) separate
  regions; avoid heavy chrome.
- **The portfolio page's project list zig-zags** — the panels are **joined to
  the screen edges**, alternating left and right: full-bleed, outer corners
  squared off (`<app-glass-panel edge>`), mirrored so the words stay against the
  edge the panel is joined to and the thumbnails face the middle of the page,
  and flying in from the edge they're attached to. Deliberately _not_ in the
  centered `max-w-7xl` container — that's what makes them read as part of the
  screen edge rather than floating near it. It's one long scroll, not a grid,
  and it carries itself without a section label: keep the alternation unbroken
  when adding an entry.
- **Project thumbnails are a lead tile with the rest stacked beside it**, not a
  fan of overlapping squares — every tile lands near 4:3, which is the shape
  almost all of this content actually is, and nothing hides behind anything
  else. Three at most; a lone one gets a narrower cluster so it doesn't stretch
  into a letterbox; on a phone the cluster drops below the text and only the
  lead survives. **Cover vs contain is decided from the file, not the data**: an
  entry carries whatever the project had — phone screenshots at 0.45, a 3.77:1
  wordmark, 64px sprites — and cropping those to a tile leaves a meaningless
  slice of their own middle, so anything far from the tile's shape, or too small
  to fill it, letterboxes instead. Don't hand-tag entries for this; the image's
  own dimensions already know.
- Don't add numbered markers, eyebrows, or dividers unless the content is
  genuinely a sequence (the Wordle League timeline earns its ordering; a list of
  links does not).

## Motion

- Interactive glow: slow ambient revolve always, neon bloom on hover/focus. This
  is handled by `.glow-link` — don't re-invent per component.
- One-shot page-load flourishes are allowed but rationed (the logo's squash +
  bloom on the portfolio page, where the cube lands you). One orchestrated
  moment per page, not scattered effects.
- **Scroll motion is entrance-only, never continuous.** Content arrives once
  with `appReveal` and then stays put — no scroll-linked wobble, no re-animating
  on the way back up. The desk doesn't move at all: it's a room the pages slide
  over, and rooms hold still.
- **`prefers-reduced-motion` is honored** — every animation added must have a
  reduced-motion off-switch, matching the pattern already in `styles.css`.

## The desk

**The whole site stands on one photograph.** `opportunities.jpg` — the laptop on
the windowsill — is fixed behind every page, mounted once in the app shell
(`<app-desk>`, `src/app/desk/`) so navigating slides panels over the room
instead of rebuilding it. There is no per-page backdrop: a page that wants a
background has already got one.

**On the home route the photograph isn't scenery, it's the interface.** The veil
lifts and `<image-surface>` — the `@image-aware/angular` custom element,
registered by `provideImageAware()` in `app.config.ts` — projects real, live DOM
onto the flat surfaces marked in `public/opportunities.surfaces.json`, angled to
match the shot:

| Surface                 | Carries                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| `laptop`                | The JSON block, and the one off-site link: `github.com/kneuroth`  |
| `below-notebook`        | The introduction — "Hello, I'm Kelly", written on the page        |
| `cube-teal`, `cube-red` | The Rubik's cube — one link to `/portfolio`, labelled `portfolio` |

**The manifest owns the surface list, and re-marking the photo replaces it.**
Slot names are surface ids, so a re-mark that renames or drops a surface
silently empties whatever was slotted into it. After re-marking: check every
`slot=` in `desk.component.html` still matches an id, and re-check the
design-space sizes in `desk.component.css` against the new `resolution`s.

The home page has **no nav bar**, and that's the point: the cube on the sill is
the way through to the rest of the site. Every other route drops the veil back
over the photo and carries the header as usual — and that header carries **no
"Projects" link either**. The portfolio is reached through the cube, and
duplicating it in the bar would spend the cube's whole purpose; `Home` is one
click away from anywhere, and the desk is right there.

Rules for working on it:

- **Slotted content is written in each surface's design space**, in raw `px`
  (the `resolution` in the manifest — laptop 490×363, notebook page 392×56).
  Those sizes live in `desk.component.css`, never in Tailwind's rem utilities,
  which would couple the laptop screen's type size to the root font size.
- **Framing is art direction in the manifest, not CSS.** `fit="cover"` is on the
  element — that's this page's decision, not the photo's. Everything else about
  how the scene is framed at a given size (`crop`, `objectPosition`, and which
  surfaces are projected, floated or dropped) lives in the manifest's `variants`
  and is authored in the library editor's Screens mode. Never set
  `--image-aware-object-position` as well: the element resolves it from one
  place on purpose, and two sources drift the photo and the surfaces apart.
- **Pick the treatment from the surface, as always.** The laptop screen is
  near-black, so it takes the canonical swept link as-is; the notebook page is
  pale and lit from the window, so it flips to dark ink. An icon inside a
  `.glow-sweep` link is swallowed by its text-fill trick — keep icons as
  siblings, as the glow buttons do.
- **The cube is one object, not one link per face.** Both faces are decorative
  duplicates (`aria-hidden`, `tabindex="-1"`) so a click anywhere on the cube
  works; the one real link is the word **`portfolio`** hovering above it, whose
  visible text is the accessible name. Hovering or focusing any of the three
  lights all of them, via `:has()` on the host.
- **Two things are drawn around the cube, not on it.** A surface clips, and both
  the halo and the label are deliberately bigger than the box they belong to, so
  neither is slotted: they're ordinary elements positioned from the projected
  `quad` the layout event reports, and sized off the cube's own projected width.
  They stay upright while the cube stays angled — that's what makes the label
  read as hovering above the object rather than painted onto it.
  - The **halo** is the site's signature glow finally landing on the actual
    Rubik's cube: the same revolving conic triad as `.glow-link`, blurred wide
    and masked hollow in the middle so it glows _outside_ the faces while their
    own inner light still reads. It must not take a negative `z-index` — the
    desk host is a stacking context, which would bury it behind the photograph.
  - The **label** hangs bottom-centre off the cube's top edge and breathes there
    on a slow loop, pausing on hover so a moving target settles under the
    pointer. Reduced motion keeps the offset and drops the drift.
- **On a phone the room is re-framed, not abandoned.** Under 768px the manifest
  crops in on the sill and floats the laptop's and the notebook's content out of
  the photograph into boxes of their own, top and bottom — while the cube stays
  _projected_, because it's the link and it has to stay on the object it's drawn
  on. It lands around 80×105px there, a real tap target.
- **A floated surface is a different stylesheet.** It keeps its box but loses
  the transform, so design-space px become real page px — and the surface still
  clips, silently. The desk reads each surface's placement out of the layout
  event and puts `.is-floating` on the slotted root, so the CSS answers to what
  the element decided rather than restating the manifest's breakpoint. Size
  floated content against the box (`min()` of a vw- and a vh-relative unit, then
  `em` off that) and give it its own ground: off the laptop screen there's no
  black panel behind the type any more, so the floated card brings a dark
  frosted one.
- **The type flips with the surface, wherever it lands.** The name is dark ink
  on the pale notebook page while projected, and light letters with a shadow
  once it floats over open photograph. Same rule as always — read the background
  it's actually on.
- **Nothing projects at all is still a case.** A manifest that fails to load, or
  a variant that drops every surface, leaves the home page with nothing on it —
  so pages ask `DeskService` (a signal fed by the element's own layout and error
  events) whether the desk is projecting, and home falls back to an ordinary
  panel carrying the same words and links. Never re-derive that in CSS, where it
  would drift from the manifest.
- **The whole photograph is never guaranteed** — it's a background, so `cover`
  crops it. What's guaranteed is the _surfaces_, and only while projecting: a
  surface pushed out of frame doesn't disappear, it renders detached on the
  wrong part of the photo. Re-check `variants` if you move a surface near an
  edge.
- Re-mark surfaces with the library's editor
  (`pnpm mark public/opportunities.jpg` from a clone of `image-aware-elements`)
  rather than editing corners by hand.

The Wordle League page keeps its own dark navy ground — it's a scoped sub-brand,
and the one page that deliberately covers the desk.

## Component library (`@shared/ui`)

The design-system patterns are encapsulated as thin standalone components so the
rules above are enforced in code, not by copy-paste. **Reach for these before
writing raw markup or a bare PrimeNG control.** They wrap primitives + tokens;
they are not a general widget kit — add one only when a pattern actually
repeats.

| Component                   | Selector                  | Use for                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GlowButtonComponent`       | `<app-glow-button>`       | Every button. Sets the `.glow-link` treatment; pass `variant` (`warm`/`dark`/`azure`), `label`/`icon`, `size`, `rounded`, `ariaLabel`; listen to `(onClick)`.                                                                                                                                                                                                                                 |
| `SectionHeadingComponent`   | `<app-section-heading>`   | A labelled section on a dark/glass surface (the resume headings). Content-projected.                                                                                                                                                                                                                                                                                                          |
| `GlassPanelComponent`       | `<app-glass-panel>`       | The frosted-glass surface. `variant`: `floating` (default rounded white panel, e.g. the resume), `header`/`footer` (full-bleed adaptive-frost bar with a hairline edge). `edge`: `left`/`right` joins a floating panel to that screen edge — outer corners square, that side's stroke dropped (the home page's project slabs). Handles its own print reset. Set layout utilities on the host. |
| `ParallaxBackdropComponent` | `<app-parallax-backdrop>` | A scrolling photographic scene — images stacked into a column that travels slower than the page. **Currently unused:** the desk replaced every page backdrop. Kept for a page that wants a scene of its own.                                                                                                                                                                                  |
| `RevealDirective`           | `appReveal="left\         | Flies an element in from the side of the screen the first time it scrolls into view (the home page's alternating project entries). Goes on a **wrapper** — the wrapper is observed and stays put, its child travels. An ancestor must set `overflow-x: clip`.                                                                                                                                 | Slides an element in from one side the first time it scrolls into view (the home page's alternating project entries). The parent must set `overflow-x: clip`. |
| `InnerGlassPanelComponent`  | `<app-inner-glass-panel>` | A nested card _inside_ an `<app-glass-panel>` (resume skills/education/experience/project cards). A lighter secondary surface (faint fill + hairline border, no blur/shadow). Owns padding, fill, border; leave border-radius + layout (incl. `sm:rounded-*-none`) to Tailwind on the host. Handles its own print reset.                                                                      |

Conventions for this layer:

- **Standalone, signal inputs, one folder per component** under
  `src/app/shared/ui/`.
- Presentational only — no data fetching, no router knowledge; communicate via
  `input()` / `output()`.
- Icon-only `GlowButton`s **must** set `ariaLabel`.
- Plain text links that aren't buttons stay as `<a class="glow-link …">` — the
  raw class is still the primitive; `GlowButton` is the p-button convenience on
  top of it.
- `logo` and `page-title` currently live in `@shared/components/`; they're
  candidates to migrate here as the `ui` layer settles. Not urgent.

## Quality floor (non-negotiable)

- Responsive to mobile.
- Visible keyboard focus — `.glow-link` blooms on `:focus-visible`; never remove
  it without an equivalent.
- Every icon-only control has an `ariaLabel`.
- Print stays legible: glows drop, text forces dark (see the `@media print`
  rules). New interactive styles must include a print fallback.
