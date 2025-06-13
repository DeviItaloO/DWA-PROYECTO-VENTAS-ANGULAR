import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const username = 'user';
    const password = 'b0107a18-0d37-4a8d-8b5f-f10405619207';
    const authHeader = 'Basic ' + btoa(`${username}:${password}`);
  
    const authReq = req.clone({
      setHeaders: {
        Authorization: authHeader
      }
    });
  
    return next(authReq);
  };