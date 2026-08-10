import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';

/** Which edge the element travels in from. */
export type RevealFrom = 'left' | 'right';

/**
 * Flies content in from the side of the screen the first time it scrolls into
 * view. Used by the home page's project list, where consecutive entries
 * alternate sides.
 *
 * **Put it on a wrapper, not on the thing that moves:**
 *
 * ```html
 * <div appReveal="left"><app-thing class="block …"></app-thing></div>
 * ```
 *
 * The wrapper is what's observed and it never moves; the child is what travels.
 * IntersectionObserver measures the *transformed* box, so if the moving element
 * were also the observed one, a card parked a viewport off to the side would
 * never report as visible and would never reveal.
 *
 * The motion itself lives in `.reveal` / `.reveal-right` / `.is-revealed` in
 * `styles.css` (a directive can't carry styles), including the reduced-motion
 * off-switch. It reveals once and then stops observing — this is an entrance,
 * not a scroll-linked effect.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    '[class.reveal]': 'true',
    '[class.reveal-right]': "from() === 'right'",
    '[class.is-revealed]': 'revealed()',
  },
})
export class RevealDirective implements OnInit, OnDestroy {
  from = input<RevealFrom>('left', { alias: 'appReveal' });

  protected readonly revealed = signal(false);

  private readonly host = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    // No IntersectionObserver (or a very short page): just show the content.
    if (typeof IntersectionObserver === 'undefined') {
      this.revealed.set(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          this.revealed.set(true);
          this.disconnect();
        }
      },
      // Fire a little before the element's edge clears the fold, so the slide
      // is already underway when it becomes properly visible.
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  private disconnect(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }
}
