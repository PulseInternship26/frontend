import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book, BookService } from '../../core/book.service';
import { Navbar } from '../../shared/navbar/navbar';
import { Auth } from '../../core/auth';

@Component({
  selector: 'app-book-details',
  imports: [DecimalPipe, Navbar],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css',
})
export class BookDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookService = inject(BookService);
  private readonly authService = inject(Auth);

  book = signal<Book | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');
  username = this.authService.getEmail() || 'User';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.isLoading.set(false);
      this.errorMessage.set('This book could not be found.');
      return;
    }

    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.book.set(book);
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.status === 404
            ? 'This book could not be found.'
            : 'We could not load this book. Please try again.',
        );
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  onLogout(): void {
    this.authService.clearSession();
    this.router.navigate(['/login']);
  }
}
