import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoComponent } from "@shared/components/logo/logo.component";

@Component({
  selector: 'app-header',
  imports: [RouterModule, LogoComponent],
  template: `<header
  class="bg-transparent backdrop-invert-10 backdrop-blur border-b border-frenchgrey/10 mb-5"
>
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
          [href]="navItem.path"
          class="glow-link text-lg font-bold px-5 py-2.5 rounded-2xl"
          >{{ navItem.label }}</a
        >
      }
    </div>
  </nav>
</header>
`,
  styles: `
    .logo-link app-logo {
      display: inline-block;
      transform-origin: center;
      will-change: transform, filter;
    }

    /* One-shot vertical-biased squash — plays when the home page loads */
    @keyframes houseIntro {
      0% {
        transform: scale(1, 1);
      }
      25% {
        transform: scaleX(1.03) scaleY(1.18);
      }
      55% {
        transform: scaleX(0.98) scaleY(0.88);
      }
      80% {
        transform: scaleX(1.01) scaleY(1.06);
      }
      100% {
        transform: scale(1, 1);
      }
    }

    .logo-link.animate-intro app-logo {
      animation: houseIntro 0.85s ease-in-out;
    }

    .logo-link {
      position: relative;
      z-index: 0;
    }

    /* Multi-colored neon glow that sits behind the house and revolves on hover */
    .logo-link::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 42px;
      height: 42px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: conic-gradient(
        from 0deg,
        #39ff14,
        #00b3ff,
        #b026ff,
        #ff7a00,
        #ff1744,
        #ffe600,
        #39ff14
      );
      filter: blur(9px);
      opacity: 0;
      z-index: -1;
      pointer-events: none;
      transition: opacity 0.35s ease;
    }

    .logo-link:hover::before {
      opacity: 0.5;
      animation: glowSpin 4s linear infinite;
    }

    @keyframes glowSpin {
      from {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      to {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }

    /* Fun one-shot color bloom behind the house when the home page loads */
    .logo-link::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 42px;
      height: 42px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: conic-gradient(
        from 0deg,
        #39ff14,
        #00b3ff,
        #b026ff,
        #ff7a00,
        #ff1744,
        #ffe600,
        #39ff14
      );
      filter: blur(9px);
      opacity: 0;
      z-index: -1;
      pointer-events: none;
    }

    .logo-link.animate-intro::after {
      animation: houseLoadGlow 1.2s ease-out;
    }

    @keyframes houseLoadGlow {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) rotate(0deg) scale(0.3);
      }
      20% {
        opacity: 0.9;
        transform: translate(-50%, -50%) rotate(200deg) scale(1.35);
      }
      60% {
        opacity: 0.6;
        transform: translate(-50%, -50%) rotate(520deg) scale(1.1);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) rotate(720deg) scale(1);
      }
    }
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
