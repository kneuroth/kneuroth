import { Component } from '@angular/core';
import { HeaderComponent } from '@app/header/header.component';

/**
 * Blank on purpose — the nav needs somewhere to point, and nothing is written
 * yet. The notebook on the desk carries the same word.
 */
@Component({
  selector: 'app-blog',
  imports: [HeaderComponent],
  templateUrl: './blog.component.html',
  standalone: true,
  styles: `
    /* Hold full height so the page reads as a page rather than a header
       floating on the desk. */
    :host {
      display: block;
      min-height: 100vh;
    }
  `,
})
export class BlogComponent {}
