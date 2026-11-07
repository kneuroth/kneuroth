import { Component, input, model } from '@angular/core';

/**
 * The search field — a pane of the panel's frosted glass you type on.
 *
 * Everything clickable on the site wears the cube triad somewhere: behind a
 * word (`.glow-link`), or on the rim of an object (`<app-glass-button>`). A
 * search field is neither. It isn't pressed or said, it's written on, and it
 * sits there for as long as someone is typing, so it takes the quietest edge
 * the site has: `<app-glass-panel>`'s. That's the same breathing white→blue
 * stroke, the same clear strip, and the same frosted interior, at input
 * scale, with no conic ring and no colour cycle. Focus is the one change: the
 * stroke stops breathing and settles on blue, so the field reads as lit while
 * it's in use.
 *
 * The icon is a magnifier painted the icon identity (`--sweep-base`, the
 * static icon halo). It's decorative, so the input carries the accessible name.
 *
 * Two-way bindable: `[(value)]="query"`. Escape clears it. Set layout (width,
 * margin) on the host from the caller.
 */
@Component({
  selector: 'app-search-field',
  template: `
    <!-- The edge: .glass-edge's breathing stroke, standing proud of the fill
         so the gap between them is the clear strip. Same construction as
         <app-glass-panel>'s .glass layer, at a smaller strip. -->
    <span class="edge glass-edge" aria-hidden="true"></span>
    <svg
      class="icon"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg>
    <input
      type="search"
      autocomplete="off"
      spellcheck="false"
      [attr.aria-label]="ariaLabel()"
      [placeholder]="placeholder()"
      [value]="value()"
      (input)="value.set($any($event.target).value)"
      (keydown.escape)="value.set('')"
    />
  `,
  styles: `
    /* The fill and the blur live on the host, exactly as on <app-glass-panel>:
       spanning the strip as well, a tint would make the strip stop being one. */
    :host {
      --search-strip: 6px;
      --search-radius: 0.9rem;

      display: flex;
      align-items: center;
      gap: 0.6em;
      position: relative;
      padding: 0.7em 1em;
      border-radius: var(--search-radius);
      background: rgb(255 255 255 / 0.2);
      -webkit-backdrop-filter: blur(9px) saturate(1.15);
      backdrop-filter: blur(9px) saturate(1.15);
      cursor: text;
    }

    .edge {
      position: absolute;
      inset: calc(var(--search-strip) * -1);
      z-index: -1;
      pointer-events: none;
      border-radius: calc(var(--search-radius) + var(--search-strip) - 1px);
    }

    /* In use: the stroke stops breathing and holds at the blue end of its
       range, with the bloom it only reaches at the breathe's peak. This is a
       held state, not a new effect, and still no cube colours. */
    :host(:focus-within) .edge {
      animation: none;
      border-color: rgb(165 197 222 / 0.85);
      box-shadow:
        0 10px 40px rgb(0 0 0 / 0.18),
        0 0 16px rgb(120 165 215 / 0.7);
    }

    .icon {
      flex: none;
      width: 1.1em;
      height: 1.1em;
      color: var(--sweep-base);
      /* The static icon halo from .glow-link-icon. There's no hover lift,
         because the icon isn't a control. */
      filter: drop-shadow(0 0 8px rgb(130 175 225 / 0.45));
    }

    input {
      flex: 1;
      min-width: 0;
      border: 0;
      outline: 0;
      background: none;
      padding: 0;
      font: inherit;
      letter-spacing: 0.02em;
      color: #ffffff;
      caret-color: var(--sweep-base);
      /* Body is lowercased site-wide; what someone types stays what they
         typed. */
      text-transform: none;
    }

    input::placeholder {
      color: var(--sweep-base);
      opacity: 0.6;
      text-transform: lowercase;
    }

    /* The native clear "x" would be the one un-designed thing on the field.
       Escape clears instead. */
    input::-webkit-search-decoration,
    input::-webkit-search-cancel-button {
      -webkit-appearance: none;
      appearance: none;
    }

    /* The edge's bloom is the focus indicator at rest. For keyboard users, add
       the same outline the swept links take, so focus never depends on a glow
       alone. */
    :host(:has(input:focus-visible)) {
      outline: 2px solid var(--sweep-base);
      outline-offset: calc(var(--search-strip) + 3px);
    }

    @media (prefers-reduced-motion: reduce) {
      .edge {
        animation: none;
      }
    }

    @media print {
      :host {
        background: #fff !important;
        -webkit-backdrop-filter: none !important;
        backdrop-filter: none !important;
        border: 1px solid #d1d5db;
      }
      .edge {
        display: none !important;
      }
      .icon,
      input {
        color: #1f2937 !important;
        filter: none !important;
      }
    }
  `,
})
export class SearchFieldComponent {
  /** The query. Two-way: `[(value)]`. */
  value = model('');
  placeholder = input('search');
  /** The input's accessible name. The icon is decorative, so set this
      whenever the placeholder alone wouldn't say what is being searched. */
  ariaLabel = input('search');
}
