import { Component } from '@angular/core';
import { HeaderComponent } from '@app/header/header.component';
import { GlassPanelComponent } from '@shared/ui/glass-panel/glass-panel.component';

/**
 * A placeholder — the nav needs somewhere to point, and nothing is written yet,
 * so it says as much. The notebook on the desk glows grey to match.
 */
@Component({
  selector: 'app-blog',
  imports: [HeaderComponent, GlassPanelComponent],
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
