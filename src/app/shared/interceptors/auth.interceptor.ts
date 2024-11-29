import {HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';
import {catchError, switchMap, throwError} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  if(token === null){
    return next(req);
  }

  req = setToken(req, token);

  return next(req).pipe(
    catchError((error) => {
      if(error.status !== 401 || !token){
        return throwError(() => error);
      }

      return auth.refreshToken().pipe(
        switchMap((token) => {
          return next(setToken(req, token));
        })
      )
    })
  );
};

function setToken(req: HttpRequest<any>, token: string){
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
}
