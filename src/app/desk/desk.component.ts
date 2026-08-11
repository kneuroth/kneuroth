import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ErrorEventDetail, LayoutEventDetail } from '@image-aware/angular';
import { GlassButtonComponent } from '@shared/ui/glass-button/glass-button.component';
import { GlowSweepDirective } from '@shared/ui/glow-sweep.directive';
import { DeskService } from './desk.service';

/**
 * The desk — the photograph the whole site is built on.
 *
 * `opportunities.jpg` is fixed behind every page, and on the home route it is
 * the page: `<image-surface>` projects real, live DOM onto the flat surfaces
 * marked in `public/opportunities.surfaces.json`, angled to match the shot, so
 * the introduction is written on the window and the cube on the sill is the way
 * through to the projects. Everywhere else the same photo drops behind a veil
 * and goes back to being scenery.
 *
 * Mounted once in the app shell so navigating never rebuilds it.
 *
 * `<image-surface>` is a custom element, not an Angular component — Angular
 * binds to it directly and CUSTOM_ELEMENTS_SCHEMA tells the template compiler
 * the tag is intentional. It's registered in `app.config.ts` via
 * `provideImageAware()`.
 */
@Component({
  selector: 'app-desk',
  imports: [RouterLink, GlowSweepDirective, GlassButtonComponent],
  templateUrl: './desk.component.html',
  styleUrl: './desk.component.css',
  host: {
    '[class.is-live]': 'live()',
  },
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
})
export class DeskComponent {
  /** True on the one page that *is* the desk: the veil lifts and the surfaces
      carry their content. */
  readonly live = input(false);

  private readonly desk = inject(DeskService);

  /** Ids of the surfaces the manifest is currently floating rather than
      projecting. See `onLayout`. */
  protected readonly floating = signal<ReadonlySet<string>>(new Set());

  /**
   * The veil lifts only when the desk is actually usable as the interface. On a
   * portrait phone the manifest stops projecting and the home page falls back to
   * an ordinary panel — which needs the photo dimmed behind it like every other
   * page, not the bright room.
   */
  protected readonly lifted = computed(
    () => this.live() && this.desk.projecting(),
  );

  /**
   * Whether the surfaces are being projected is a media decision made inside the
   * manifest, so it's reported from the layout the element actually computed —
   * never re-derived from a breakpoint written a second time in CSS.
   */
  protected onLayout(event: Event): void {
    const { layout } = (event as CustomEvent<LayoutEventDetail>).detail;
    this.desk.projecting.set(
      layout.surfaces.some((surface) => surface.placement === 'projected'),
    );
    // A placement that isn't one of the string keywords is a floating rect: the
    // surface keeps its box but loses the transform, so its content is suddenly
    // being laid out in real page pixels instead of design space. That's a
    // different stylesheet, and this is how it gets told — reading what the
    // element decided, rather than restating the manifest's breakpoint in CSS
    // where the two would drift apart.
    this.floating.set(
      new Set(
        layout.surfaces
          .filter((surface) => typeof surface.placement !== 'string')
          .map((surface) => surface.id),
      ),
    );
  }

  /**
   * A manifest that won't load or parse means there are no surfaces to click,
   * which would leave the home page with nothing on it at all. Report it as "not
   * projecting" so the ordinary panel takes over — the same fallback a phone
   * gets.
   */
  protected onError(event: Event): void {
    const { error } = (event as CustomEvent<ErrorEventDetail>).detail;
    console.error('[desk] the photo could not be projected', error);
    this.desk.projecting.set(false);
  }
}
