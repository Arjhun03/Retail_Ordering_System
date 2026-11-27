import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { applyValidationProblemErrors, AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);
  readonly submitted = signal(false);
  readonly formError = signal<string | null>(null);
  readonly showCreatedNotice = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    const registered = this.route.snapshot.queryParamMap.get('registered');
    if (registered === '1') {
      this.showCreatedNotice.set(true);
    }
  }

  dismissNotice(): void {
    this.showCreatedNotice.set(false);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  shouldShowError(controlName: 'email' | 'password'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }

  getFieldError(controlName: 'email' | 'password'): string | null {
    const control = this.form.controls[controlName];
    if (!this.shouldShowError(controlName) || !control.errors) {
      return null;
    }

    if (control.errors['server']) {
      return String(control.errors['server']);
    }
    if (control.errors['required']) {
      return controlName === 'email' ? 'Email is required.' : 'Password is required.';
    }
    if (control.errors['email']) {
      return 'Enter a valid email address.';
    }
    if (control.errors['minlength']) {
      return 'Password must be at least 8 characters.';
    }
    if (control.errors['maxlength']) {
      return controlName === 'email'
        ? 'Email must be 150 characters or fewer.'
        : 'Password must be 100 characters or fewer.';
    }

    return 'Invalid value.';
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.formError.set(null);

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.isSubmitting.set(true);

    this.authService.login({ email: email.trim(), password }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const safeTarget =
          returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')
            ? returnUrl
            : '/products';
        void this.router.navigateByUrl(safeTarget);
      },
      error: (err: unknown) => {
        this.isSubmitting.set(false);
        this.handleError(err);
      },
    });
  }

  private handleError(err: unknown): void {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) {
        this.formError.set('Invalid email or password');
        return;
      }

      if (err.status === 400) {
        const extra = applyValidationProblemErrors(err, this.form);
        this.formError.set(extra ?? 'Please check the highlighted fields.');
        return;
      }
    }

    this.formError.set('Unable to sign in right now. Please try again.');
  }
}
