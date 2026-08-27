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

// Toggle this to false once the real /api/auth/register endpoint exists.
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
}