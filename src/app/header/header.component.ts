import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { GlassPanelComponent } from '@shared/ui/glass-panel/glass-panel.component';
import { GlowSweepDirective } from '@shared/ui/glow-sweep.directive';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    LogoComponent,
    GlassPanelComponent,
    GlowSweepDirective,
  ],
  template: `<header class="mb-5">
    <app-glass-panel variant="header" class="mx-3 sm:mx-6">
      <nav
        class="no-print flex flex-col items-center gap-5 p-6 sm:flex-row sm:justify-between sm:gap-4 lg:px-8"
        aria-label="Global"
      >
        <!-- The house is an icon button like any other: the shared pale icon
             colour and cube ring, from .glow-link + .glow-link-icon, so it
             carries the same weight as the words beside it. .logo-link adds
             only what is the house's own — the load bloom and squash. -->
        <a
          routerLink="/"
          aria-label="Home"
          class="logo-link glow-link glow-link-icon inline-flex items-center justify-center rounded-full p-2"
          [class.animate-intro]="animateOnLoad()"
        >
          <app-logo></app-logo>
        </a>

        <!-- Nav Links -->
        <div
          class="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6"
        >
          @for (navItem of navItems; track navItem) {
            <a
              glowSweep
              [routerLink]="navItem.path"
              [fragment]="navItem.fragment"
              class="glow-sweep text-lg font-bold px-5 py-2.5 rounded-2xl"
              >{{ navItem.label }}</a
            >
          }
        </div>
      </nav>
    </app-glass-panel>
  </header> `,
})
export class HeaderComponent {
  /** Set by the portfolio page — the page you arrive on from the home
      photograph — so the logo plays its intro squash on load. */
  animateOnLoad = input(false);

  /** The three places to go. No "Home" — the logo beside these already goes
      there, and the home page is the one page that never shows this bar. */
  navItems: { label: string; path: string; fragment?: string }[] = [
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about' },
  ];
}
