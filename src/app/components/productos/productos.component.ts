import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../interfaces/producto';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

//import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';

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
    ReactiveFormsModule,
    //BrowserAnimationsModule 
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'precio', 'stock', 'acciones'];
  paginacion: Producto[] = [];
  numeroPagina = 5;
  numeroActual = 0;
  totalProductos = 0;
  productoForm: FormGroup;
  isDialogVisible: boolean = false;
  producto?: Producto;
  titulo?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(
    private productosService: ProductosService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.productoForm = this.fb.group({
      idProducto: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', Validators.required],
      stock: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getProductos();
  }

  getProductos(): void {
    this.productosService.getProductos().subscribe(
      (response) => {
        this.productos = response;
        //console.log("Productos: ", this.productos);
        this.totalProductos = this.productos.length;
        this.productosPaginados();
        //this.paginator.firstPage();
        //this.dataSource.data = data;//this.productos;
      },
      (error) => {
        //console.error("Error al cargar productos: ", error);
        //alert("error al cargar productos: "+ error);
        //const mensaje = error.error.message
          Swal.fire({
            allowOutsideClick: true,
            title: 'Failed',
            text: 'Error en el servidor',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        })
      }
    );
  }

  productosPaginados(): void {
    const inicio = this.numeroActual * this.numeroPagina;
    const final = inicio + this.numeroPagina;
    this.paginacion = this.productos.slice(inicio, final);
    
  }

  openDialog() {
    //this.isDialogVisible =true;
    this.producto = undefined;
    this.titulo = 'Nuevo Producto';
    this.dialog.open(this.dialogTemplate, {
      width: '400px'
    });
  }

  saveProducto(): void {
    if(this.productoForm.valid){
      const productoData: Producto = this.productoForm.value;
      productoData.idCategoria = 1; 
      
      if (!this.producto?.idProducto) {
        //console.log("producto:" + JSON.stringify(productoData));
        this.productosService.crearProducto(productoData).subscribe(
          (response) => {
            const mensaje = response.message
            Swal.fire({
              allowOutsideClick: true,
              title: 'Success',
              text: mensaje,
              icon: 'success',
              confirmButtonText: 'regresar'
            }).then((click) => {
              if(click.isConfirmed){
                this.getProductos();
                this.closeDialog();
              }
            });
          },
          (error) =>{
            //console.log(error);
            const mensaje = error.error.message
            Swal.fire({
              allowOutsideClick: true,
              title: 'Failed',
              text: mensaje,
              icon: 'warning',
              confirmButtonText: 'Aceptar'
            })
          }
      );
      }else {
        this.productosService.actualizarProducto(this.producto.idProducto, productoData).subscribe(
          (response) => {
            const mensaje = response.message;
            Swal.fire({
              allowOutsideClick: true,
              title: 'Success',
              text: mensaje,
              icon: 'success',
              confirmButtonText: 'Regresar'
            }).then((click) => {
              if(click.isConfirmed){
                this.getProductos();
                this.closeDialog();
              }
            });
          },
          (error) => {
            const mensaje = error.error?.message;
            Swal.fire({
              allowOutsideClick: true,
              title: 'Failed',
              text: mensaje,
              icon: 'warning',
              confirmButtonText: 'Aceptar'
            });
          }
        )
      }
    }else{

    }
  }

  editarProducto(producto: Producto){
    this.producto = producto;
    //console.log(this.producto);
    
    this.productoForm.patchValue({
      idProducto: producto.idProducto,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock
    });
    this.titulo = 'Editar Producto';
    //this.isDialogVisible = true;
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
      if(click.isConfirmed){
        this.productosService.eliminarProducto(id).subscribe(
          (response) => {
            const mensaje = response.message;
            Swal.fire({
              title: 'Eliminado',
              text: mensaje,
              icon: 'success',
              confirmButtonText: 'Aceptar'
          }).then(() => {
              this.getProductos();
          });
          },
          (error) => {
            const mensaje = error.error?.message;
            Swal.fire({
                title: 'Error',
                text: mensaje,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
        );
      }

    });
  }

  abrirCarrito(){
    //alert("");
  }

  logout(){
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    this.router.navigate(['/login']);
  }

  closeDialog() {
    this.productoForm.reset();
    //this.isDialogVisible = false;
    this.dialog.closeAll();
  }

  onPage(event: any): void{
    this.numeroActual = event.pageIndex;
    this.numeroPagina = event.pageSize;
    this.productosPaginados();
  }

}
