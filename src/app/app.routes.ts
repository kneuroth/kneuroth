import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from '@pages/about/about.component';
import { ResumePageComponent } from '@pages/resume-page/resume-page.component';
import { WordleLeagueComponent } from '@pages/wordle-league/wordle-league.component';
import { ThreeDArtComponent } from '@pages/3d-art/3d-art.component';
import { PortfolioComponent } from '@pages/portfolio/portfolio.component';

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
  { title: 'Resume', path: 'resume', component: ResumePageComponent },
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
];
