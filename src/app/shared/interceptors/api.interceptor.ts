import { HttpInterceptorFn } from '@angular/common/http';

//const baseUrl = 'https://localhost:7038/';
const baseUrl = 'https://alpha.dbetter.de/api/';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    url: `${baseUrl}${req.url}`,
    withCredentials: true,
  })
  return next(req);
};
