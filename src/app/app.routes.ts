import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ResumeComponent } from './pages/resume/resume.component';
import { RoadmapComponent } from './pages/roadmap/roadmap.component';

export const routes: Routes = [
  { title: '', path: '', component: HomeComponent },
  { title: 'About Kelly', path: 'about', component: AboutComponent },
  { title: 'Resume', path: 'resume', component: ResumeComponent },
  { title: 'Roadmap', path: 'roadmap', component: RoadmapComponent },
];
