import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  constructor() {}

  isMenuOpen = signal(false);

  toggleMenuOpen() {
    this.isMenuOpen.update((value) => !value);
  }
}
