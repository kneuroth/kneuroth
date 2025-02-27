import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home',
  imports: [CardModule, PanelModule],
  templateUrl: './home.component.html',
  standalone: true
})
export class HomeComponent {

  onClickCard(page: string) {
    window.location.href = page;
  }

}
