import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoComponent } from "@shared/components/logo/logo.component";
import { GlassPanelComponent } from "@shared/ui/glass-panel/glass-panel.component";
import { GlowSweepDirective } from "@shared/ui/glow-sweep.directive";

@Component({
  selector: 'app-header',
  imports: [RouterModule, LogoComponent, GlassPanelComponent, GlowSweepDirective],
  template: `<header class="mb-5">
  <app-glass-panel variant="header">
    <nav
      class="no-print flex flex-col items-center gap-5 p-6 sm:flex-row sm:justify-between sm:gap-4 lg:px-8"
      aria-label="Global"
    >
      <a
        href=""
        class="logo-link inline-flex items-center justify-center"
        [class.animate-intro]="animateOnLoad()"
      >
        <app-logo></app-logo>
      </a>

      <!-- Nav Links -->
      <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6">
        @for (navItem of navItems; track navItem) {
          <a
            glowSweep
            [href]="navItem.path"
            class="glow-sweep text-lg font-bold px-5 py-2.5 rounded-2xl"
            >{{ navItem.label }}</a
          >
        }
      </div>
    </nav>
  </app-glass-panel>
</header>
`
})
export class HeaderComponent {

  /** Set by the home page so the logo plays its intro squash on load. */
  animateOnLoad = input(false);

  navItems = [
    { label: 'Home', path: '' },
    { label: 'Resume', path: 'resume' },
    { label: 'Portfolio', path: 'portfolio' },
  ];
}
