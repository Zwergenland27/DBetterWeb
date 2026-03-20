import { HttpInterceptorFn } from '@angular/common/http';
import {environment} from '../../../environments/environment';

const baseUrl = environment.apiUrl;

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    url: `${baseUrl}${req.url}`
  })
  return next(req);
};
