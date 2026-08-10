import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  // No colour of its own: it takes currentColor from the .glow-link variant on
  // the link around it, so the house matches the site's other icon buttons
  // wherever it's placed. The link carries the label; the glyph is decorative.
  template: `<i
    class="pi pi-home"
    [style.font-size.px]="size()"
    aria-hidden="true"
  ></i>`,
})
export class LogoComponent {
  size = input(28);
}
