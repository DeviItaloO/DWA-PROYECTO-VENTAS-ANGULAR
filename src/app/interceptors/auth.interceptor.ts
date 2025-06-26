import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  let clientId: string | null = null;

  if (req.url.includes('/api/productos')) {
    clientId = 'producto-service';
  } else if (req.url.includes('/api/categorias')) {
    clientId = 'categoria-service';
  }

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