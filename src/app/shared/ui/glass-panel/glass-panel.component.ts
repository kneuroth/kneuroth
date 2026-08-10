import { Component, input } from '@angular/core';

/** How the glass surface presents. See DESIGN.md. */
export type GlassVariant = 'floating' | 'header' | 'footer';

/** Which screen edge the panel is joined to, if any. See DESIGN.md. */
export type GlassEdge = 'none' | 'left' | 'right';

/**
 * The frosted-glass surface — the site's signature material.
 *
 * - `floating` (default): content floats on translucent, blurred white with a
 *   soft all-around shadow and rounded corners (the resume panel). Its edge is
 *   layered — frosted glass, a lighter un-blurred band, then a blue-white
 *   stroke — see `.glass` below.
 * - `header` / `footer`: a full-bleed bar with square edges and a single
 *   hairline on the content edge. A darkened (smokey) frost gives the light nav
 *   a consistent backing over both dark hero photos and pale pages.
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
      <div class="glass" aria-hidden="true"></div>
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
      border-radius: 1.5rem;
    }

    /* The frosted surface — translucent fill + soft shadow + border, on one
       layer below content. It sits a few px PROUD of the blurred host (inset is
       negative), so a lighter, un-blurred band of the tint shows between the
       frosted interior and the border. Reading from the edge inward: blue-white
       stroke → lighter transparent layer → frosted glass. The edge is static;
       the border colour + a blue glow ride the links' shared breathe, mixing
       white->blue by --breathe (inverted: higher = whiter) -- identical rhythm
       and blue to the text links. */
    .glass {
      position: absolute;
      inset: -7px;
      z-index: -1;
      pointer-events: none;
      border-radius: calc(1.5rem + 6px);
      background: rgb(255 255 255 / 0.2);
      /* Drop shadow, plus a blue bloom that fades in as the border goes blue
         (color-mix on --breathe, inlined so box-shadow repaints cleanly). */
      box-shadow:
        0 10px 40px rgb(0 0 0 / 0.18),
        0 0 12px
          color-mix(
            in srgb,
            transparent,
            rgb(120 165 215 / 0.7) calc(100% - var(--breathe, 80%))
          );
      border: 2px solid
        color-mix(
          in srgb,
          rgb(255 255 255 / 0.6),
          rgb(165 197 222 / 0.6) calc(100% - var(--breathe, 80%))
        );
      animation: breathe 4s ease-in-out infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      .glass {
        animation: none;
      }
    }

    /* Joined to a screen edge: the two outer corners square off, the .glass layer
       stops at the host's edge instead of standing 7px proud of it, and that
       side's stroke drops — so nothing draws a boundary where the panel runs off
       the screen. The inner side keeps the full layered edge. */
    :host(.is-bleed-left) {
      border-radius: 0 1.5rem 1.5rem 0;
    }
    :host(.is-bleed-left) .glass {
      inset: -7px -7px -7px 0;
      border-radius: 0 calc(1.5rem + 6px) calc(1.5rem + 6px) 0;
      border-left-width: 0;
    }

    :host(.is-bleed-right) {
      border-radius: 1.5rem 0 0 1.5rem;
    }
    :host(.is-bleed-right) .glass {
      inset: -7px 0 -7px -7px;
      border-radius: calc(1.5rem + 6px) 0 0 calc(1.5rem + 6px);
      border-right-width: 0;
    }

    /* Footer bar: darkened smokey frost, full-bleed, hairline on the content
       edge — a consistent dark backing so the light nav reads on every page. */
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
       breathing white→blue edge. Colours inherit the base .glass; the caller
       insets it horizontally (see header.component). */
    :host(.is-header) {
      -webkit-backdrop-filter: blur(10px) saturate(1.1);
      backdrop-filter: blur(10px) saturate(1.1);
      border-radius: 0 0 1rem 1rem;
    }
    :host(.is-header) .glass {
      inset: -6px;
      border-radius: 0 0 calc(1rem + 6px) calc(1rem + 6px);
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
