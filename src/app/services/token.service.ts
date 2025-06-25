import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private apiToken = `${environment.apiGatewayUrl}/token`;
    private currentClientId: string | null = null;

    constructor(private http: HttpClient) { }

    obtenerToken(credentials: { clientId: string, clientSecret: string }): Observable<any> {
        //console.log(credentials);
        return this.http.post(this.apiToken, credentials).pipe(
            tap((response: any) => {
                const key = this.getStorageKey(credentials.clientId);
                localStorage.setItem(key, response.token);
                this.currentClientId = credentials.clientId;
            })
        );
    }

    getActiveClientId(): string | null {
        return this.currentClientId;
    }

    getToken(clientId: string): string | null {
        const key = this.getStorageKey(clientId);
        return localStorage.getItem(key);
    }

    clearToken(clientId: string): void {
        const key = this.getStorageKey(clientId);
        localStorage.removeItem(key);
    }

    private getStorageKey(clientId: string): string {
        return `access_token_${clientId}`;
    }
}
