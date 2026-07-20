import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  template: `<i
    class="pi pi-home text-charcoal"
    [style.font-size.px]="size()"
    aria-label="Home"
  ></i>`,
})
export class LogoComponent {
  size = input(28);
}
