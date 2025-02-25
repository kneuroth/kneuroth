import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
    { title: '', path: '', component: HomeComponent},
    { title: 'About Kelly', path: 'about', component: AboutComponent}
];
