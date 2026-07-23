import { Component } from '@angular/core';
import { HeaderComponent } from "@app/header/header.component";
import { PageTitleComponent } from "@shared/components/page-title/page-title.component";
import { Carousel } from "primeng/carousel";

@Component({
  selector: 'app-3d-art',
  imports: [HeaderComponent, PageTitleComponent, Carousel],
  template: `
    <app-header class="no-print -mt-20"></app-header>
    <app-page-title
      title="3D Art"
      subtitle="A collection of 3D printed art pieces"
    ></app-page-title>
    <div class="card">
      <p-carousel [value]="prints" [numVisible]="3" [numScroll]="3" circular [responsiveOptions]="responsiveOptions">
          <ng-template let-print #item>
                <div class="mb-4 ml-1 mr-1 justify-self-center ">
                    <div class="relative mx-auto">
                        <img src="3d-art/{{ print.image }}" [alt]="print.name" class="max-h-96 aspect-auto rounded-lg " />
                    </div>
                </div>
          </ng-template>
      </p-carousel>
    </div>
  `,
  styles: ``
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
    }

  ]

  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '1199px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1
    }
  ]


}
