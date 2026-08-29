import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Books, Book } from '../../core/books';
import { Auth } from '../../core/auth';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-admin-dashboard',
  imports: [ReactiveFormsModule, Navbar],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  books: Book[] = [];
  showForm = false;
  editingId: number | null = null;
  form: FormGroup;
  username = '';

  constructor(
    private booksService: Books,
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      imageUrl: ['https://placehold.co/200x260'],
    });
  }

  ngOnInit(): void {
    this.username = this.authService.getEmail() || 'Admin';
    this.loadBooks();
  }

  loadBooks(): void {
    this.booksService.getBooks().subscribe({
      next: (books) => (this.books = books),
      error: (err) => console.error('Failed to load books:', err),
    });
  }

  openAddForm(): void {
    this.editingId = null;
    this.form.reset({ price: 0, imageUrl: 'https://placehold.co/200x260' });
    this.showForm = true;
  }

  openEditForm(book: Book): void {
    this.booksService.getBook(book.id).subscribe({
      next: (fullBook) => {
        this.editingId = fullBook.id;
        this.form.setValue({
          title: fullBook.title,
          author: fullBook.author,
          category: fullBook.category,
          price: fullBook.price,
          description: fullBook.description || '',
          imageUrl: fullBook.imageUrl,
        });
        this.showForm = true;
      },
      error: (err) => console.error('Failed to load book details:', err),
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    if (this.editingId !== null) {
      this.booksService.updateBook(this.editingId, value).subscribe({
        next: () => {
          this.loadBooks();
          this.cancelForm();
        },
      });
    } else {
      this.booksService.addBook(value).subscribe({
        next: () => {
          this.loadBooks();
          this.cancelForm();
        },
      });
    }
  }

  deleteBook(book: Book): void {
    if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    this.booksService.deleteBook(book.id).subscribe({
      next: () => this.loadBooks(),
    });
  }

  onLogout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToManageAdmins(): void {
    this.router.navigate(['/admin/admins']);
  }
}
