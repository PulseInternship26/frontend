import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SignUpPayload {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export interface UserResponse {
  id: number;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

@Injectable({ providedIn: 'root' })
export class Auth {
  constructor(private http: HttpClient) {}

  register(payload: SignUpPayload): Observable<UserResponse> {
    return this.http.post<UserResponse>('/api/auth/register', payload);
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', payload);
  }

  saveSession(auth: LoginResponse): void {
    localStorage.setItem('token', auth.token);
    localStorage.setItem('role', auth.role);
    localStorage.setItem('email', auth.email);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
    getEmail(): string | null {
    return localStorage.getItem('email');
  }
}
