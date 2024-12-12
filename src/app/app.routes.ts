import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductosComponent } from './components/productos/productos.component';

export const routes: Routes = [
    {
      path: 'login',
      component: LoginComponent,
      title: 'Iniciar sesión | Login',
    },
    {
      path: 'producto',
      component: ProductosComponent,
      title: 'Administrador | Producto',
    },
    {
      path: '**',
      redirectTo: 'login',
      title: 'Error | Redirigiendo...',
    },
  ];