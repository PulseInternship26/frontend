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
  expiresIn: number;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  constructor(private http: HttpClient) {}

  private get storage(): Storage | null {
    return typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function'
      ? localStorage
      : null;
  }

  register(payload: SignUpPayload): Observable<UserResponse> {
    return this.http.post<UserResponse>('/api/auth/register', payload);
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', payload);
  }

  saveSession(auth: LoginResponse): void {
    this.storage?.setItem('token', auth.token);
    this.storage?.setItem('role', auth.role);
    this.storage?.setItem('email', auth.email);
  }

  getRole(): string | null {
    return this.storage?.getItem('role') ?? null;
  }

  getEmail(): string | null {
    return this.storage?.getItem('email') ?? null;
  }

  getToken(): string | null {
    return this.storage?.getItem('token') ?? null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  clearSession(): void {
    this.storage?.removeItem('token');
    this.storage?.removeItem('role');
    this.storage?.removeItem('email');
  }
}
