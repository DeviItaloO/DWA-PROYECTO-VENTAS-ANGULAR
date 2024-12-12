import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage?: string;

  constructor( private fb: FormBuilder, private authService: AuthService, private router: Router ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value).subscribe(
        (response)=>{
          //console.log('Login successful:', response);
          //this.router.navigate(['/']);
          //alert('yes');
          const mensaje = response.message
          Swal.fire({
            allowOutsideClick: true,
            title: 'Login Successful',
            text: mensaje,
            icon: 'success',
            confirmButtonText: 'regresar'
          }).then((click) => {
            if(click.isConfirmed){
              this.router.navigate(['/producto']);
            }
          });
        },
        error =>{
          //console.error('Login fallido:', error);
          //this.errorMessage = 'naaaa';
          const mensaje = error.error.message
          Swal.fire({
            allowOutsideClick: true,
            title: 'Login failed:',
            text: mensaje,
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          })
        }
      );
    }else{

    }
  }
}