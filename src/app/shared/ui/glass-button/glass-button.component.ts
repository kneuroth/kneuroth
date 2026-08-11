import { NgTemplateOutlet } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Which ground the slab stands on. See DESIGN.md. */
export type GlassButtonTone = 'light' | 'dark';

/**
 * The glass button — a pressable slab of the site's frosted material.
 *
 * Where `<app-glow-button>` is a *word* with light behind it, this is an
 * *object* you press: the same glass as `<app-glass-panel>`, at button scale,
 * with the panel's layers intact — rim, then a clear strip where the fill drops
 * away, then frosted interior.
 *
 * The one difference from the panel is the rim, and it is the whole idea. The
 * panel's edge is a single colour breathing white→blue; here the edge carries
 * the cube triad instead — the same rotating white + two-cube-colour gradient
 * that haloes an icon button, moved from behind the control into its border. So
 * the colour that identifies an interactive thing is still there, still on the
 * shared `glowSpin`/`glowCube` cycle, but it reads as a lit rim on a solid
 * object rather than a glow escaping from under one.
 *
 * Content-projected: put a label, an icon, or both between the tags. Set layout
 * (width, margin, alignment) on the host from the caller.
 */
@Component({
  selector: 'app-glass-button',
  imports: [NgTemplateOutlet, RouterLink],
  // Random negative delay → each button starts at its own point in the cube
  // cycle, so a row of them never rotates in lockstep. Same trick, and the same
  // property name, as GlowButtonComponent.
  host: {
    '[style.--glow-delay]': 'glowDelay',
    '[class.is-dark]': "tone() === 'dark'",
  },
  // One slab, two possible elements. Somewhere to go is an <a> — it has to be
  // middle-clickable and copyable, and "button" is not a synonym for "link";
  // everything else is a <button>. The label goes through an ng-template so a
  // single <ng-content> serves both, which is the one way to project the same
  // content into two branches.
  template: `
    <ng-template #face><ng-content></ng-content></ng-template>

    @if (link()) {
      <a
        class="glass-button"
        [routerLink]="link()"
        [attr.aria-label]="ariaLabel()"
      >
        <ng-container *ngTemplateOutlet="face"></ng-container>
      </a>
    } @else {
      <button
        class="glass-button"
        [type]="type()"
        [disabled]="disabled()"
        [attr.aria-label]="ariaLabel()"
        (click)="onClick.emit($event)"
      >
        <ng-container *ngTemplateOutlet="face"></ng-container>
      </button>
    }
  `,
  styles: `
    /* The knobs live on the host, not on the button inside it, so a caller can
       override them with a class on <app-glass-button>. Declared on the inner
       element they would win over the caller's value every time, which is a
       maddening thing to debug. */
    :host {
      display: inline-block;
      /* Rim thickness and the clear strip inside it. Both are px rather than em:
         the layers are chrome, and chrome should not grow with the label. */
      --glass-rim: 2px;
      --glass-strip: 5px;
      /* Override this rather than border-radius itself, or the inner fill stops
         following the corners. */
      --glass-radius: 1rem;
      /* Light tone: the panel's white frost, for a button on a page. */
      --glass-fill: rgb(255 255 255 / 0.2);
      --glass-blur: blur(9px) saturate(1.15);
    }

    /* Dark tone: for a button standing on the photograph itself, where there is
       no veil behind it and white frost at 0.2 disappears into a bright
       windowsill. Same numbers as .glass-dark, which is the same decision made
       for the desk's floated cards — see "The frosted edge is one definition" in
       DESIGN.md. The rim is unchanged: the cube colours read on both. */
    :host(.is-dark) {
      --glass-fill: rgb(8 4 5 / 0.72);
      --glass-blur: blur(6px) saturate(1.1);
    }

    .glass-button {
      position: relative;
      /* Contains the two decoration layers' negative z-index so they stay behind
         this button's own label and no further. */
      isolation: isolate;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5em;
      /* Fills whatever the host is given. Against an auto-sized host both
         percentages resolve to auto, so a free-standing button still shrinks to
         its label; drop it into a fixed box (a floated desk surface) and it
         takes the box. */
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 0.7em 1.4em;
      text-decoration: none;
      border: 0;
      border-radius: var(--glass-radius);
      background: none;
      color: var(--sweep-base);
      font: inherit;
      font-weight: 600;
      letter-spacing: 0.02em;
      cursor: pointer;
      /* Sturdy, not floaty: the panel's drop shadow, and no blue bloom — the
         colour lives on the rim now and a second coloured glow would fight it. */
      box-shadow: 0 10px 40px rgb(0 0 0 / 0.18);
      transition:
        transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.28s ease,
        color 0.28s ease;
      /* Drives --glow-angle / --glow-a / --glow-b for the rim below, exactly as
         .glow-link drives them for its halo. The per-instance delay (set from
         the component) keeps a row of these from cycling in lockstep. */
      animation:
        glowSpin 10s linear infinite,
        glowCube 16s linear infinite;
      animation-delay: var(--glow-delay, 0s), var(--glow-delay, 0s);
    }

    /* The rim: a conic ring of white + the two cube colours.

       Masked rather than painted as a border, because the interior has to stay
       translucent. The usual gradient-border trick — a padding-box fill layered
       over a border-box gradient — only hides the gradient inside the button if
       that fill is opaque, and ours is frosted glass. Two masks composited to
       exclude one another cut the middle out of the gradient instead, leaving a
       ring of it and nothing else.

       The gradient names --glow-angle / --glow-a / --glow-b directly. Routing
       them through an intermediate custom property stops the browser repainting
       as they animate and the rim sits frozen — the same trap as the glow ring
       and the glass edge. */
    .glass-button::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      padding: var(--glass-rim);
      border-radius: inherit;
      pointer-events: none;
      background: conic-gradient(
        from var(--glow-angle),
        #ffffff,
        var(--glow-a),
        var(--glow-b),
        #ffffff
      );
      -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      mask-composite: exclude;
    }

    /* The frosted interior, inset by the strip. Same material and the same
       reading order as <app-glass-panel> — rim, clear strip, frost — but drawn
       inward: a button is a small object that has to stay inside the box the
       layout gave it, so there is nowhere outside to stand the strip. */
    .glass-button::after {
      content: '';
      position: absolute;
      inset: var(--glass-strip);
      z-index: -1;
      border-radius: calc(var(--glass-radius) - var(--glass-strip));
      pointer-events: none;
      background: var(--glass-fill);
      -webkit-backdrop-filter: var(--glass-blur);
      backdrop-filter: var(--glass-blur);
    }

    /* Pressed toward you, and the rim's own colour blooms out from under it —
       the halo an icon button wears all the time, borrowed for the moment of
       contact. Smaller lift than a text link's 1.05: this thing has mass. */
    .glass-button:hover:not(:disabled),
    .glass-button:focus-visible:not(:disabled) {
      transform: scale(1.03);
      color: #ffffff;
      box-shadow:
        0 12px 44px rgb(0 0 0 / 0.22),
        0 0 18px color-mix(in srgb, transparent, var(--glow-a) 55%);
    }

    /* The label is transparent-adjacent on glass, so focus gets a real outline
       rather than relying on the glow — same treatment as the swept links. */
    .glass-button:focus-visible {
      outline: 2px solid var(--sweep-base);
      outline-offset: 3px;
    }

    .glass-button:active:not(:disabled) {
      transform: scale(0.98);
      box-shadow: 0 6px 20px rgb(0 0 0 / 0.2);
    }

    /* Unavailable, not invisible: the glass stays, the light goes out. */
    .glass-button:disabled {
      cursor: default;
      opacity: 0.5;
      animation: none;
    }

    .glass-button:disabled::before {
      background: rgb(255 255 255 / 0.25);
    }

    @media (prefers-reduced-motion: reduce) {
      .glass-button {
        animation: none;
        transition: color 0.28s ease;
      }
      .glass-button:hover:not(:disabled),
      .glass-button:focus-visible:not(:disabled),
      .glass-button:active:not(:disabled) {
        transform: none;
      }
    }

    @media print {
      .glass-button {
        box-shadow: none !important;
        color: #1f2937 !important;
        animation: none !important;
      }
      .glass-button::before {
        background: #d1d5db !important;
      }
      .glass-button::after {
        background: none !important;
        -webkit-backdrop-filter: none !important;
        backdrop-filter: none !important;
      }
    }
  `,
})
export class GlassButtonComponent {
  /**
   * Which ground the slab is standing on — pick it from the background, the
   * same way a `.glow-link` variant is picked.
   *
   * - `light` (default): white frost, for a button on a page.
   * - `dark`: near-black frost, for a button on the photograph itself, where
   *   nothing is dimming what is behind it.
   */
  tone = input<GlassButtonTone>('light');

  /** A route to go to. Set it and the slab renders as an `<a>` instead of a
      `<button>`; leave it off for a control that acts rather than navigates. */
  link = input<string>();

  /** Mirrors the native attribute; `submit` only inside a form. */
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  /** Required when the projected content is an icon with no text. */
  ariaLabel = input<string>();

  /** Emitted on press, mirroring `<app-glow-button>`. */
  onClick = output<MouseEvent>();

  /** Random start offset across the ~16s cube cycle, fixed per instance. */
  protected readonly glowDelay = `-${(Math.random() * 16).toFixed(2)}s`;
}
