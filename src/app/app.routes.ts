import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { RoadmapComponent } from './pages/roadmap/roadmap.component';
import { ResumePageComponent } from './pages/resume-page/resume-page.component';

export const routes: Routes = [
  {
    title: '',
    path: '',
    component: HomeComponent,
    data: {
      background: 'buffalo-building-1.JPG',
    },
  },
  { title: 'About Kelly', path: 'about', component: AboutComponent },
  { title: 'Resume', path: 'resume', component: ResumePageComponent },
  { title: 'Roadmap', path: 'roadmap', component: RoadmapComponent },
];
