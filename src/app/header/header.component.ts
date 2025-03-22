import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Button } from 'primeng/button';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, Button],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  headerService = inject(HeaderService);

  open = this.headerService.isMenuOpen;

  toggleMenu(): void {
    this.headerService.toggleMenuOpen();
  }
}
