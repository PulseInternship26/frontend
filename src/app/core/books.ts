import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  description?: string;
  imageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class Books {
  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>('/api/books');
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`/api/books/${id}`);
  }

  addBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>('/api/books', book);
  }

  updateBook(id: number, book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.put<Book>(`/api/books/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`/api/books/${id}`);
  }
}
