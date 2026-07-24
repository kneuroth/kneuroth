import { Component, input } from '@angular/core';

/** How the glass surface presents. See DESIGN.md. */
export type GlassVariant = 'floating' | 'header' | 'footer';

/**
 * The frosted-glass surface — the site's signature material.
 *
 * - `floating` (default): content floats on translucent, blurred white with a
 *   soft all-around shadow and rounded corners (the resume panel).
 * - `header` / `footer`: a full-bleed bar with square edges and a single
 *   hairline on the content edge. A darkened (smokey) frost gives the light nav
 *   a consistent backing over both dark hero photos and pale pages.
 *
 * In print it flattens to a clean white sheet. Set layout utilities
 * (max-width, padding, margin) on the host from the caller.
 */
@Component({
  selector: 'app-glass-panel',
  template: `<ng-content></ng-content>`,
  host: {
    '[class.is-header]': "variant() === 'header'",
    '[class.is-footer]': "variant() === 'footer'",
  },
  styles: `
    :host {
      display: block;
      background: rgb(255 255 255 / 0.32);
      -webkit-backdrop-filter: blur(16px) saturate(1.2);
      backdrop-filter: blur(16px) saturate(1.2);
      border-radius: 1.5rem;
      box-shadow: 0 10px 40px rgb(0 0 0 / 0.18);
    }

    /* Bars: darkened smokey frost, full-bleed, hairline on the content edge —
       a consistent dark backing so the light nav reads on every page. */
    :host(.is-header),
    :host(.is-footer) {
      background: rgb(12 6 7 / 0.45);
      -webkit-backdrop-filter: blur(10px) saturate(1.1);
      backdrop-filter: blur(10px) saturate(1.1);
      border-radius: 0;
      box-shadow: none;
    }
    :host(.is-header) {
      border-bottom: 1px solid rgb(187 185 190 / 0.1);
    }
    :host(.is-footer) {
      border-top: 1px solid rgb(187 185 190 / 0.1);
    }

    @media print {
      :host {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
        -webkit-backdrop-filter: none !important;
        backdrop-filter: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
    }
  `,
})
export class GlassPanelComponent {
  variant = input<GlassVariant>('floating');
}
