import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductosComponent } from './components/productos/productos.component';
import { LayoutComponent } from './layout/layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Iniciar sesión | Login',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'producto',
        component: ProductosComponent,
        title: 'Administrador | Producto',
      },
      // Falta
      // {
      //   path: 'categoria',
      //   component: CategoriasComponent,
      //   title: 'Administrador | Categoría',
      // }
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
    title: 'Error | Redirigiendo...',
  },
];
