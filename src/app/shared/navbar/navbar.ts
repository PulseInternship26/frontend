import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Theme } from '../../core/theme';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() username: string = '';
  @Output() logout = new EventEmitter<void>();

  constructor(public theme: Theme) {}

  onLogoutClick(): void {
    this.logout.emit();
  }
}