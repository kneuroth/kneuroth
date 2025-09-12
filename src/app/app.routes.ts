import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from '@pages/about/about.component';
import { PortfolioComponent } from '@pages/portfolio/portfolio.component';
import { ResumePageComponent } from '@pages/resume-page/resume-page.component';
import { RoadmapComponent } from '@pages/roadmap/roadmap.component';

export const routes: Routes = [
  {
    title: '',
    path: '',
    component: HomeComponent,
    // data: {
    //   background: 'buffalo-building-1.jpg',
    // },
  },
  { title: 'About Kelly', path: 'about', component: AboutComponent },
  { title: 'Resume', path: 'resume', component: ResumePageComponent },
  { title: 'Roadmap', path: 'roadmap', component: RoadmapComponent },
  { title: 'Portfolio', path: 'portfolio', component: PortfolioComponent }
];
