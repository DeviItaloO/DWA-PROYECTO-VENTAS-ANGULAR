import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/usuario';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  standalone: true,
  selector: 'app-usuarios',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginator,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit, AfterViewInit {
  usuarios: Usuario[] = [];
  displayedColumns = ['idUsuario', 'username', 'firstName', 'lastName', 'email', 'role', 'acciones'];
  dataSource = new MatTableDataSource<Usuario>([]);
  usuarioForm: FormGroup;
  usuario?: Usuario;
  titulo = '';
  roles = ['ADMIN', 'USER'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.usuarioForm = this.fb.group({
      idUsuario: [null],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (response) => {
        this.usuarios = response;
        this.dataSource.data = response;
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  openDialog(isEdit = false, usuario?: Usuario): void {
    const passwordCtrl = this.usuarioForm.get('password');
    this.titulo = isEdit ? 'Editar Usuario' : 'Nuevo Usuario';

    this.usuarioForm.reset();
    passwordCtrl?.setValidators([Validators.required]);

    if (isEdit && usuario) {
      this.usuario = usuario;
      passwordCtrl?.clearValidators();
      this.usuarioForm.patchValue({ ...usuario, password: '' });
    } else {
      this.usuario = undefined;
      this.usuarioForm.patchValue({ role: this.roles[0] });
    }

    passwordCtrl?.updateValueAndValidity();
    this.dialog.open(this.dialogTemplate, { width: '400px', autoFocus: true });
  }

  saveUsuario(): void {
    if (this.usuarioForm.invalid) return;

    const formValue: Usuario = { ...this.usuarioForm.value };
    if (this.usuario?.idUsuario && !formValue.password?.trim()) delete formValue.password;

    if (this.usuario?.idUsuario) {
      this.usuarioService.actualizarUsuario(this.usuario.idUsuario, formValue).subscribe({
        next: (mensaje) => {
          Swal.fire('Success', mensaje, 'success');
          this.getUsuarios();
          this.closeDialog();
        },
        error: (error) => {
          Swal.fire('Failed', 'Error al actualizar usuario', 'warning');
        }
      });
    } else {
      this.usuarioService.crearUsuario(formValue).subscribe({
        next: (mensaje) => {
          Swal.fire('Success', mensaje, 'success');
          this.getUsuarios();
          this.closeDialog();
        },
        error: (error) => {
          Swal.fire('Failed', 'Error al crear usuario', 'warning');
        }
      });
    }
  }

  editarUsuario(usuario: Usuario): void {
    this.openDialog(true, usuario);
  }

  eliminarUsuario(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((click) => {
      if (click.isConfirmed) {
        this.usuarioService.eliminarUsuario(id).subscribe({
          next: (mensaje) => {
            Swal.fire('Eliminado', mensaje, 'success');
            this.getUsuarios();
          },
          error: (error) => {
            Swal.fire('Error', 'Error al eliminar usuario', 'error')
          }
        });
      }
    });
  }

  closeDialog(): void {
    this.usuarioForm.reset();
    this.dialog.closeAll();
  }
}
