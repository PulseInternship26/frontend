import { Component } from '@angular/core';
import { Auth } from '../../core/auth';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  form: FormGroup;

constructor(private fb: FormBuilder, private authService: Auth) {    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]],
      },
      { validators: passwordsMatchValidator }
    );
  }
  onSubmit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const { email, password, confirmPassword, phone } = this.form.value;

  this.authService.register({ email, password, confirmPassword, phone }).subscribe({
    next: (user) => {
      console.log('Registered:', user);
      // We'll add navigation to the login page here soon
    },
    error: (err) => {
      console.error('Registration failed:', err);
    },
  });
}
}