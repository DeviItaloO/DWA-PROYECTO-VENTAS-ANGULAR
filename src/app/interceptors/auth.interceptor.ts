import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const username = 'user';
    const password = '49e3f0af-c9b0-4287-9969-7295f774ec00';
    const authHeader = 'Basic ' + btoa(`${username}:${password}`);
  
    const authReq = req.clone({
      setHeaders: {
        Authorization: authHeader
      }
    });
  
    return next(authReq);
  };