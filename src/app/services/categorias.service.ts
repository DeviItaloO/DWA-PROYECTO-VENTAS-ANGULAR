import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categoria } from '../interfaces/categoria';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
    private apiUrl = `${environment.apiGatewayUrl}/categorias`;

    constructor(private http: HttpClient) { }

    listarCategorias(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(`${this.apiUrl}/list`);
    }
}
