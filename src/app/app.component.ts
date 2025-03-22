import { Component, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
})
export class AppComponent {
  backgroundImg = 'kelly.jpg';

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    // Jank to give backgrounds that respect the header component
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data),
      )
      .subscribe((data) => {
        this.backgroundImg = data['background'] || undefined;
      });
  }
}
