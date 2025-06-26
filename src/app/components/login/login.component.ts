import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Microservicios } from '../../config/microservices.config';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).pipe(
        switchMap(() =>
          forkJoin({
            producto: this.tokenService.obtenerToken(Microservicios['producto-service']),
            categoria: this.tokenService.obtenerToken(Microservicios['categoria-service'])
          })
        )
      ).subscribe({
        next: () => {
          this.router.navigate(['/producto']);
        },
        error: (error) => {
          const mensaje = error.error?.message || 'Credenciales incorrectas';
          Swal.fire({
            allowOutsideClick: true,
            title: 'Login failed:',
            text: mensaje,
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }
}