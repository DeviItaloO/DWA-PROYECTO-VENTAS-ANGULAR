import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../interfaces/producto';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EstadoProducto } from '../../enum/estado-producto';
import { CategoriaService } from '../../services/categorias.service';
import { Categoria } from '../../interfaces/categoria';

@Component({
  standalone: true,
  selector: 'app-productos',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginator,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit, AfterViewInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'precio', 'stock', 'estado', 'categoria', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);
  productoForm: FormGroup;
  isDialogVisible: boolean = false;
  producto?: Producto;
  titulo?: string;
  estados = Object.values(EstadoProducto);
  filtroCategoria: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(
    private productosService: ProductosService,
    private categoriaService: CategoriaService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.productoForm = this.fb.group({
      idProducto: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      estado: ['', Validators.required],
      idCategoria: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getCategorias();
    this.getProductos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (response) => {
        this.productos = response;
        this.dataSource.data = response;
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
      }
    });
  }

  getCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (response) => {
        this.categorias = response;
        this.productoForm.patchValue({ idCategoria: response[0]?.idCategoria });
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
      }
    });
  }

  applyFilter(): void {
    if (this.filtroCategoria != null) {
      this.dataSource.data = this.productos.filter(p => p.idCategoria === this.filtroCategoria);
    } else {
      this.dataSource.data = this.productos;
    }
  }

  openDialog(isEdit = false, producto?: Producto): void {
    this.titulo = isEdit ? 'Editar Producto' : 'Nuevo Producto';

    if (isEdit && producto) {
      this.productoForm.patchValue(producto);
    } else {
      this.productoForm.reset({
        estado: EstadoProducto.DISPONIBLE,
        idCategoria: this.categorias[0]?.idCategoria
      });
    }

    this.dialog.open(this.dialogTemplate, {
      width: '400px'
    });
  }

  saveProducto(): void {
    if (this.productoForm.valid) {
      const productoData: Producto = this.productoForm.value;

      if (!this.producto?.idProducto) {
        this.productosService.crearProducto(productoData).subscribe({
          next: (response) => {
            Swal.fire('Success', response.message, 'success');
            this.getProductos();
            this.closeDialog();
          },
          error: (error) => {
            Swal.fire('Failed', error.error.message, 'warning');
          }
        });
      } else {
        this.productosService.actualizarProducto(this.producto.idProducto, productoData).subscribe({
          next: (response) => {
            Swal.fire('Success', response.message, 'success');
            this.getProductos();
            this.closeDialog();
          },
          error: (error) => {
            Swal.fire('Failed', error.error?.message, 'warning');
          }
        })
      }
    } else {

    }
  }

  editarProducto(producto: Producto) {
    this.producto = producto;
    this.productoForm.patchValue({
      idProducto: producto.idProducto,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      estado: producto.estado,
      idCategoria: producto.idCategoria
    });
    this.titulo = 'Editar Producto';
    this.dialog.open(this.dialogTemplate, {
      width: '400px'
    });
  }

  eliminarProducto(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    }).then((click) => {
      if (click.isConfirmed) {
        this.productosService.eliminarProducto(id).subscribe({
          next: (response) => {
            Swal.fire('Eliminado', response.message, 'success');
            this.getProductos();
          },
          error: (error) => {
            Swal.fire('Error', error.error?.message, 'error');
          }
        });
      }
    });
  }

  getNombreCategoria(id: number): string {
    const cat = this.categorias.find(c => c.idCategoria === id);
    return cat ? cat.nombre : '';
  }

  closeDialog() {
    this.productoForm.reset();
    this.dialog.closeAll();
  }
}
