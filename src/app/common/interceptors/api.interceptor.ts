import { HttpInterceptorFn } from '@angular/common/http';

const baseUrl = "http://localhost:5123/"

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    url: `${baseUrl}${req.url}`
  })
  return next(req);
};
