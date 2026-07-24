# Design system — "Embossed Glow"

The visual language for kneuroth.github.io. This is the source of truth; when a
component and this document disagree, the component is the bug. Keep it short —
if a rule here stops matching the site, fix one of them.

## The thesis

One idea carries the whole site: **light passing through frosted glass.** Content
sits on translucent panels over dimmed photographs (the Buffalo skyline, the
"opportunities" hero). Interactive things don't look like buttons — they look
like **embossed words with a colored light glowing behind them.** That glow is
the signature. Everything else stays quiet so it can shine.

## The one rule for interactive elements

**Every clickable thing uses `.glow-link`.** Nav links, contact links, project
links, icon buttons, download/print controls — all of them. No bare PrimeNG
buttons, no one-off `hover:scale-*` classes, no ad-hoc link colors. The class
lives in `src/styles.css` and works on a plain `<a>` or, via the PrimeNG bridge,
on a `<p-button styleClass="glow-link …">`.

The house logo (`.logo-link`) is the same language at a larger, circular scale —
it is the glow rule applied to the brand mark, not an exception to it.

**Text links use `.glow-sweep` — this is the canonical link style.** Every text
link (nav words, resume + project links) rests as a **gentle breathing white→blue
gradient** clipped to the letters (bottom background layer + the `breathe`
animation drifting `--breathe`). On **hover/focus** the `glowSweep` directive
picks one of the four cube groupings at random and fires a single snappy sweep
(the top band layer, `--sweep-c1`/`--sweep-c2` + `.is-sweeping`) with a
colour-tracking glow. There is **no ambient/random sweep** — hover is the only
trigger. On `<app-glow-button>`, pass `[sweep]="true"` and add `glowSweep`; on a
plain `<a class="glow-sweep">`, just add `glowSweep`. Icon-only action buttons
keep the rotating ring; text links sweep.

### Variant selection is by surface, not by mood

| Surface | Variant | Why |
| --- | --- | --- |
| Dark / photographic (home hero) | `glow-link` (base warm) | Warm taupe letters + the cube-triad glow read as the home identity |
| Very dark, needs more lift | `glow-link glow-link-dark` | Lighter warm letters, inverted emboss |
| Light / neutral / frosted-glass (resume, portfolio cards) | `glow-link glow-link-azure` | A light azure that reads on the resume glass; the resume's identity |

Pick the variant from the background the element sits on — never mix warm and
azure on the same surface. If you add a new surface, add a row here.

## Color

Tokens live in the `@theme` block of `src/styles.css`. Use the token, never a
raw hex, in components.

- **Warm identity (default):** letters `rgb(163 151 141)`, cube-triad glow halo.
  Palette accents: `--color-brownsugar #b75f3d`, `--color-glacier #6886b2`,
  `--color-charcoal #3b404d`, `--color-frenchgrey #bbb9be`, `--color-smokey
  #0c0607`.
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
- Don't add numbered markers, eyebrows, or dividers unless the content is
  genuinely a sequence (the Wordle League timeline earns its ordering; a list of
  links does not).

## Motion

- Interactive glow: slow ambient revolve always, neon bloom on hover/focus. This
  is handled by `.glow-link` — don't re-invent per component.
- One-shot page-load flourishes are allowed but rationed (the logo's squash +
  bloom on the home page). One orchestrated moment per page, not scattered
  effects.
- **`prefers-reduced-motion` is honored** — every animation added must have a
  reduced-motion off-switch, matching the pattern already in `styles.css`.

## Component library (`@shared/ui`)

The design-system patterns are encapsulated as thin standalone components so the
rules above are enforced in code, not by copy-paste. **Reach for these before
writing raw markup or a bare PrimeNG control.** They wrap primitives + tokens;
they are not a general widget kit — add one only when a pattern actually repeats.

| Component | Selector | Use for |
| --- | --- | --- |
| `GlowButtonComponent` | `<app-glow-button>` | Every button. Sets the `.glow-link` treatment; pass `variant` (`warm`/`dark`/`azure`), `label`/`icon`, `size`, `rounded`, `ariaLabel`; listen to `(onClick)`. |
| `SectionHeadingComponent` | `<app-section-heading>` | A labelled section on a dark/glass surface (the resume headings). Content-projected. |
| `GlassPanelComponent` | `<app-glass-panel>` | The frosted-glass surface. `variant`: `floating` (default rounded white panel, e.g. the resume), `header`/`footer` (full-bleed adaptive-frost bar with a hairline edge). Handles its own print reset. Set layout utilities on the host. |

Conventions for this layer:

- **Standalone, signal inputs, one folder per component** under `src/app/shared/ui/`.
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
