import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Theme {
  mode = signal<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  constructor() {
    this.apply(this.mode());
  }

  toggle(): void {
    const next = this.mode() === 'light' ? 'dark' : 'light';
    this.mode.set(next);
    localStorage.setItem('theme', next);
    this.apply(next);
  }

  private apply(mode: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-theme', mode);
  }
}