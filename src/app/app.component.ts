import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map } from 'rxjs';
import { DeskComponent } from './desk/desk.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, DeskComponent],
  templateUrl: './app.component.html',
  standalone: true,
})
export class AppComponent {
  private readonly router = inject(Router);

  /**
   * The home route isn't a page over the desk — it *is* the desk. Everywhere
   * else the photo drops behind its veil, so the shell tracks which of the two
   * we're on rather than each page declaring it.
   */
  readonly onDesk = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url.split('?')[0] === '/'),
    ),
    { initialValue: true },
  );
}
