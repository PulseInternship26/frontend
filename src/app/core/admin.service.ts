import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AdminUser {
  id: number;
  email: string;
  phone: string;
  role: 'ADMIN';
}

export interface CreateAdminPayload {
  email: string;
  password: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getAdmins(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>('/api/admins');
  }

  createAdmin(payload: CreateAdminPayload): Observable<AdminUser> {
    return this.http.post<AdminUser>('/api/admins', payload);
  }

  deleteAdmin(id: number): Observable<void> {
    return this.http.delete<void>(`/api/admins/${id}`);
  }
}
