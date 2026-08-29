import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  description?: string;
  imageUrl: string;
}

const USE_MOCK = true;

let MOCK_BOOKS: Book[] = [
  { id: 1, title: 'Dune', author: 'Frank Herbert', category: 'Sci-Fi', price: 14.99, description: 'A sweeping saga of politics and prophecy on a desert planet.', imageUrl: 'https://placehold.co/200x260' },
  { id: 2, title: '1984', author: 'George Orwell', category: 'Fiction', price: 10.5, description: 'A dystopian vision of a totalitarian future.', imageUrl: 'https://placehold.co/200x260' },
  { id: 3, title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', price: 18.0, description: 'A brief history of humankind.', imageUrl: 'https://placehold.co/200x260' },
];

let nextId = 4;

@Injectable({ providedIn: 'root' })
export class Books {
  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    if (USE_MOCK) {
      return of(MOCK_BOOKS).pipe(delay(300));
    }
    return this.http.get<Book[]>('/api/books');
  }

  addBook(book: Omit<Book, 'id'>): Observable<Book> {
    if (USE_MOCK) {
      const newBook: Book = { ...book, id: nextId++ };
      MOCK_BOOKS = [...MOCK_BOOKS, newBook];
      return of(newBook).pipe(delay(300));
    }
    return this.http.post<Book>('/api/books', book);
  }

  updateBook(id: number, book: Omit<Book, 'id'>): Observable<Book> {
    if (USE_MOCK) {
      const updated: Book = { ...book, id };
      MOCK_BOOKS = MOCK_BOOKS.map((b) => (b.id === id ? updated : b));
      return of(updated).pipe(delay(300));
    }
    return this.http.put<Book>(`/api/books/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    if (USE_MOCK) {
      MOCK_BOOKS = MOCK_BOOKS.filter((b) => b.id !== id);
      return of(undefined).pipe(delay(300));
    }
    return this.http.delete<void>(`/api/books/${id}`);
  }
}