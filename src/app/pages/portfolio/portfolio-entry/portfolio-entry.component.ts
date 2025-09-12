import { Component, input } from '@angular/core';
import { PortfolioEntry } from '../model';

@Component({
  selector: 'app-portfolio-entry',
  imports: [],
  templateUrl: './portfolio-entry.component.html',
  template: `
  `,
})
export class PortfolioEntryComponent {
  portfolioEntry = input.required<PortfolioEntry>();

  onClickEntry() {
    if (this.portfolioEntry().link) {
      window.open(this.portfolioEntry().link, '_blank');
    }
  }
}
