import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categoria } from '../interfaces/categoria';

@Injectable({
    providedIn: 'root',
})
export class CategoriaService {
    private apiUrl = `${environment.apiGatewayUrl}/categorias`;

    constructor(private http: HttpClient) { }

    listarCategorias(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(`${this.apiUrl}/list`);
    }

    obtenerCategoriaPorId(id: number): Observable<Categoria> {
        return this.http.get<Categoria>(`${this.apiUrl}/search/id/${id}`);
    }

    crearCategoria(categoria: Categoria): Observable<string> {
        return this.http.post(`${this.apiUrl}/create`, categoria, {
            responseType: 'text',
        });
    }

    actualizarCategoria(id: number, categoria: Categoria): Observable<string> {
        return this.http.put(`${this.apiUrl}/update/${id}`, categoria, {
            responseType: 'text',
        });
    }

    eliminarCategoria(id: number): Observable<string> {
        return this.http.delete(`${this.apiUrl}/delete/${id}`, {
            responseType: 'text',
        });
    }
}
