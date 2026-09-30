import { Component } from '@angular/core';
import { HeaderComponent } from '@app/header/header.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { Carousel } from 'primeng/carousel';
import { GlassPanelComponent } from '@shared/ui/glass-panel/glass-panel.component';

@Component({
  selector: 'app-3d-art',
  imports: [HeaderComponent, PageTitleComponent, Carousel, GlassPanelComponent],
  template: `
    <app-header class="no-print"></app-header>
    <app-page-title
      title="3D Art"
      subtitle="A collection of 3D printed art pieces"
    ></app-page-title>
    <!-- One card around the whole gallery rather than one per print. A mat per
         image put a glass panel inside p-carousel-viewport, which sets
         overflow:hidden — and the panel's frosted layer stands 7px proud of its
         host, so the carousel sliced exactly that off the top of every tile.
         Out here nothing clips it, and the prints read as one collection
         instead of a row of separately framed objects.

         The width leaves a gutter on each side because that same edge stands
         9px proud of the host: a full-width panel pushes it past the viewport
         and the whole page scrolls sideways by that much. -->
    <app-glass-panel
      class="mx-auto my-8 block w-[calc(100%-2rem)] max-w-7xl p-4 sm:p-6"
    >
      <p-carousel
        [value]="prints"
        [numVisible]="3"
        [numScroll]="3"
        circular
        [responsiveOptions]="responsiveOptions"
      >
        <!-- Contain, in a fixed-height frame: the prints run from 0.67 to 2.22
             aspect, so every one comes out the same height and nothing is
             cropped — the alternative is a ragged row or a cropped sculpture.
             The card behind them is what separates them from the desk; each
             print only needs enough shadow to sit on it rather than float. -->
        <ng-template let-print #item>
          <img
            src="3d-art/{{ print.image }}"
            [alt]="print.name"
            class="mx-2 h-56 w-[calc(100%-1rem)] rounded-lg object-contain shadow-lg shadow-black/30 sm:h-64 lg:h-72"
            loading="lazy"
            decoding="async"
          />
        </ng-template>
      </p-carousel>
    </app-glass-panel>
  `,
  styles: `
    /* The page stands on the desk in the app shell, and adds a scrim of its own:
       the desk's veil is tuned for text on frosted panels, but a gallery of warm
       photographs needs the room darker still before they read as separate
       objects rather than more of the same windowsill. */
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(
        to bottom,
        rgb(6 10 20 / 0.35),
        rgb(6 10 20 / 0.5)
      );
    }

    /* PrimeNG's carousel chrome is mid-slate, which was invisible on the dark
       page and is still weak on the frosted card. Third-party controls don't get
       the glow treatment — they get to be quiet — but they do have to be seen.

       Note the target: .p-carousel-prev-button is the <p-button> WRAPPER, and
       the real <button> inside it sets its own colour, which the icon then
       inherits through fill="currentColor". Styling the wrapper does nothing to
       the icon. ::ng-deep because the carousel is a child component; the :host
       prefix keeps it scoped to this page. */
    :host ::ng-deep .p-carousel-prev-button .p-button,
    :host ::ng-deep .p-carousel-next-button .p-button {
      color: var(--color-frenchgrey);
      background: rgb(255 255 255 / 0.1);
      border-color: rgb(255 255 255 / 0.2);
      transition:
        color 0.25s ease,
        background-color 0.25s ease;
    }

    /* The doubled .p-button is not a typo: PrimeNG's own hover rule has the same
       specificity as ours and its theme CSS is injected at runtime, after the
       component's, so a tie goes to PrimeNG. Repeating the class wins the tie
       without reaching for !important, and stays variant-agnostic. */
    :host ::ng-deep .p-carousel-prev-button .p-button.p-button:hover,
    :host ::ng-deep .p-carousel-next-button .p-button.p-button:hover,
    :host ::ng-deep .p-carousel-prev-button .p-button.p-button:focus-visible,
    :host ::ng-deep .p-carousel-next-button .p-button.p-button:focus-visible {
      color: #fff;
      background: rgb(255 255 255 / 0.22);
    }

    :host ::ng-deep .p-carousel-indicator-button {
      background: rgb(255 255 255 / 0.25);
    }

    :host ::ng-deep .p-carousel-indicator-active .p-carousel-indicator-button {
      background: var(--color-frenchgrey);
    }

    @media (prefers-reduced-motion: reduce) {
      :host ::ng-deep .p-carousel-prev-button .p-button,
      :host ::ng-deep .p-carousel-next-button .p-button {
        transition: none;
      }
    }
  `,
})
export class ThreeDArtComponent {
  prints = [
    {
      image: 'flower-1.jpg',
      name: 'Flower 1',
    },
    {
      image: 'flower-2.jpg',
      name: 'Flower 2',
    },
    {
      image: 'flower-3.jpg',
      name: 'Flower 3',
    },
    {
      image: 'tetris.JPG',
      name: 'Tetris',
    },
    {
      image: 'tetris2.jpg',
      name: 'Tetris 2',
    },
    {
      image: 'tetris3.jpg',
      name: 'Tetris 3',
    },
    {
      image: 'table-top-1.JPG',
      name: 'Tabletop 1',
    },
    {
      image: 'table-top.jpg',
      name: 'Tabletop',
    },
    {
      image: 'table-top-2.JPG',
      name: 'Tabletop 2',
    },
    {
      image: 'bricks1.JPG',
      name: 'Bricks 1',
    },
    {
      image: 'bricks2.JPG',
      name: 'Bricks 2',
    },
    {
      image: 'bricks3.JPG',
      name: 'Bricks 3',
    },
  ];

  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '1199px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
}
