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
  imageUrl: string;
}

const USE_MOCK = true;

const MOCK_BOOKS: Book[] = [
  { id: 1, title: 'Dune', author: 'Frank Herbert', category: 'Sci-Fi', price: 14.99, imageUrl: 'https://placehold.co/200x260' },
  { id: 2, title: '1984', author: 'George Orwell', category: 'Fiction', price: 10.5, imageUrl: 'https://placehold.co/200x260' },
  { id: 3, title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', price: 18.0, imageUrl: 'https://placehold.co/200x260' },
];

@Injectable({ providedIn: 'root' })
export class Books {
  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    if (USE_MOCK) {
      console.log('[MOCK] getBooks()');
      return of(MOCK_BOOKS).pipe(delay(300));
    }
    return this.http.get<Book[]>('/api/books');
  }
}