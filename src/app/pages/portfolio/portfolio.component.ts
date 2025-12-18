import { Component } from '@angular/core';
import { HeaderComponent } from '@app/header/header.component';
import { PortfolioEntryComponent } from './portfolio-entry/portfolio-entry.component';
import { PRINTS, SENTENCE_GENERATOR, WORDLE_BOT } from './constants';

@Component({
  selector: 'app-portfolio',
  imports: [HeaderComponent, PortfolioEntryComponent],
  templateUrl: './portfolio.component.html',
})
export class PortfolioComponent {
  WORDLE_BOT = WORDLE_BOT;
  SENTENCE_GENERATOR = SENTENCE_GENERATOR;
  PRINTS = PRINTS;
}
