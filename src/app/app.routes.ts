import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from '@pages/about/about.component';
import { WordleLeagueComponent } from '@pages/wordle-league/wordle-league.component';
import { ThreeDArtComponent } from '@pages/3d-art/3d-art.component';
import { PortfolioComponent } from '@pages/portfolio/portfolio.component';
import { BlogComponent } from '@pages/blog/blog.component';

export const routes: Routes = [
  {
    title: '',
    path: '',
    component: HomeComponent,
  },
  { title: 'About Kelly', path: 'about', component: AboutComponent },
  {
    title: 'Projects',
    path: 'portfolio',
    pathMatch: 'full',
    component: PortfolioComponent,
  },
  { title: 'Blog', path: 'blog', component: BlogComponent },
  { title: '3D Art', path: '3d-art', component: ThreeDArtComponent },
  {
    title: 'Wordle League',
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
