import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';

export type ProblemDetails = {
  status: number;
  errors: {[key: string]: Error[]}
  containsError(code: string): boolean;
}

export type Error = {
  title: string;
  details: string;
}

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const problemDetails : ProblemDetails = {
        status: error.error.status,
        errors: error.error.errors,
        containsError(code: string): boolean {
          const lastDotIndex = code.lastIndexOf('.')
          const sectionName = code.substring(0, lastDotIndex);
          const title = code.substring(lastDotIndex + 1);
          if(this.errors[sectionName] === undefined){
            return false;
          }
          return this.errors[sectionName].find(error => error.title === title) !== undefined;
        }
      }
      return throwError(() => problemDetails);
    })
  );
};
