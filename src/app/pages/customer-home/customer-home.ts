import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { BookCard } from '../../shared/book-card/book-card';
import { Books, Book } from '../../core/books';
import { Auth } from '../../core/auth';

@Component({
  selector: 'app-customer-home',
  imports: [Navbar, BookCard],
  templateUrl: './customer-home.html',
  styleUrl: './customer-home.css',
})
export class CustomerHome implements OnInit {
  books = signal<Book[]>([]);
  username: string = '';

  constructor(
    private booksService: Books,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('email') || 'User';

    this.booksService.getBooks().subscribe({
      next: (data) => this.books.set(data),
      error: (err) => {
        console.error('Failed to load books:', err);
      },
    });
  }

  onLogout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  onViewDetails(bookId: number): void {
    this.router.navigate(['/books', bookId]);
  }
}
