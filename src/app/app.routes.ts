import { Routes } from '@angular/router';
import {HomeComponent} from './modules/home/home.component';
import {AccountComponent} from './modules/account/account.component';
import {SearchComponent} from './modules/search/search.component';
import {LoginComponent} from './modules/login/login.component';

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
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'account/:userId',
    component: AccountComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  }
];
