import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Theme {
  private readonly storage =
    typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function'
      ? localStorage
      : null;

  mode = signal<'light' | 'dark'>(
    (this.storage?.getItem('theme') as 'light' | 'dark' | null) || 'light'
  );

  constructor() {
    this.apply(this.mode());
  }

  toggle(): void {
    const next = this.mode() === 'light' ? 'dark' : 'light';
    this.mode.set(next);
    this.storage?.setItem('theme', next);
    this.apply(next);
  }

  private apply(mode: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-theme', mode);
  }
}
