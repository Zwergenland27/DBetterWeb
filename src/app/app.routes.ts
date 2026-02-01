import { Routes } from '@angular/router';
import {FindConnectionsComponent} from './modules/find-connections/find-connections.component';
import {AboutComponent} from './modules/about/about.component';
import {TrainRunsComponent} from './modules/train-runs/train-runs.component';

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
  },
  {
    path: 'train-runs/:id',
    component: TrainRunsComponent,
  }
];
