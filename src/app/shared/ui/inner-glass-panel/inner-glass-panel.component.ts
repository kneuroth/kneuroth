import { Component } from '@angular/core';

/**
 * A nested glass card — for panels that sit *inside* an `<app-glass-panel>`
 * (the resume's skills, education, experience and project cards). Where the
 * outer panel is the frosted sheet, this is a lighter secondary surface layered
 * on top.
 *
 * Its edge is layered like the outer panel: a hairline border, then a
 * transparent strip (a moat where the fill drops away, letting the glass behind
 * show straight through), then the faint translucent fill the content sits on.
 *
 * Owns only the card chrome. Leave border-radius and layout (margins, col-span,
 * flex, width, responsive corner-flattening like `sm:rounded-l-none`) to
 * Tailwind classes on the host; the fill inherits those corners so it tracks
 * them. Flattens to a clean hairline in print.
 */
@Component({
  selector: 'app-inner-glass-panel',
  template: `<div class="fill"><ng-content></ng-content></div>`,
  styles: `
    /* Host = the outline + the transparent strip (its padding). The bg is left
       transparent so the strip shows the panel behind, not this card's fill. */
    :host {
      display: block;
      background: transparent;
      border: 1px solid rgb(255 255 255 / 0.2);
      padding: 4px;
    }

    /* The fill the content actually sits on — inset by the strip, corners
       tracking the host so flattened sides (sm:rounded-*-none) stay flat. */
    .fill {
      height: 100%;
      padding: 0.75rem;
      background: rgb(255 255 255 / 0.05);
      border-radius: inherit;
    }

    @media print {
      :host {
        background: transparent !important;
        border-color: #d1d5db !important;
        padding: 0 !important;
      }
      .fill {
        background: transparent !important;
      }
    }
  `,
})
export class InnerGlassPanelComponent {}
