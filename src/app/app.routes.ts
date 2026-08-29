import { Routes } from '@angular/router';
import { Signup } from './pages/signup/signup';
import { Login } from './pages/login/login';
import { CustomerHome } from './pages/customer-home/customer-home';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { ManageAdmins } from './pages/manage-admins/manage-admins';
import { BookDetails } from './pages/book-details/book-details';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'home', component: CustomerHome },
  { path: 'books/:id', component: BookDetails },
  { path: 'admin/books', component: AdminDashboard },
  { path: 'admin/admins', component: ManageAdmins },
];
