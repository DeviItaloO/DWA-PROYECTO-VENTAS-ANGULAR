import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  private getAutenticacion(): HttpHeaders {
    const username = 'user';
    const password = 'b70ba5cc-69c0-471d-9c7c-a41034b93872';
    const basica = 'Basic ' + btoa(`${username}:${password}`);
    return new HttpHeaders({ Authorization: basica });
  }

  getProductos(): Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.apiUrl}/list`, { headers: this.getAutenticacion() });
  }

  crearProducto(producto: Producto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, producto, { headers: this.getAutenticacion() });
  }

  actualizarProducto(id: number, producto: Producto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, producto, { headers: this.getAutenticacion() });
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, { headers: this.getAutenticacion() });
  }
}
