import { Component, computed, input } from '@angular/core';
import { PortfolioEntry } from '../model';
import { Button } from "primeng/button";
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-portfolio-entry',
  imports: [Button, KeyValuePipe],
  templateUrl: './portfolio-entry.component.html',
  template: ``,
})
export class PortfolioEntryComponent {
  portfolioEntry = input.required<PortfolioEntry>();

  // onClickEntry() {
  //   // if (this.portfolioEntry().link) {
  //   //   window.open(this.portfolioEntry().link, '_blank');
  //   // }
  // }

  onMediaClick(url: string) {
    window.open(url, '_blank');
  }
}
