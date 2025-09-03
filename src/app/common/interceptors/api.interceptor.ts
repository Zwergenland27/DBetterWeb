import { HttpInterceptorFn } from '@angular/common/http';

const baseUrl = "https://api.dbetter.de/"

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    url: `${baseUrl}${req.url}`
  })
  return next(req);
};
