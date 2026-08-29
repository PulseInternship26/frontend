import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

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

// Toggle this to false once the real backend endpoints exist.
const USE_MOCK = true;

@Injectable({ providedIn: 'root' })
export class Auth {
  constructor(private http: HttpClient) {}

  register(payload: SignUpPayload): Observable<UserResponse> {
    if (USE_MOCK) {
      console.log('[MOCK] register()', payload);
      const mockResponse: UserResponse = {
        id: 1,
        email: payload.email,
        phone: payload.phone,
        role: 'USER',
      };
      return of(mockResponse).pipe(delay(500));
    }
    return this.http.post<UserResponse>('/api/auth/register', payload);
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    if (USE_MOCK) {
      console.log('[MOCK] login()', payload);
      // Temporary trick for testing: email containing "admin" logs in as ADMIN
      const mockResponse: LoginResponse = {
        token: 'mock-jwt-token',
        email: payload.email,
        role: payload.email.includes('admin') ? 'ADMIN' : 'USER',
      };
      return of(mockResponse).pipe(delay(500));
    }
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