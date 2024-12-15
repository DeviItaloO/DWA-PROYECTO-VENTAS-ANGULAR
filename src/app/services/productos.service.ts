import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const username = 'user';
    const password = 'a6c12ece-6e87-4ad2-8c50-3a3ab3418c93';
    const basicAuth = 'Basic ' + btoa(`${username}:${password}`);
    return new HttpHeaders({ Authorization: basicAuth });
  }

  getProductos(): Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.apiUrl}/list`, { headers: this.getAuthHeaders() });
  }

  crearProducto(producto: Producto): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/create`, producto, { headers: this.getAuthHeaders() });
  }

  actualizarProducto(id: number, producto: Producto): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/update/${id}`, producto, { headers: this.getAuthHeaders() });
  }

  eliminarProducto(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete/${id}`, { headers: this.getAuthHeaders() });
  }
}
