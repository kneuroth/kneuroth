import { Component } from '@angular/core';

/**
 * A section label on a dark/glass surface — the recurring resume heading
 * (About me, Education, …). Muted white on screen, dark ink in print.
 * Project content between the tags: `<app-section-heading>About me</app-section-heading>`.
 */
@Component({
  selector: 'app-section-heading',
  host: { class: 'text-lg text-white/90 print:text-gray-900' },
  template: `<ng-content></ng-content>`,
})
export class SectionHeadingComponent {}
