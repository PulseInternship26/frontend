import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/books';

  getBookById(id: number): Observable<Book> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    return this.http.get<Book>(`${this.apiUrl}/${id}`, { headers });
  }
}
