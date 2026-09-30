import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ErrorEventDetail, LayoutEventDetail } from '@image-aware/angular';
import { GlassButtonComponent } from '@shared/ui/glass-button/glass-button.component';
import { GlowSweepDirective } from '@shared/ui/glow-sweep.directive';
import { DeskService } from './desk.service';

type SurfaceLayout = LayoutEventDetail['layout']['surfaces'][number];

/** The name hint's size in design px, before the laptop's own scale. */
const HINT_PX = 12.6;
/** Smallest it gets on screen, however far the laptop is minified. */
const HINT_MIN_PX = 11;
/** Design px between the bottom of the name and the top of the hint. */
const HINT_GAP = 6;

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

  /** The laptop as the element last laid it out. */
  private readonly laptop = signal<SurfaceLayout | null>(null);
  private readonly laptopName =
    viewChild<ElementRef<HTMLElement>>('laptopName');
  /** Webfonts move the name once they land; this re-measures it when they do. */
  private readonly fontsReady = signal(false);

  constructor() {
    document.fonts?.ready.then(() => this.fontsReady.set(true));
  }

  /**
   * Where the "(click for 'about')" hint goes, in screen px — or null when it
   * shouldn't be drawn out here.
   *
   * The hint deliberately does NOT live on the laptop surface while that's
   * projected: everything slotted there is tilted by the surface's matrix3d,
   * and the hint should stand upright, floating in front of the screen like the
   * portfolio and blog labels rather than printed on it. So it's drawn in the
   * desk's own flat layer instead, and this finds its spot by taking the point
   * just under "Kelly" in design space — offsets ignore transforms, so they
   * *are* design space — through that same matrix to where it lands on screen.
   * Its size follows the laptop's scale, so it stays in proportion to the name.
   *
   * Floated, the card is already upright and the hint sits inside it (see the
   * template), so this steps aside.
   */
  protected readonly nameHint = computed(() => {
    this.fontsReady();
    const laptop = this.laptop();
    const name = this.laptopName()?.nativeElement;
    if (!this.live() || !name || laptop?.placement !== 'projected') return null;
    if (!laptop.ok) return null;

    const u = name.offsetLeft + name.offsetWidth / 2;
    const v = name.offsetTop + name.offsetHeight + HINT_GAP;
    const p = new DOMMatrix(laptop.matrix3d).transformPoint(new DOMPoint(u, v));
    return {
      x: p.x / p.w,
      y: p.y / p.w,
      size: Math.max(HINT_MIN_PX, HINT_PX * laptop.scale),
    };
  });

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
    this.laptop.set(
      layout.surfaces.find((surface) => surface.id === 'laptop') ?? null,
    );
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
