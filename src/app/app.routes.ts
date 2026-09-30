import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WordleLeagueComponent } from '@pages/wordle-league/wordle-league.component';
import { ThreeDArtComponent } from '@pages/3d-art/3d-art.component';
import { PortfolioComponent } from '@pages/portfolio/portfolio.component';
import { BlogComponent } from '@pages/blog/blog.component';

// Titles are lower case in the source, not by transform: they become the browser
// tab and the bookmark, which no stylesheet can reach. Everything rendered on a
// page is lowercased by `body { text-transform }` instead — see styles.css.
export const routes: Routes = [
  {
    title: '',
    path: '',
    component: HomeComponent,
  },
  // Lazy: the pyramid brings three.js, which nothing else on the site needs.
  {
    title: 'about kelly',
    path: 'about',
    loadComponent: () =>
      import('@pages/about/about.component').then((m) => m.AboutComponent),
  },
  {
    title: 'projects',
    path: 'portfolio',
    pathMatch: 'full',
    component: PortfolioComponent,
  },
  { title: 'blog', path: 'blog', component: BlogComponent },
  { title: '3d art', path: '3d-art', component: ThreeDArtComponent },
  {
    title: 'wordle league',
    path: 'wordle-league',
    component: WordleLeagueComponent,
  },

  // The Wordle League used to live under the portfolio. Keep the old URL working
  // for anything already linking to it.
  {
    path: 'portfolio/wordle-league',
    redirectTo: 'wordle-league',
    pathMatch: 'full',
  },

  // Last, always: a wildcard matches everything, so anything below it is dead.
  // Unrecognised URLs land on the desk instead of throwing NG04002 and leaving
  // an empty outlet — /resume in particular was a live, deployed URL until the
  // resume was removed, so it is very likely bookmarked.
  { path: '**', redirectTo: '' },
];
