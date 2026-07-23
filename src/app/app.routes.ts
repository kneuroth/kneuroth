import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from '@pages/about/about.component';
import { PortfolioComponent } from '@pages/portfolio/portfolio.component';
import { ResumePageComponent } from '@pages/resume-page/resume-page.component';
import { WordleLeagueComponent } from '@pages/wordle-league/wordle-league.component';
import { ThreeDArtComponent } from '@pages/3d-art/3d-art.component';

export const routes: Routes = [
  {
    title: '',
    path: '',
    component: HomeComponent,
  },
  { title: 'About Kelly', path: 'about', component: AboutComponent },
  { title: 'Resume', path: 'resume', component: ResumePageComponent },
  { title: 'Portfolio', path: 'portfolio', component: PortfolioComponent },
  { title: '3D Art', path: '3d-art', component: ThreeDArtComponent },
  { title: 'Wordle League', path: 'portfolio/wordle-league', component: WordleLeagueComponent },
];
