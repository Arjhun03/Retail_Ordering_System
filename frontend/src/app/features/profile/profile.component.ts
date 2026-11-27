import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NON_WHITESPACE_PATTERN, PHONE_PATTERN } from '../../core/auth/auth.constants';
import { UserProfileResponse } from '../../core/auth/auth.models';
import { applyValidationProblemErrors, AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly profile = signal<UserProfileResponse | null>(null);
  readonly isLoading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly isSaving = signal(false);
  readonly submitted = signal(false);
  readonly saveSuccess = signal(false);
  readonly saveError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    fullName: [
      '',
      [Validators.required, Validators.pattern(NON_WHITESPACE_PATTERN), Validators.maxLength(100)],
    ],
    phone: ['', [Validators.maxLength(15), Validators.pattern(PHONE_PATTERN)]],
  });

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.authService.loadProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.form.reset({
          fullName: data.fullName,
          phone: data.phone ?? '',
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set('Unable to load your profile right now.');
      },
    });
  }

  shouldShowError(controlName: 'fullName' | 'phone'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }

  getFieldError(controlName: 'fullName' | 'phone'): string | null {
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

    if (controlName === 'phone') {
      if (control.errors?.['maxlength']) {
        return 'Phone must be 15 characters or fewer.';
      }
      if (control.errors?.['pattern']) {
        return 'Phone may contain only digits and an optional leading +.';
      }
    }

    return null;
  }

  onSave(): void {
    this.submitted.set(true);
    this.saveSuccess.set(false);
    this.saveError.set(null);

    if (this.form.invalid || this.isSaving()) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullName, phone } = this.form.getRawValue();
    const trimmedPhone = phone.trim();

    this.isSaving.set(true);

    this.authService
      .updateProfile({
        fullName: fullName.trim(),
        phone: trimmedPhone.length > 0 ? trimmedPhone : null,
      })
      .subscribe({
        next: (updated) => {
          this.profile.set(updated);
          this.form.reset({
            fullName: updated.fullName,
            phone: updated.phone ?? '',
          });
          this.submitted.set(false);
          this.isSaving.set(false);
          this.saveSuccess.set(true);
        },
        error: (err: unknown) => {
          this.isSaving.set(false);
          if (err instanceof HttpErrorResponse && err.status === 400) {
            const extra = applyValidationProblemErrors(err, this.form);
            if (extra) {
              this.saveError.set(extra);
            }
            return;
          }
          this.saveError.set('Unable to save changes right now. Please try again.');
        },
      });
  }

  onLogout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
