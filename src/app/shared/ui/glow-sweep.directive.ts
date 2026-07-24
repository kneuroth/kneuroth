import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Drives the `.glow-sweep` letter shimmer on hover/focus: it picks one of the
 * four cube-colour groupings at random and plays a single sweep pass. Attach to
 * the swept element itself (a plain `<a class="glow-sweep">`) or to a
 * `<app-glow-button [sweep]="true">` host — either way it sets the group colours
 * (inherited down to the label) and toggles `.is-sweeping` to fire one pass.
 */
@Directive({
  selector: '[glowSweep]',
})
export class GlowSweepDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>).nativeElement;

  /** The two non-white colours of each Rubik's top-face grouping (dampened). */
  private static readonly GROUPS: readonly [string, string][] = [
    ['#ff9b66', '#6697d6'], // white, orange, blue
    ['#ff9b66', '#66c391'], // white, orange, green
    ['#66c391', '#dc7889'], // white, green, red
    ['#dc7889', '#6697d6'], // white, red, blue
  ];

  private stopped = false;
  /** The element that actually carries the swept text: a button's label, or,
   *  for a plain link, the host itself. Resolved lazily (the label renders
   *  async), then cached. */
  private targetEl?: HTMLElement;

  ngOnInit(): void {
    // Respect reduced-motion: leave the links plain, never sweep.
    if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    // animationend bubbles from the label up to the host, so listen here.
    this.el.addEventListener('animationend', this.onEnd);
    // Hover / keyboard focus fires a pass — the only trigger.
    this.el.addEventListener('mouseenter', this.onHover);
    this.el.addEventListener('focusin', this.onHover);
  }

  ngOnDestroy(): void {
    this.stopped = true;
    this.el.removeEventListener('animationend', this.onEnd);
    this.el.removeEventListener('mouseenter', this.onHover);
    this.el.removeEventListener('focusin', this.onHover);
  }

  private target(): HTMLElement {
    return (this.targetEl ??=
      (this.el.querySelector('.p-button-label') as HTMLElement | null) ??
      this.el);
  }

  /** Fire a pass now, unless one is already running. */
  private readonly onHover = (): void => {
    if (this.stopped) return;
    const t = this.target();
    if (t.classList.contains('is-sweeping')) return; // one at a time
    const [c1, c2] =
      GlowSweepDirective.GROUPS[
        Math.floor(Math.random() * GlowSweepDirective.GROUPS.length)
      ];
    t.style.setProperty('--sweep-c1', c1);
    t.style.setProperty('--sweep-c2', c2);
    // Restart the one-shot animation on the animating element.
    t.classList.remove('is-sweeping');
    void t.offsetWidth; // force reflow so the animation re-triggers
    t.classList.add('is-sweeping');
  };

  private readonly onEnd = (e: AnimationEvent): void => {
    if (e.animationName !== 'sweepOnce') return;
    const t = this.target();
    t.classList.remove('is-sweeping');
    // Back to the resting gradient until the next hover.
    t.style.removeProperty('--sweep-c1');
    t.style.removeProperty('--sweep-c2');
  };
}
