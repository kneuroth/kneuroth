import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { HeaderComponent } from "@app/header/header.component";

@Component({
  selector: 'app-home',
  imports: [CardModule, PanelModule, HeaderComponent],
  templateUrl: './home.component.html',
  standalone: true,
})
export class HomeComponent { }
