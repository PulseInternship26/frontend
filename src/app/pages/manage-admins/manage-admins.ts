import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth';
import { Navbar } from '../../shared/navbar/navbar';

interface AdminUser {
  id: number;
  email: string;
}

@Component({
  selector: 'app-manage-admins',
  imports: [ReactiveFormsModule, Navbar],
  templateUrl: './manage-admins.html',
  styleUrl: './manage-admins.css',
})
export class ManageAdmins implements OnInit {
  admins: AdminUser[] = [{ id: 1, email: 'admin@bookstore.com' }];
  form: FormGroup;
  username = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.username = this.authService.getEmail() || 'Admin';
  }

  onAddAdmin(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.value.email;

    if (this.admins.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      this.errorMessage = 'This email is already an admin.';
      return;
    }

    // TODO: replace with real POST /api/admins call once backend exists
    this.admins = [...this.admins, { id: Date.now(), email }];
    this.form.reset();
  }

  removeAdmin(admin: AdminUser): void {
    if (!confirm(`Remove admin access for ${admin.email}?`)) return;
    this.admins = this.admins.filter((a) => a.id !== admin.id);
  }

  onLogout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToBooks(): void {
    this.router.navigate(['/admin/books']);
  }
}