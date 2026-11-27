import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { AUTH_ENDPOINTS, AUTH_STORAGE_KEY } from './auth.constants';
import {
  AuthResponse,
  LoginRequest,
  ProblemDetailsError,
  RegisterRequest,
  StoredAuthSession,
  UpdateUserProfileRequest,
  UserProfileResponse,
  UserSummary,
} from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly sessionSignal = signal<StoredAuthSession | null>(this.restoreSession());

  readonly currentUser = computed<UserSummary | null>(() => {
    const session = this.sessionSignal();
    if (!session || this.isExpired(session.expiresAtUtc)) {
      return null;
    }
    return session.user;
  });

  readonly isLoggedIn = computed<boolean>(() => this.currentUser() !== null);
  readonly isAdmin = computed<boolean>(() => this.currentUser()?.role === 'Admin');
  readonly isBrandManager = computed<boolean>(() => {
    const role = this.currentUser()?.role;
    return role === 'BrandManager' || role === 'Brand Manager';
  });
  readonly isCustomer = computed<boolean>(() => this.currentUser()?.role === 'Customer');

  getDefaultRouteForRole(): string {
    const role = this.currentUser()?.role;
    if (role === 'Admin') {
      return '/inventory';
    }
    if (role === 'BrandManager' || role === 'Brand Manager') {
      return '/catalog/brands';
    }
    if (role === 'Customer') {
      return '/catalog/products';
    }
    return '/login';
  }

  get token(): string | null {
    const session = this.sessionSignal();
    if (!session) {
      return null;
    }

    if (this.isExpired(session.expiresAtUtc)) {
      this.clearSession();
      return null;
    }

    return session.token;
  }

  register(req: RegisterRequest): Observable<UserProfileResponse> {
    return this.http.post<UserProfileResponse>(AUTH_ENDPOINTS.register, req);
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH_ENDPOINTS.login, req).pipe(
      tap((response) => {
        this.saveSession({
          token: response.token,
          expiresAtUtc: response.expiresAtUtc,
          user: response.user,
        });
      }),
    );
  }

  logout(): void {
    this.clearSession();
  }

  loadProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(AUTH_ENDPOINTS.me).pipe(
      tap((profile) => this.syncUserFromProfile(profile)),
    );
  }

  updateProfile(req: UpdateUserProfileRequest): Observable<UserProfileResponse> {
    return this.http.put<UserProfileResponse>(AUTH_ENDPOINTS.me, req).pipe(
      tap((profile) => this.syncUserFromProfile(profile)),
    );
  }

  private syncUserFromProfile(profile: UserProfileResponse): void {
    const existing = this.sessionSignal();
    if (!existing) {
      return;
    }

    this.saveSession({
      ...existing,
      user: {
        userId: profile.userId,
        fullName: profile.fullName,
        email: profile.email,
        role: profile.role,
      },
    });
  }

  private saveSession(session: StoredAuthSession): void {
    if (this.isExpired(session.expiresAtUtc)) {
      this.clearSession();
      return;
    }

    this.sessionSignal.set(session);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage failures (e.g. private browsing or quota errors)
    }
  }

  private clearSession(): void {
    this.sessionSignal.set(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore storage failures
    }
  }

  private restoreSession(): StoredAuthSession | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as Partial<StoredAuthSession> | null;
      if (
        !parsed ||
        typeof parsed.token !== 'string' ||
        typeof parsed.expiresAtUtc !== 'string' ||
        !parsed.user ||
        typeof parsed.user.userId !== 'number' ||
        typeof parsed.user.email !== 'string' ||
        typeof parsed.user.fullName !== 'string' ||
        (parsed.user.role !== 'Customer' && parsed.user.role !== 'Admin')
      ) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
      }

      if (this.isExpired(parsed.expiresAtUtc)) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
      }

      return parsed as StoredAuthSession;
    } catch {
      return null;
    }
  }

  private isExpired(expiresAtUtc: string): boolean {
    const expiresMs = Date.parse(expiresAtUtc);
    return Number.isNaN(expiresMs) || expiresMs <= Date.now();
  }
}

export function applyValidationProblemErrors(
  err: HttpErrorResponse,
  form: FormGroup,
): string | null {
  const payload = err.error as ProblemDetailsError | null | undefined;
  const errors = payload?.errors;
  if (!errors || typeof errors !== 'object') {
    return null;
  }

  const controlMap = new Map<string, AbstractControl>();
  for (const key of Object.keys(form.controls)) {
    const control = form.controls[key];
    if (control) {
      controlMap.set(key.toLowerCase(), control);
    }
  }

  const unmatchedMessages: string[] = [];

  for (const rawKey of Object.keys(errors)) {
    const messages = errors[rawKey];
    if (!Array.isArray(messages) || messages.length === 0) {
      continue;
    }

    const normalizedKey = rawKey.trim().toLowerCase();
    const control = controlMap.get(normalizedKey);
    if (control) {
      control.setErrors({ ...(control.errors ?? {}), server: messages[0] });
      control.markAsTouched();
    } else {
      unmatchedMessages.push(messages[0]);
    }
  }

  return unmatchedMessages.length > 0 ? unmatchedMessages[0] : null;
}
