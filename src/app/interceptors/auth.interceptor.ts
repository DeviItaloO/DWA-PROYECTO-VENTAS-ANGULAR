import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Microservicios } from '../config/microservices.config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const clientId = Object.keys(Microservicios).find(key =>
    req.url.includes(`/api/${key.replace('-service', '')}`)
  );
  const token = clientId ? tokenService.getToken(clientId) : null;
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};