import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private apiToken = `${environment.apiGatewayUrl}/token`;

    constructor(private http: HttpClient) { }

    obtenerToken(credentials: { clientId: string, clientSecret: string }): Observable<any> {
        return this.http.post<{ token: string }>(this.apiToken, credentials).pipe(
            tap(resp =>
                localStorage.setItem(`access_token_${credentials.clientId}`, resp.token)
            )
        );
    }

    getToken(clientId: string): string | null {
        return localStorage.getItem(`access_token_${clientId}`);
    }

    clearTokens(): void {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('access_token_')) {
                localStorage.removeItem(key);
            }
        });
    }
}
