import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {apiInterceptor} from './shared/interceptors/api.interceptor';
import {authInterceptor} from './shared/interceptors/auth.interceptor';
import {provideNativeDateAdapter} from '@angular/material/core';
import {errorHandlingInterceptor} from './shared/interceptors/error-handling.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideNativeDateAdapter(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([apiInterceptor, authInterceptor, errorHandlingInterceptor]))]
};
