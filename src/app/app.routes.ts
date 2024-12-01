import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {
      path: 'login',
      component: LoginComponent,
      title: 'Iniciar sesión | Principal',
    },
    {
      path: '**',
      redirectTo: 'login',
      title: 'Error | Redirigiendo...',
    },
  ];