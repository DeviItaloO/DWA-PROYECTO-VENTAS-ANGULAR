import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../interfaces/producto';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table'; 
import { MatPaginator } from '@angular/material/paginator';

@Component({
  standalone: true,
  selector: 'app-productos',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginator, 
    MatButtonModule, 
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit, AfterViewInit {
  productos: Producto[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'precio', 'stock', 'acciones'];
  dataSource: MatTableDataSource<Producto> = new MatTableDataSource<Producto>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productosService: ProductosService,
    private router: Router,
    private dialog: MatDialogModule
  ) { }

  ngOnInit(): void {
    this.getProductos();
  }

  ngAfterViewInit(): void {
    if(this.paginator){
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.firstPage(); 
    }else {
      //console.error("Paginator no está inicializado.");
    }
  }

  getProductos(): void {
    this.productosService.getProductos().subscribe(
      (data) => {
        //console.log("Productos obtenidos: ", data);
        this.productos = data;
        this.dataSource.data = this.productos;
      },
      (error) => {
        //console.error("Error al cargar productos: ", error);
        alert("error al cargar productos: "+ error);
      }
    );
  }

  nuevoProducto(): void{
    
  }
  editarProducto(producto: any){

  }

  eliminarProducto(id: number) {

  }

}
