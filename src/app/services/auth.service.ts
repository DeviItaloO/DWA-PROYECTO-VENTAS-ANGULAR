import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiGatewayUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(user: {username: string, password: string}): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`,user);
  }
}
