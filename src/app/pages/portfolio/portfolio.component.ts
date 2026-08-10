import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { HeaderComponent } from '@app/header/header.component';
import { RevealDirective } from '@shared/ui/reveal.directive';
import { PortfolioEntryComponent } from './portfolio-entry/portfolio-entry.component';
import { PortfolioEntry } from './model';
import {
  ARCADE,
  ART_3D,
  RTCC,
  SENTENCE_GENERATOR,
  WORDLE_BOT,
} from './constants';

/**
 * The project showcase — where the cube on the home page leads.
 */
@Component({
  selector: 'app-portfolio',
  imports: [NgClass, HeaderComponent, PortfolioEntryComponent, RevealDirective],
  templateUrl: './portfolio.component.html',
  standalone: true,
})
export class PortfolioComponent {
  /** Order is the display order down the page; sides alternate from the first. */
  readonly projects: PortfolioEntry[] = [
    WORDLE_BOT,
    ARCADE,
    RTCC,
    SENTENCE_GENERATOR,
    ART_3D,
  ];
}
