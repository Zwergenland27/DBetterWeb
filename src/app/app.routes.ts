import { Routes } from '@angular/router';
import {HomeComponent} from './modules/home/home.component';
import {AccountComponent} from './modules/account/account.component';
import {SearchComponent} from './modules/search/search.component';
import {LoginComponent} from './modules/login/login.component';
import {RegisterComponent} from './modules/register/register.component';
import {JourneyComponent} from './modules/journey/journey.component';

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
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'account/:userId',
    component: AccountComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'journey/:id',
    component: JourneyComponent,
  }
];
