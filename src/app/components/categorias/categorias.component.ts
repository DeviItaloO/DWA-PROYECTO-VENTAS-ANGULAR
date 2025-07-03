import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Categoria } from '../../interfaces/categoria';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categorias.service';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    MatSelectModule
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent implements OnInit {

  dataSource = new MatTableDataSource<Categoria>([]);
  displayedColumns: string[] = ['idCategoria', 'nombre', 'descripcion', 'acciones'];
  categorias: Categoria[] = [];
  categoriaForm!: FormGroup;
  titulo: string = '';
  filtroCategoria: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  private dialogRef!: MatDialogRef<any>;
  private categoriaEditando: Categoria | null = null;

  constructor(
    private categoriaService: CategoriaService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.listarCategorias();
  }

  initForm(): void {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });
  }

  listarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
      }
    });
  }

  openDialog(isEdit: boolean): void {
    this.titulo = isEdit ? 'Editar Categoría' : 'Nueva Categoría';

    if (!isEdit) {
      this.categoriaForm.reset();
      this.categoriaEditando = null;
    }

    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '400px'
    });
  }

  editarCategoria(categoria: Categoria): void {
    this.categoriaEditando = categoria;
    this.categoriaForm.patchValue({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion
    });
    this.openDialog(true);
  }

  saveCategoria(): void {
    if (this.categoriaForm.invalid) return;

    const categoriaData: Categoria = {
      idCategoria: this.categoriaEditando ? this.categoriaEditando.idCategoria : 0,
      nombre: this.categoriaForm.value.nombre,
      descripcion: this.categoriaForm.value.descripcion
    };

    if (this.categoriaEditando) {
      this.categoriaService.actualizarCategoria(categoriaData.idCategoria, categoriaData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Categoría actualizada correctamente', 'success');
          this.listarCategorias();
          this.closeDialog();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar la categoría', 'error');
        }
      });
    } else {
      this.categoriaService.crearCategoria(categoriaData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Categoría creada correctamente', 'success');
          this.listarCategorias();
          this.closeDialog();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo crear la categoría', 'error');
        }
      });
    }
  }

  eliminarCategoria(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.eliminarCategoria(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Categoría eliminada correctamente', 'success');
            this.listarCategorias();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
          }
        });
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
