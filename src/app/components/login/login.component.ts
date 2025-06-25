import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { MicroservicioConfig, Microservicios } from '../../config/microservices.config';

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
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          const config = Microservicios['producto-service'];
          this.tokenService.obtenerToken(config).subscribe({
            next: (tokenResponse) => {
              //console.log(tokenResponse);
              this.router.navigate(['/producto']);
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Token error',
                text: 'No se pudo obtener el token del microservicio',
                confirmButtonText: 'Aceptar'
              });
            }
          });
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