import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from './header/header.component';
import { BannerComponent } from './banner/banner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, HeaderComponent, BannerComponent],
  templateUrl: './app.component.html',
  standalone: true,
})
export class AppComponent {
  title = 'kneuroth';
}
