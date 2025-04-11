import { Routes } from '@angular/router';
import {FindConnectionsComponent} from './modules/find-connections/find-connections.component';
import {AboutComponent} from './modules/about/about.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'find-connections',
    pathMatch: 'full',
  },
  {
    path: 'find-connections',
    component: FindConnectionsComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  }
];
