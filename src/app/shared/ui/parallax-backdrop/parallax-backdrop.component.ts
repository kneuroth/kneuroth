import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
  input,
} from '@angular/core';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * The site's photographic backdrop — one tall column of images behind a fixed
 * viewport-sized window, travelling slower than the page.
 *
 * The images are stacked, not crossfaded: you scroll *down through* the scene,
 * arriving at the last image as you reach the bottom of the page. Consecutive
 * images overlap by `blendViewports` with the lower one's top edge masked to
 * transparent, so the join is a soft handoff over a band rather than a ruled
 * line — a seam treatment, not a dissolve; each image is fully itself for
 * almost all of its run.
 *
 * The column's travel is a fraction of document scroll progress rather than a
 * fixed rate, so its bottom lands exactly at the viewport's bottom on any page
 * length — the parallax can never run out of image. A dark veil over the column
 * keeps the frosted panels legible on every photograph.
 *
 * Scroll is read on a rAF-throttled passive listener outside Angular: this is
 * pure paint and must never trigger change detection.
 */
@Component({
  selector: 'app-parallax-backdrop',
  template: `
    <div class="column" aria-hidden="true">
      @for (src of images(); track $index) {
        <div class="pane" [style.background-image]="'url(' + src + ')'"></div>
      }
    </div>
    <div class="veil" aria-hidden="true"></div>
  `,
  styles: `
    /* The window onto the scene: fixed behind everything, never takes a click. */
    :host {
      display: block;
      position: fixed;
      inset: 0;
      z-index: -10;
      overflow: hidden;
      pointer-events: none;
    }

    /* The scene itself. --shift is written from script each frame; the fallbacks
       here are what shows for the one frame before the first measurement. */
    .column {
      position: absolute;
      inset: 0 0 auto 0;
      transform: translate3d(0, var(--shift, 0px), 0);
      will-change: transform;
    }

    .pane {
      height: var(--pane-h, 115vh);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      backface-visibility: hidden;
    }

    /* The seam: each image after the first rides up over the one above it and
       fades in from transparent across the overlap, so the two meet in a band
       instead of at an edge. */
    .pane + .pane {
      margin-top: calc(-1 * var(--blend, 14vh));
      -webkit-mask-image: linear-gradient(
        to bottom,
        transparent 0,
        #000 var(--blend, 14vh)
      );
      mask-image: linear-gradient(
        to bottom,
        transparent 0,
        #000 var(--blend, 14vh)
      );
    }

    /* Keeps the frosted panels legible over every photograph. */
    .veil {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgb(10 22 40 / 0.42),
        rgb(10 22 40 / 0.58)
      );
    }

    /* No travel — the first image, held still. */
    @media (prefers-reduced-motion: reduce) {
      .column {
        transform: none;
      }
    }

    @media print {
      :host {
        display: none;
      }
    }
  `,
})
export class ParallaxBackdropComponent implements OnInit, OnDestroy {
  /** The scene, top of the page first. Paths resolve against the base-href. */
  images = input.required<string[]>();
  /** Height of each image, in viewports. Above 1 so each one over-fills. */
  paneViewports = input(1.15);
  /** How much of a viewport consecutive images overlap and blend across. */
  blendViewports = input(0.14);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private frame = 0;

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
    });
    this.apply();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    cancelAnimationFrame(this.frame);
  }

  /** Coalesce a burst of scroll events into one write per frame. */
  private readonly onScroll = () => {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.apply());
  };

  private apply(): void {
    const vh = window.innerHeight;
    const paneH = this.paneViewports() * vh;
    const blend = this.blendViewports() * vh;
    const panes = Math.max(1, this.images().length);

    // The overlaps shorten the column, so they come off the total.
    const columnH = panes * paneH - (panes - 1) * blend;
    const travel = Math.max(0, columnH - vh);

    // Progress through the document, so the column's bottom arrives exactly as
    // the page's does. Guard a page shorter than the viewport.
    const scrollable = Math.max(1, document.documentElement.scrollHeight - vh);
    const q = clamp01(window.scrollY / scrollable);

    const el = this.host.nativeElement as HTMLElement;
    el.style.setProperty('--pane-h', `${paneH}px`);
    el.style.setProperty('--blend', `${blend}px`);
    el.style.setProperty('--shift', `${-q * travel}px`);
  }
}
