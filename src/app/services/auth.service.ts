import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://dev-api.wanasti.com/api/v1/user';
  private authHeader =
    'dAwMpo/TAWLhFrwwr3Wzcmc8XTdmAgp6zmGLsFmJ9HAnEbTQAg937i/hqKFjtFVQ4TnQ2y6xlVSeTKy3VWcxvalwvmPq6qF7+UcLd3wBXYoVQ2Puj49mTweKh/v2Rvj9zyVjfbexFkjMNZ5XyGucmdOI6XMmI98Zvu38Jh1fOo8157YxlgCozKkonixczjGIn3RKLuv7v3gXDRl4irzRcS6lYKGJB8vfA847GUppsVjdZV9bAjADfqUP2Iyl6Nz8MOWrSHNy8tWqhM6mI165rCwH3xMv7HEexmsMO7Mi36c=s';

  constructor(private http: HttpClient) {}

  private headers() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        auth: this.authHeader
      })
    };
  }

  login(email: string, password: string): Observable<any> {
    const body = {
      email,
      phone: '',
      phoneCode: '965',
      password,
      deviceToken: '',
      deviceType: '',
      deviceModel: '',
      appVersion: '',
      osVersion: ''
    };
    return this.http.post(`${this.baseUrl}/login?lang=en&currencyCode=KW`, body, this.headers());
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    const body = { firstName, lastName, email, password };
    return this.http.post(`${this.baseUrl}/register?lang=en&currencyCode=KW`, body, this.headers());
  }

  forgotPassword(email: string): Observable<any> {
    const body = { email };
    return this.http.post(`${this.baseUrl}/forgot-password?lang=en&currencyCode=KW`, body, this.headers());
  }
}
