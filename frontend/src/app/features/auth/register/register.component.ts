import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NON_WHITESPACE_PATTERN, PHONE_PATTERN } from '../../../core/auth/auth.constants';
import { applyValidationProblemErrors, AuthService } from '../../../core/auth/auth.service';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value as string | undefined;
  const confirmPassword = group.get('confirmPassword')?.value as string | undefined;
  if (!confirmPassword) {
    return null;
  }
  return password === confirmPassword ? null : { passwordMismatch: true };
}

type RegisterField = 'fullName' | 'email' | 'phone' | 'password' | 'confirmPassword';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);
  readonly submitted = signal(false);
  readonly formError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group(
    {
      fullName: [
        '',
        [
          Validators.required,
          Validators.pattern(NON_WHITESPACE_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      phone: ['', [Validators.maxLength(15), Validators.pattern(PHONE_PATTERN)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  shouldShowError(controlName: RegisterField): boolean {
    const control = this.form.controls[controlName];
    const hasMismatch =
      controlName === 'confirmPassword' && this.form.hasError('passwordMismatch');
    return (control.invalid || hasMismatch) && (control.touched || this.submitted());
  }

  getFieldError(controlName: RegisterField): string | null {
    if (!this.shouldShowError(controlName)) {
      return null;
    }

    const control = this.form.controls[controlName];
    if (control.errors?.['server']) {
      return String(control.errors['server']);
    }

    if (controlName === 'fullName') {
      if (control.errors?.['required'] || control.errors?.['pattern']) {
        return 'Full name is required.';
      }
      if (control.errors?.['maxlength']) {
        return 'Full name must be 100 characters or fewer.';
      }
    }

    if (controlName === 'email') {
      if (control.errors?.['required']) {
        return 'Email is required.';
      }
      if (control.errors?.['email']) {
        return 'Enter a valid email address.';
      }
      if (control.errors?.['maxlength']) {
        return 'Email must be 150 characters or fewer.';
      }
    }

    if (controlName === 'phone') {
      if (control.errors?.['maxlength']) {
        return 'Phone must be 15 characters or fewer.';
      }
      if (control.errors?.['pattern']) {
        return 'Phone may contain only digits and an optional leading +.';
      }
    }

    if (controlName === 'password') {
      if (control.errors?.['required']) {
        return 'Password is required.';
      }
      if (control.errors?.['minlength']) {
        return 'Password must be at least 8 characters.';
      }
      if (control.errors?.['maxlength']) {
        return 'Password must be 100 characters or fewer.';
      }
    }

    if (controlName === 'confirmPassword') {
      if (control.errors?.['required']) {
        return 'Please confirm your password.';
      }
      if (this.form.hasError('passwordMismatch')) {
        return 'Passwords do not match.';
      }
    }

    return null;
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.formError.set(null);

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullName, email, phone, password } = this.form.getRawValue();
    const trimmedPhone = phone.trim();

    this.isSubmitting.set(true);

    this.authService
      .register({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: trimmedPhone.length > 0 ? trimmedPhone : null,
        password,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          void this.router.navigate(['/login'], { queryParams: { registered: '1' } });
        },
        error: (err: unknown) => {
          this.isSubmitting.set(false);
          this.handleError(err);
        },
      });
  }

  private handleError(err: unknown): void {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 409) {
        const emailControl = this.form.controls.email;
        emailControl.setErrors({
          ...(emailControl.errors ?? {}),
          server: 'This email is already registered',
        });
        emailControl.markAsTouched();
        return;
      }

      if (err.status === 400) {
        const extra = applyValidationProblemErrors(err, this.form);
        if (extra) {
          this.formError.set(extra);
        }
        return;
      }
    }

    this.formError.set('Unable to create your account right now. Please try again.');
  }
}
