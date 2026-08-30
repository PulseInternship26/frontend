import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Signup } from './signup';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a registration error', async () => {
    component.form.setValue({
      email: 'user@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: '+201001234567',
    });
    component.onSubmit();

    http.expectOne('/api/auth/register').flush(
      { message: 'Email already exists' },
      { status: 409, statusText: 'Conflict' }
    );
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Registration failed. Please try again.');
  });
});
