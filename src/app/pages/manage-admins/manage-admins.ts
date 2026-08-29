import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth';
import { Navbar } from '../../shared/navbar/navbar';
import { AdminService, AdminUser } from '../../core/admin.service';

@Component({
  selector: 'app-manage-admins',
  imports: [ReactiveFormsModule, Navbar],
  templateUrl: './manage-admins.html',
  styleUrl: './manage-admins.css',
})
export class ManageAdmins implements OnInit {
  admins: AdminUser[] = [];
  form: FormGroup;
  username = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private adminService: AdminService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
    });
  }

  ngOnInit(): void {
    this.username = this.authService.getEmail() || 'Admin';
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.adminService.getAdmins().subscribe({
      next: (admins) => (this.admins = admins),
      error: () => (this.errorMessage = 'Could not load admins.'),
    });
  }

  onAddAdmin(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, phone } = this.form.value;

    if (this.admins.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      this.errorMessage = 'This email is already an admin.';
      return;
    }

    this.adminService.createAdmin({ email, password, phone }).subscribe({
      next: (admin) => {
        this.admins = [...this.admins, admin];
        this.form.reset();
      },
      error: (error) => {
        this.errorMessage =
          error.status === 409 ? 'This email already exists.' : 'Could not add admin.';
      },
    });
  }

  removeAdmin(admin: AdminUser): void {
    if (!confirm(`Remove admin access for ${admin.email}?`)) return;
    this.adminService.deleteAdmin(admin.id).subscribe({
      next: () => (this.admins = this.admins.filter((a) => a.id !== admin.id)),
      error: () => (this.errorMessage = 'Could not remove admin.'),
    });
  }

  onLogout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToBooks(): void {
    this.router.navigate(['/admin/books']);
  }
}
