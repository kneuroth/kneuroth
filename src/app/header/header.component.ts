import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [RouterModule, Button],
  templateUrl: './header.component.html',
  standalone: true
})
export class HeaderComponent {

  isMenuOpen = true;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
