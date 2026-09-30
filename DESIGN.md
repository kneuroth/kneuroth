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

**Every icon is the same pale blue — `--sweep-base`.** A glyph can't wear
`.glow-sweep` (the clip-to-letters trick blanks the text fill and swallows it),
so icons take `.glow-link glow-link-icon` instead: `--sweep-base` solid, white
on hover, and the same ambient blue halo the sweep links carry, over the shared
cube ring. That's the whole point — an icon sits at the same weight as the words
next to it. This is the one variant chosen by _what the element is_ rather than
the surface it's on, and it applies everywhere: the nav's house
(`<app-glow-button variant="icon">` or the classes directly), the project cards'
media buttons, the desk's github/envelope glyphs. **Icons are never azure and
never a colour of their own** — no ad-hoc greys, no disc of their own, no
per-icon glow opacities. `.logo-link` adds only the house's one-shot load bloom
and squash on top.

**A glass button is an object, not a word.** `<app-glow-button>` and
`.glow-sweep` treat a control as _text with light behind it_;
`<app-glass-button>` is the other kind — a pressable slab of the same frosted
material as `<app-glass-panel>`, with the panel's layers intact (rim, clear
strip, frosted interior). Its rim is where the difference lives: instead of the
cube triad haloing the control from behind, the **border carries it**, on the
same `glowSpin`/`glowCube` cycle. The colour that says "interactive" is still
there, read as a lit rim on a solid object rather than a glow escaping from
under one. Reach for it when a control should feel like a thing on the desk;
reach for `<app-glow-button>` when it should feel like a word you can say.

Its `tone` comes from the ground, exactly as a `.glow-link` variant does:
`light` (default) is the panel's white frost, for a button on a page; `dark` is
the near-black frost — the same numbers as `.glass-dark` — for a button standing
on the photograph, where nothing dims what's behind it. The rim doesn't change
between them; the cube colours read on both. Setting `link` renders the slab as
an `<a>` rather than a `<button>`, because somewhere-to-go has to be
middle-clickable and copyable.

**Text links use `.glow-sweep` — this is the canonical link style.** Every text
link (nav words, project links, the desk's labels) rests as a **gentle breathing
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

| Surface                                                    | Variant                     | Why                                                                |
| ---------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------ |
| Dark / photographic (home hero)                            | `glow-link` (base warm)     | Warm taupe letters + the cube-triad glow read as the home identity |
| Very dark, needs more lift                                 | `glow-link glow-link-dark`  | Lighter warm letters, inverted emboss                              |
| Light / neutral / frosted-glass (project cards, galleries) | `glow-link glow-link-azure` | A light azure that reads on frosted glass                          |
| Any surface, if the control is an icon                     | `glow-link glow-link-icon`  | Pale `--sweep-base` + the links' halo; icons match the words       |

Pick the variant from the background the element sits on — never mix warm and
azure on the same surface. The icon row is the exception: it wins over the
surface, so every icon on the site is the same. If you add a new surface, add a
row here.

## Color

Tokens live in the `@theme` block of `src/styles.css`. Use the token, never a
raw hex, in components.

- **Warm identity (default):** letters `rgb(163 151 141)`, cube-triad glow halo.
  The one palette accent is `--color-frenchgrey #bbb9be` (page titles, the home
  heading, the 3D-art carousel's quiet chrome).
- **The glow itself (Rubik's cube):** the halo shows three colours at all times
  — white plus two cube colours — and smoothly cycles the four top-face corner
  triads: white+orange+blue → white+orange+green → white+green+red →
  white+red+blue. Driven by the `glowCube` keyframes over `--glow-a`/`--glow-b`;
  cube colours are orange `#ff5800`, green `#009b48`, red `#c41e3a`, blue
  `#0051ba`. Every variant shares this one ring — that's what makes the glow
  read as one effect across the site.
- **Azure identity (light / frosted surfaces):** a light azure — letters
  `rgb(125 185 240)`, hover `rgb(170 210 250)`. The variant tints the glyphs
  only; the halo behind them stays the shared cube ring. Set via the
  `glow-link-azure` variant, not by hand.
- **Icon identity (every icon, every surface):** `--sweep-base`
  `rgb(165 197 222)` solid, hover white, ambient halo
  `drop-shadow(0 0 8px rgb(130 175 225 / 0.45))` →
  `0 0 13px rgb(150 190 235 / 0.8)` on hover. Defined once on `:root` +
  `.glow-link-icon`; the links' resting gradient ends on the same colour, which
  is why the two sit together.
- **Nav / header:** nav words on a frosted-glass bar, resting white→
  `--sweep-base`; the house beside them is that same pale blue, solid.
- **About-page neon (scoped to the pyramid only):** `--neon-bias #ff3131`,
  `--neon-habit #39ff14`, `--neon-sensemaking #1f8fff`, on `:root` in
  `styles.css`. Every node, thread and label on the pyramid is coloured by what
  it is, and there the colour is the meaning — so its leaf buttons glow in their
  kind's neon instead of wearing `.glow-sweep`. Its glass matches the panels:
  the same 9px frost, a clear strip, and edges breathing white→blue on the 4s
  rhythm.
- **Wordle sub-brand (scoped to the Wordle League page only):**
  `--color-wordle-green #538d4e`, `--color-wordle-gold #b59f3b`,
  `--color-wordle-bg #0f172a`. Do not use these outside that page.

The halo is a conic gradient of white + `--glow-a` + `--glow-b`, written inline
where it's painted (must reference the animated properties directly — an
intermediate custom property freezes the animation). `glowSpin` revolves it via
`--glow-angle`; `glowCube` cycles the colours.

## Typography

**The whole site is set in monospace, and that is the point.** It began on the
desk — the links on the laptop screen and the words over the cube and the
notebook are typed, because they sit on a screen in a photograph of a
programmer's desk — and it is now the app's face everywhere: an homage to the
career the site exists to describe. The glow was carrying the site's identity
alone; this is the other half of it.

One stack, `--font-mono` in the `@theme` block of `src/styles.css`, applied
through `--default-font-family`. Set it there, never per component — the desk's
projected type reads the same token, so page type and photographed type cannot
drift apart. Redefining `--font-sans` would have done the same job while making
`font-sans` a lie; don't.

**And it is all lower case.** Same origin, same idea: the desk's labels were
lowercase, and with one typewriter face and no capitals the pages read as
something typed rather than something published.
`body { text-transform: lowercase }` in `styles.css` does it for everything
rendered.

Do it there, not in the strings. Sentence case stays in the DOM, so a screen
reader still says "Wordle League", the words stay searchable and quotable, and
undoing it is one line instead of an edit to every string on the site. Two
exceptions, both because no stylesheet can reach them: **route `title`s** in
`app.routes.ts` and the `<title>` in `index.html` become the browser tab, so
those are lowercase in the source. `.keep-case` is the escape hatch for anything
that must hold its capitals — a code sample, or a name that stops being itself
in lower case.

Mono is wider and slower to read than a proportional face, so **prose has to be
kept short** — this is a typographic constraint on the writing now, not just a
styling choice. Titles `text-2xl`+, body `text-sm`–`lg`, muted secondary text at
`/70`–`/60` opacity. One weight scale; the `600` on labels and buttons is the
heaviest thing here.

## Structure & layout

- **Frosted glass** is the recurring surface, delivered by `<app-glass-panel>`:
  translucent, `backdrop-blur`, soft shadow, generous rounding on the `floating`
  variant; a full-bleed adaptive-frost bar on the `header`/`footer` variants.
  Its edge is layered and the layers are the point — reading inward: blue bloom,
  breathing white→blue stroke, a **clear untinted strip** where the fill drops
  away and the background shows straight through, then the frosted interior. The
  nav bar and the portfolio's project slabs are the same material, shaped
  differently. The tint belongs on the panel itself, never on the layer that
  spans the strip, or the strip stops being one.
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
  the transform, so design-space px become real page px. The desk reads each
  surface's placement out of the layout event and puts `.is-floating` on the
  slotted root, so the CSS answers to what the element decided rather than
  restating the manifest's breakpoint. Size floated content against the box
  (`min()` of a vw- and a vh-relative unit, then `em` off that) and give it its
  own ground: off the laptop screen there's no black panel behind the type any
  more, so the floated card brings the site's glass with it — `.glass-edge` +
  `.glass-dark`, the dark inward-drawn variant of the panel material (see "The
  frosted edge is one definition").
- **A floated surface does not clip, and that is deliberate.** `clip` in the
  manifest means "stay inside the object this was marked onto"; once floated, a
  surface has left that object, so `@image-aware/element` (0.1.1+) renders it
  unclipped — which is the only reason a floated card's bloom and drop shadow
  survive at all. The consequence is that an overflow now spills onto the
  photograph instead of being cut, so **a floated card that can overflow must
  ask for the clip back on itself** (`overflow: hidden` on the slotted element —
  its own box-shadow is unaffected). The laptop card does; the labels are two
  short words and don't need to.
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

### The frosted edge is one definition

`.glass-edge` in `styles.css` owns the site's edge: a 2px stroke that breathes
white→blue on the shared `breathe` rhythm, a soft drop shadow, and a blue bloom
that fades in as the stroke goes blue. It lives globally because two things need
the identical edge and only one of them is `<app-glass-panel>` — the desk's
floated cards can't be that component, so they wear the class directly. **Fill
is deliberately not part of it**: the panel is white frosted, the desk's cards
are dark. Edge only.

`.glass-dark` is that fill, and the pair is the panel material for anything that
can't be the component. **The desk's floated cards are glass panels in every way
that shows** — bloom, breathing stroke, transparent strip, frosted interior, in
that order — with two differences their ground forces:

- **They're darker.** Every other panel sits on a page with the desk's veil
  dropped behind it, where white frost at `0.2` is enough. These float onto the
  picture itself with nothing dimming it, so the fill is near-black
  (`rgb(8 4 5 / 0.72)`) to hold the same contrast against a bright windowsill.
- **Their layers are drawn inward.** The component stands its strip 9px _proud_
  of the panel; every surface in the manifest sets `"clip": true`, so anything
  outside the box is cut off. The fill is therefore an inner layer inset by
  `--glass-strip`, and the ring between it and the stroke is the strip.

Set `--glass-strip` per card and keep the host's padding comfortably larger than
it, or content lands on the strip instead of on the glass. The fill is on
`::after`, leaving `::before` free for whatever the card itself wants.

Two sharp edges when using it:

- The color-mix expressions are written out, not routed through a custom
  property — an intermediate property freezes the animation, the same trap as
  the glow ring's conic gradient.
- It animates, and `animation` is one property. An element that also wants its
  own animation can't have both: the desk's floated label _replaces_ its drift
  with `breathe` rather than setting `animation: none`, which would take the
  edge's rhythm with it.

## Component library (`@shared/ui`)

The design-system patterns are encapsulated as thin standalone components so the
rules above are enforced in code, not by copy-paste. **Reach for these before
writing raw markup or a bare PrimeNG control.** They wrap primitives + tokens;
they are not a general widget kit — add one only when a pattern actually
repeats.

| Component              | Selector             | Use for                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GlowButtonComponent`  | `<app-glow-button>`  | Every button. Sets the `.glow-link` treatment; pass `variant` (`warm`/`dark`/`azure`, or `icon` for any icon-only button), `label`/`icon`, `size`, `rounded`, `ariaLabel`; listen to `(onClick)`.                                                                                                                                                                                                                                                         |
| `GlassButtonComponent` | `<app-glass-button>` | A pressable slab of glass — the panel's material at button scale, with the cube triad on its rim instead of behind it. Content-projected (label, icon, or both); pass `tone` (`light`/`dark`, picked from the ground), `link` (renders an `<a>`), `type`, `disabled`, `ariaLabel`; listen to `(onClick)`. Tune `--glass-radius`, `--glass-rim`, `--glass-strip`; set layout on the host.                                                                  |
| `GlassPanelComponent`  | `<app-glass-panel>`  | The frosted-glass surface. `variant`: `floating` (default rounded white panel, e.g. the 3D-art gallery), `header`/`footer` (full-bleed adaptive-frost bar with a hairline edge). `edge`: `left`/`right` joins a floating panel to that screen edge — outer corners square and that side's stroke drops, so nothing draws a boundary where the panel leaves the screen (the project slabs). Handles its own print reset. Set layout utilities on the host. |
| `RevealDirective`      | `appReveal="left\    | Flies an element in from the side of the screen the first time it scrolls into view (the home page's alternating project entries). Goes on a **wrapper** — the wrapper is observed and stays put, its child travels. An ancestor must set `overflow-x: clip`.                                                                                                                                                                                             | Slides an element in from one side the first time it scrolls into view (the home page's alternating project entries). The parent must set `overflow-x: clip`. |

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
