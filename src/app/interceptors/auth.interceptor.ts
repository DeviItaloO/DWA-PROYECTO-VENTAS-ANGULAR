import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const username = 'user';
    const password = 'c1a5f676-7e33-4254-a845-e33fdaba612f';
    const authHeader = 'Basic ' + btoa(`${username}:${password}`);
  
    const authReq = req.clone({
      setHeaders: {
        Authorization: authHeader
      }
    });
  
    return next(authReq);
  };