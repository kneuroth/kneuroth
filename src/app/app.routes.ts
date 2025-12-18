import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from '@pages/about/about.component';
import { PortfolioComponent } from '@pages/portfolio/portfolio.component';
import { ResumePageComponent } from '@pages/resume-page/resume-page.component';
import { RoadmapComponent } from '@pages/roadmap/roadmap.component';
import { WordleLeagueComponent } from '@pages/wordle-league/wordle-league.component';
import { PrintsComponent } from '@pages/prints/prints.component';

export const routes: Routes = [
  {
    title: '',
    path: '',
    component: HomeComponent,
  },
  { title: 'About Kelly', path: 'about', component: AboutComponent },
  { title: 'Resume', path: 'resume', component: ResumePageComponent },
  { title: 'Roadmap', path: 'roadmap', component: RoadmapComponent },
  { title: 'Portfolio', path: 'portfolio', component: PortfolioComponent },
  { title: 'Wordle League', path: 'portfolio/wordle-league', component: WordleLeagueComponent },
  { title: 'Prints', path: 'portfolio/prints', component: PrintsComponent },
];
