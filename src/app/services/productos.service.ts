import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.apiUrl}/list`);
  }

  crearProducto(producto: Producto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, producto);
  }

  actualizarProducto(id: number, producto: Producto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
}
