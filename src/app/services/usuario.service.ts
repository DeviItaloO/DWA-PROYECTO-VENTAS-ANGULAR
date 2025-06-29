import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../interfaces/usuario';

@Injectable({
    providedIn: 'root',
})
export class UsuarioService {
    private apiUrl = `${environment.apiGatewayUrl}/usuarios`;

    constructor(private http: HttpClient) { }

    listarUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.apiUrl}/list`);
    }

    crearUsuario(usuario: Usuario): Observable<string> {
        return this.http.post(`${this.apiUrl}/create`, usuario, {
            responseType: 'text',
        });
    }

    actualizarUsuario(id: number, usuario: Usuario): Observable<string> {
        return this.http.put(`${this.apiUrl}/update/${id}`, usuario, {
            responseType: 'text',
        });
    }

    eliminarUsuario(id: number): Observable<string> {
        return this.http.delete(`${this.apiUrl}/delete/${id}`, {
            responseType: 'text',
        });
    }
}
