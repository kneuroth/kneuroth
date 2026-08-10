import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeskService } from '@app/desk/desk.service';
import { GlassPanelComponent } from '@shared/ui/glass-panel/glass-panel.component';
import { GlowSweepDirective } from '@shared/ui/glow-sweep.directive';

/**
 * The home page is the desk — the photograph mounted in the app shell — so on a
 * screen that can hold it this component renders nothing at all.
 *
 * It exists for the screens that can't: when the manifest stops projecting the
 * surfaces, the introduction and the links they carried have to be said in
 * ordinary markup instead.
 */
@Component({
  selector: 'app-home',
  imports: [RouterLink, GlassPanelComponent, GlowSweepDirective],
  templateUrl: './home.component.html',
  standalone: true,
})
export class HomeComponent {
  protected readonly projecting = inject(DeskService).projecting;
}
