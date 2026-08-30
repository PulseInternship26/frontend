import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { AdminService, AdminUser } from '../../core/admin.service';

@Component({
  selector: 'app-manage-admins',
  imports: [ReactiveFormsModule, AdminSidebar],
  templateUrl: './manage-admins.html',
  styleUrl: './manage-admins.css',
})
export class ManageAdmins implements OnInit {
  admins = signal<AdminUser[]>([]);
  form: FormGroup;
  showAddForm = signal(false);
  username = '';
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private adminService: AdminService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
    });
  }

  ngOnInit(): void {
    this.username = this.authService.getEmail() || 'Admin';
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.adminService.getAdmins().subscribe({
      next: (admins) => this.admins.set(admins),
      error: () => this.errorMessage.set('Could not load admins.'),
    });
  }

  openAddForm(): void {
    this.errorMessage.set('');
    this.form.reset();
    this.showAddForm.set(true);
  }

  cancelAddForm(): void {
    this.form.reset();
    this.showAddForm.set(false);
  }

  onAddAdmin(): void {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, phone } = this.form.value;

    if (this.admins().some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      this.errorMessage.set('This email is already an admin.');
      return;
    }

    this.adminService.createAdmin({ email, password, phone }).subscribe({
      next: (admin) => {
        this.admins.update((admins) => [...admins, admin]);
        this.cancelAddForm();
      },
      error: (error) => {
        this.errorMessage.set(
          error.status === 409 ? 'This email already exists.' : 'Could not add admin.'
        );
      },
    });
  }

  removeAdmin(admin: AdminUser): void {
    if (!confirm(`Remove admin access for ${admin.email}?`)) return;
    this.adminService.deleteAdmin(admin.id).subscribe({
      next: () => this.admins.update((admins) => admins.filter((a) => a.id !== admin.id)),
      error: () => this.errorMessage.set('Could not remove admin.'),
    });
  }

  onLogout(): void {
    this.authService.clearSession();
    this.router.navigate(['/login']);
  }
}
