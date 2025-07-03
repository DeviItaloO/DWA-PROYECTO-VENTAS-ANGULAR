import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductosComponent } from './components/productos/productos.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Iniciar sesión | Login',
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'producto',
        component: ProductosComponent,
        title: 'Administrador | Producto',
      },
      {
        path: 'categoria',
        component: CategoriasComponent,
        title: 'Administrador | Categoría',
      },
      {
        path: 'usuario',
        component: UsuariosComponent,
        title: 'Administrador | Usuario',
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
    title: 'Error | Redirigiendo...',
  },
];
