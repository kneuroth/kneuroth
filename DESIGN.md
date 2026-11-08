# Design — kneuroth.github.io

The components, colour, type and motion rules live in kneuroth-ui's
[DESIGN.md](../kneuroth-ui/DESIGN.md) — read that first. This file is only what
belongs to this site: the desk, and how its pages are laid out.

## The desk

**The whole site stands on one photograph.** `opportunities.jpg` — the laptop on
the windowsill — is fixed behind every page, mounted once in the layout
(`src/desk/`) so navigating slides panels over the room instead of rebuilding
it. There's no per-page backdrop. Off the home route a veil drops over the photo
so frosted panels read against it.

**On the home route the photograph is the interface.** The veil lifts and
`<ImageSurface>` (`@image-aware/react`) projects real DOM onto the surfaces
marked in `public/opportunities.surfaces.json` (beside the photo, where the
editor saves it), angled to match the shot:

| Surface                 | Carries                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| `laptop`                | "Hello, I'm Kelly" (the name links to `/about`), github, email                                                |
| `cube-teal`, `cube-red` | The Rubik's cube — decorative duplicates of the portfolio link                                                |
| `cube-label`            | `portfolio`, the cube's real link                                                                             |
| `notebook`              | Decorative duplicate of the research link, lit pale blue                                                      |
| `notebook-label`        | `research` (the research wall, off-site); floated on a phone, a stack of glass buttons: research, blog, about |
| `keyboard`              | Decorative duplicate of the blog link; unlit at rest, a dim grey on hover (it's empty)                        |
| `keyboard-label`        | `blog`, pending                                                                                               |

The home page has **no header**: the cube is the way through to the rest of the
site. Other pages' headers carry Portfolio, Research, Blog and About — Research
leaves the site, in a new tab.

Rules:

- **The manifest owns the surface list.** Slot names are surface ids; re-marking
  the photo with the image-aware editor (`pnpm mark`) can rename or drop them.
  After re-marking, check every `slot` in `desk.tsx` and the design-space sizes
  in `desk.css`.
- **Projected content is written in design space**, raw `px` (laptop 490×363,
  notebook page 392×56) — never rem.
- **Framing is art direction in the manifest** (`variants`: crop, object
  position, projected / floated / dropped), not CSS.
- **A floated surface is a different stylesheet.** It keeps its box but loses
  the transform; `desk.tsx` reads each surface's placement from the layout event
  and sets `.is-floating`. Size floated content off the box (`min()` of a vw and
  a vh unit, then em). A floated card brings its own glass (`.glass-edge` +
  `.glass-dark`) and, if it can overflow, clips itself.
- **Projecting is reported, never guessed.** `useDesk().projecting` comes from
  the element's own layout/error events (`null` until the first one). Home falls
  back to an ordinary panel only when it's `false`.
- **Touch gets a beacon.** Under `hover: none` the lit objects breathe to full
  every few seconds, since nothing tells a touch user they're interactive.

## Layout

- **Three featured projects lead the portfolio, and zig-zag**: joined to
  alternate screen edges (`GlassPanel edge`), mirrored so the words stay against
  the edge and the thumbnails face the middle, each flying in from its own edge
  (`Reveal`). Not in a centred container. Keep the alternation unbroken.
- **Everything else is a quieter list below them**: slim floating panels in a
  centred column, small tiles in a row, no entrance — the fly-in belongs to the
  three.
- **A project's heading is its link**: to its page on this site if it has one,
  else the live project. The icon buttons stay as well.
- **Thumbnails are a lead tile with the rest stacked beside it**, at most three.
  Cover vs contain is decided from each image's own dimensions — don't hand-tag
  entries.
- **A project with a page of its own lives at `/portfolio/<name>`**, linked from
  its card by an arrow icon button.
- **Wordle League** is a timeline: one hairline down the page, a glyph marker
  per chapter, each chapter a floating panel arriving once from alternating
  sides. It earns the ordering because it's genuinely a sequence; nothing else
  on the site is numbered or timelined.
- **3D art** is one glass card around a native scroll-snap track, paged by two
  icon buttons; prints are `contain` at a fixed height so the row stays level.
- The site isn't designed for print.

## The about page

`kelly.json` as a glass pyramid: one face per thing, named under its bottom
edge, its categories on the glass — sense-making at the top, habits bottom left,
biases bottom right — and the exact leaves clustered round them, joined by
straight lines. Each thing opens a sentence under its face ("when approaching a
problem"); choosing a category or leaf finishes it there.

- **Here the colour is the meaning.** Every node, thread and label is coloured
  by what it is: `--neon-bias #ff3131`, `--neon-habit #39ff14`,
  `--neon-sensemaking #1f8fff`. So its buttons glow in their kind's neon instead
  of wearing `.glow-sweep`, each on a small dark tag so the neon holds over the
  frost. Nothing else on the site uses these colours.
- Its glass matches the panels: the same frost, edges breathing white→blue on
  the 4s rhythm. The ✕ that clears a choice is the ordinary icon button.
- Drag turns it, wheel or pinch zooms, arrow keys step face to face; it opens on
  a random leaf's pathway. A screen-reader copy of the sentence is announced as
  it changes.
