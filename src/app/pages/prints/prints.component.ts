import { Component } from '@angular/core';
import { HeaderComponent } from "@app/header/header.component";
import { PageTitleComponent } from "@shared/components/page-title/page-title.component";
import { CarouselModule } from 'primeng/carousel';
@Component({
  selector: 'app-prints',
  imports: [HeaderComponent, PageTitleComponent, CarouselModule],
  template: `
    <app-header class="no-print -mt-20"></app-header>
    <app-page-title
      title="3D Designs"
      subtitle="A collection of 3D printed art and design pieces"
    ></app-page-title>
    <div class="card">
      <p-carousel [value]="prints" [numVisible]="2" [numScroll]="1" circular [responsiveOptions]="responsiveOptions">
          <ng-template let-print #item>
                <div class="mb-4 ml-1 mr-1 justify-self-center ">
                    <div class="relative mx-auto">
                        <img src="portfolio-images/prints/{{ print.image }}" [alt]="print.name" class="max-h-96 aspect-auto rounded-lg " />
                    </div>
                </div>
          </ng-template>
      </p-carousel>
    </div>

  `,
  styles: ``
})
export class PrintsComponent {

  prints = [{
    image: 'lightsaber.JPG',
    name: 'Lightsaber',
  },
  {
    image: 'tetris.JPG',
    name: 'Tetris',
  },
  {
    image: 'dogs.JPG',
    name: 'Dogs',
  },
  {
    image: 'busts.JPG',
    name: 'Busts',
  },
  {
    image: 'flower.JPG',
    name: 'Flower',
  },
  {
    image: 'table-top.jpg',
    name: 'Tabletop',
  },
  {
    image: 'window.JPG',
    name: 'Window',
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
