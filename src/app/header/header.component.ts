import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoComponent } from "@shared/components/logo/logo.component";

@Component({
  selector: 'app-header',
  imports: [RouterModule, LogoComponent],
  template: `<header
  class="bg-transparent backdrop-invert-10 backdrop-blur border-b border-frenchgrey/10 mb-5"
>
  <nav
    class="no-print flex items-center justify-between p-6 lg:px-8"
    aria-label="Global"
  >
    <a href="" class="inline-flex items-center justify-center" (mouseenter)="hovering = true" (mouseleave)="hovering = false">
      <app-logo [class.animate-color-burst]="hovering"></app-logo>
    </a>

    <!-- Desktop Nav Links -->
    <div class="flex gap-x-12">
      @for (navItem of navItems; track navItem) {
        <a
          [href]="navItem.path"
          class="text-sm/6 font-semibold px-3 py-1 rounded-md bg-white/30 backdrop-blur-sm shadow-sm hover:bg-white/40 transition"
          >{{ navItem.label }}</a
        >
      }
    </div>
  </nav>
</header>
`,
  styles: `
    @keyframes colorBurst {
      0% {
        filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0.73)) drop-shadow(0 0 0px rgba(255, 255, 255, 0.73));
      }
      25% {
        filter: drop-shadow(0 0 8px rgba(255, 0, 0, 0.8)) drop-shadow(0 0 4px rgba(255, 0, 0, 0.8));
      }
      50% {
        filter: drop-shadow(0 0 10px rgba(44, 139, 254, 0.8)) drop-shadow(0 0 6px rgba(44, 139, 254, 0.8));
      }
      75% {
        filter: drop-shadow(0 0 8px rgba(255, 173, 59, 0.8)) drop-shadow(0 0 4px rgba(255, 173, 59, 0.8));
      }
      100% {
        filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0.73)) drop-shadow(0 0 0px rgba(255, 255, 255, 0.73));
      }
    }
    
    .animate-color-burst {
      animation: colorBurst 1.8s  infinite;
    }

  `
})
export class HeaderComponent {

  hovering = false;

  navItems = [
    { label: 'Home', path: '' },
    { label: 'Resume', path: 'resume' },
    { label: 'Portfolio', path: 'portfolio' },
    { label: 'Roadmap', path: 'roadmap' },
  ];
}
