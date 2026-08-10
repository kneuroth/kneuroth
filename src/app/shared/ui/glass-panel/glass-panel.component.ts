import { Component, input } from '@angular/core';

/** How the glass surface presents. See DESIGN.md. */
export type GlassVariant = 'floating' | 'header' | 'footer';

/** Which screen edge the panel is joined to, if any. See DESIGN.md. */
export type GlassEdge = 'none' | 'left' | 'right';

/**
 * The frosted-glass surface — the site's signature material.
 *
 * - `floating` (default): content floats on translucent, blurred white with a
 *   soft all-around shadow and rounded corners (the 3D-art gallery, the
 *   portfolio's project slabs). Its edge is layered — frosted glass, a clear
 *   untinted strip, then a blue-white stroke — see `.glass` below.
 * - `header`: the floating variant's white frost, squared off at the top and
 *   flush to it, so the bar reads as pulled down from the screen edge.
 * - `footer`: a full-bleed bar with square edges, a single hairline on the
 *   content edge, and a near-black frost of its own — a consistent dark backing
 *   over both dark hero photos and pale pages.
 *
 * `edge` joins a `floating` panel to a screen edge (the home page's project
 * slabs): the outer corners square off and that side's stroke drops, so the
 * panel reads as continuing past the viewport instead of floating in from it.
 * The caller is responsible for actually putting the host against the edge — the
 * panel only stops pretending to have an outer boundary.
 *
 * In print it flattens to a clean white sheet. Set layout utilities
 * (max-width, padding, margin) on the host from the caller.
 */
@Component({
  selector: 'app-glass-panel',
  template: `
    @if (variant() !== 'footer') {
      <!-- The breathing surface: translucent fill, drop shadow and one border,
           behind the projected content. It scales as a unit so the whole panel
           appears to inhale, while the content — in the host's normal flow —
           never moves. Never interactive. -->
      <div class="glass glass-edge" aria-hidden="true"></div>
    }
    <ng-content></ng-content>
  `,
  host: {
    '[class.is-header]': "variant() === 'header'",
    '[class.is-footer]': "variant() === 'footer'",
    '[class.is-bleed-left]': "edge() === 'left'",
    '[class.is-bleed-right]': "edge() === 'right'",
  },
  styles: `
    /* The blur stays on the host (its backdrop is the page behind the panel);
       only the tint/shadow/border scale, on the .glass layer. Keeping the blur
       here avoids the backdrop-filter-vs-scaling glitch and reads identically. */
    :host {
      display: block;
      position: relative;
      -webkit-backdrop-filter: blur(9px) saturate(1.15);
      backdrop-filter: blur(9px) saturate(1.15);
      background: rgb(255 255 255 / 0.2);
      border-radius: 1.5rem;
    }

    /* The edge — soft shadow + border, on one layer below content. It sits 9px
       PROUD of the host (inset is negative) and carries NO fill of its own, so
       the 9px it stands clear of the frosted interior is a moat: unblurred,
       untinted, the background showing straight through. Reading from the edge
       inward: blue-white stroke → transparent strip → frosted glass. That's the
       same layered edge <app-inner-glass-panel> draws, which is why the nested
       card can be nothing but its own moat and fill.

       The fill deliberately lives on the host, not here: spanning both regions
       it would tint the moat as well, and the strip would then read as "strip"
       only where the blur behind it happens to differ from the sharp background
       — over the desk photograph, nowhere at all.

       The edge is static; the border colour + a blue glow ride the links'
       shared breathe, mixing white->blue by --breathe (inverted: higher =
       whiter) -- identical rhythm and blue to the text links. Stroke, bloom and
       that animation come from the shared .glass-edge class in styles.css — the
       desk's floated panels wear the same one, so the site has a single
       definition of its frosted edge. This layer adds only where it sits. */
    .glass {
      position: absolute;
      inset: -9px;
      z-index: -1;
      pointer-events: none;
      border-radius: calc(1.5rem + 8px);
    }

    /* Joined to a screen edge: the two outer corners square off, the .glass
       layer stops at the host's edge instead of standing proud of it, and that
       side's stroke drops — nothing draws a boundary where the panel runs off
       the screen, the same way the nav bar's top edge just leaves. The three
       remaining sides keep the full layered edge. */
    :host(.is-bleed-left) {
      border-radius: 0 1.5rem 1.5rem 0;
    }
    :host(.is-bleed-left) .glass {
      inset: -9px -9px -9px 0;
      border-radius: 0 calc(1.5rem + 8px) calc(1.5rem + 8px) 0;
      border-left-width: 0;
    }

    :host(.is-bleed-right) {
      border-radius: 1.5rem 0 0 1.5rem;
    }
    :host(.is-bleed-right) .glass {
      inset: -9px 0 -9px -9px;
      border-radius: calc(1.5rem + 8px) 0 0 calc(1.5rem + 8px);
      border-right-width: 0;
    }

    /* Footer bar: near-black frost, full-bleed, hairline on the content edge —
       a consistent dark backing so light content reads on every page. */
    :host(.is-footer) {
      background: rgb(12 6 7 / 0.45);
      -webkit-backdrop-filter: blur(10px) saturate(1.1);
      backdrop-filter: blur(10px) saturate(1.1);
      border-radius: 0;
      box-shadow: none;
      border-top: 1px solid rgb(187 185 190 / 0.1);
    }

    /* Header bar: the white frosted .glass of the floating variant, but with its
       TOP corners squared and sitting flush to the top of the screen, so it
       reads as pulled down from the top rather than floating free. Only the top
       band/border runs off-screen above; the sides + rounded bottom show the
       breathing white→blue edge and its clear strip. Colours inherit the base
       host; the caller insets it horizontally (see header.component). */
    :host(.is-header) {
      -webkit-backdrop-filter: blur(10px) saturate(1.1);
      backdrop-filter: blur(10px) saturate(1.1);
      border-radius: 0 0 1rem 1rem;
    }
    :host(.is-header) .glass {
      inset: -8px;
      border-radius: 0 0 calc(1rem + 8px) calc(1rem + 8px);
    }

    @media print {
      :host {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
        -webkit-backdrop-filter: none !important;
        backdrop-filter: none !important;
        border-radius: 0 !important;
      }
      .glass {
        display: none !important;
      }
    }
  `,
})
export class GlassPanelComponent {
  variant = input<GlassVariant>('floating');
  edge = input<GlassEdge>('none');
}
