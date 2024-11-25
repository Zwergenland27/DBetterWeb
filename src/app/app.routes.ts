import { Routes } from '@angular/router';
import {HomeComponent} from './modules/home/home.component';
import {AccountComponent} from './modules/account/account.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
  }
];
