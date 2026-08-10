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
    <div class="card">
      <p-carousel
        [value]="prints"
        [numVisible]="3"
        [numScroll]="3"
        circular
        [responsiveOptions]="responsiveOptions"
      >
        <!-- Each print gets a frosted mat. These were all photographed on the
             same windowsill as the desk behind them — warm wood on warm wood —
             so without a frame they sink straight into the backdrop. A light
             panel around a warm photo on a dimmed page is the separation, and
             it's the surface the rest of the site already uses.

             Contain, in a fixed-height frame: the prints run from 0.67 to 2.22
             aspect, so every mat comes out the same size and nothing is cropped
             — the alternative is a ragged row or a cropped sculpture. -->
        <ng-template let-print #item>
          <app-glass-panel class="mx-3 mb-6 block p-2 sm:p-3">
            <img
              src="3d-art/{{ print.image }}"
              [alt]="print.name"
              class="h-56 w-full rounded-md object-contain sm:h-64 lg:h-72"
              loading="lazy"
              decoding="async"
            />
          </app-glass-panel>
        </ng-template>
      </p-carousel>
    </div>
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
