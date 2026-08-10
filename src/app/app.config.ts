import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideImageAware } from '@image-aware/angular';
import { routes } from './app.routes';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';
import { MessageService } from 'primeng/api';

// Aura ships with an emerald (green) primary, which fought the multicolour glow.
// Swap the primary ramp for a near-white, faintly cool neutral so every PrimeNG
// control — button icons, focus rings, the tailor's selects — reads as clean
// white/light against the glow instead of a competing accent colour.
const KnLight = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#ffffff',
      100: '#fafafb',
      200: '#f2f3f5',
      300: '#e8e9ec',
      400: '#dddee2',
      500: '#cfd1d6',
      600: '#b9bbc2',
      700: '#9a9ca4',
      800: '#797b83',
      900: '#5b5d64',
      950: '#37383d',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // anchorScrolling keeps in-page fragment links working across navigations;
    // scrollPositionRestoration puts every page back at the top on arrival.
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideAnimationsAsync(),
    // Registers <image-surface>, which the home page's hero photo uses to project
    // live DOM onto the surfaces marked in opportunities.surfaces.json.
    provideImageAware(),
    providePrimeNG({
      theme: {
        preset: KnLight,
      },
    }),
    MessageService,
  ],
};
