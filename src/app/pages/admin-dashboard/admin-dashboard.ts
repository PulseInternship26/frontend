import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Books, Book } from '../../core/books';
import { Auth } from '../../core/auth';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-dashboard',
  imports: [ReactiveFormsModule, AdminSidebar],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  books = signal<Book[]>([]);
  showForm = signal(false);
  editingId = signal<number | null>(null);
  errorMessage = signal('');
  form: FormGroup;
  username = '';

  constructor(
    private booksService: Books,
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      author: ['', [Validators.required, Validators.maxLength(255)]],
      category: ['', [Validators.required, Validators.maxLength(255)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      imageUrl: ['https://placehold.co/200x260', [Validators.required, Validators.maxLength(255)]],
    });
  }

  ngOnInit(): void {
    this.username = this.authService.getEmail() || 'Admin';
    this.loadBooks();
  }

  loadBooks(): void {
    this.errorMessage.set('');
    this.booksService.getBooks().subscribe({
      next: (books) => this.books.set(books),
      error: () => this.errorMessage.set('Could not load books. Please try again.'),
    });
  }

  openAddForm(): void {
    this.editingId.set(null);
    this.form.reset({ price: 0, imageUrl: 'https://placehold.co/200x260' });
    this.showForm.set(true);
  }

  openEditForm(book: Book): void {
    this.booksService.getBook(book.id).subscribe({
      next: (fullBook) => {
        this.editingId.set(fullBook.id);
        this.form.setValue({
          title: fullBook.title,
          author: fullBook.author,
          category: fullBook.category,
          price: fullBook.price,
          description: fullBook.description || '',
          imageUrl: fullBook.imageUrl,
        });
        this.showForm.set(true);
      },
      error: (err) => console.error('Failed to load book details:', err),
    });
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  onSubmit(): void {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const editingId = this.editingId();

    if (editingId !== null) {
      this.booksService.updateBook(editingId, value).subscribe({
        next: () => {
          this.loadBooks();
          this.cancelForm();
        },
        error: () => this.errorMessage.set('Could not update the book. Please try again.'),
      });
    } else {
      this.booksService.addBook(value).subscribe({
        next: () => {
          this.loadBooks();
          this.cancelForm();
        },
        error: () => this.errorMessage.set('Could not add the book. Please try again.'),
      });
    }
  }

  deleteBook(book: Book): void {
    if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    this.booksService.deleteBook(book.id).subscribe({
      next: () => this.loadBooks(),
      error: () => this.errorMessage.set('Could not delete the book. Please try again.'),
    });
  }

  onLogout(): void {
    this.authService.clearSession();
    this.router.navigate(['/login']);
  }
}
