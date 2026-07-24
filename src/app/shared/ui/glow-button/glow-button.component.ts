import { Component, computed, input, output } from '@angular/core';
import { Button } from 'primeng/button';

/** Glow palette — pick by the surface the button sits on (see DESIGN.md). */
export type GlowVariant = 'warm' | 'dark' | 'azure';

/**
 * The site's one button. Wraps PrimeNG's text button and applies the
 * `.glow-link` treatment so every clickable control shares the embossed-glow
 * language without repeating the incantation. Callers set content (label/icon)
 * and the surface `variant`; the chrome is fixed.
 */
@Component({
  selector: 'app-glow-button',
  imports: [Button],
  // Random negative delay → each button starts at its own point in the glow
  // cycle; it inherits down to the inner .glow-link button.
  host: { '[style.--glow-delay]': 'glowDelay' },
  template: `
    <p-button
      [text]="true"
      [rounded]="rounded()"
      [label]="label()"
      [icon]="icon()"
      [size]="size()"
      [ariaLabel]="ariaLabel()"
      [styleClass]="styleClass()"
      (onClick)="onClick.emit($event)"
    ></p-button>
  `,
})
export class GlowButtonComponent {
  /** Visible text. Omit for an icon-only button (then set `ariaLabel`). */
  label = input<string>();
  /** Full PrimeNG icon class, e.g. `"pi pi-download"`. */
  icon = input<string>();
  variant = input<GlowVariant>('warm');
  size = input<'small' | 'large'>();
  rounded = input(false);
  /** Required for icon-only buttons. */
  ariaLabel = input<string>();
  /** Text link-buttons: swap the rotating glow ring for a cube-colour letter
   *  sweep (see `.glow-sweep`). Use for links, not icon-only action buttons. */
  sweep = input(false);

  /** Emitted on press, mirroring p-button's `(onClick)`. */
  onClick = output<MouseEvent>();

  /** Random start offset across the ~16s glow cycle, fixed per instance. */
  protected readonly glowDelay = `-${(Math.random() * 16).toFixed(2)}s`;

  protected styleClass = computed(() => {
    if (this.sweep()) {
      return 'glow-sweep';
    }
    switch (this.variant()) {
      case 'azure':
        return 'glow-link glow-link-azure';
      case 'dark':
        return 'glow-link glow-link-dark';
      default:
        return 'glow-link';
    }
  });
}
