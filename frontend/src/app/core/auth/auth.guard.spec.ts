import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AUTH_STORAGE_KEY } from './auth.constants';
import { authGuard, guestGuard, roleGuard } from './auth.guard';

describe('auth guards', () => {
  const route = {} as ActivatedRouteSnapshot;
  const profileState = { url: '/profile' } as RouterStateSnapshot;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  function setupTestBed(): void {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  }

  function seedSession(role: 'Customer' | 'Admin'): void {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        token: 'token-123',
        expiresAtUtc: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        user: {
          userId: 1,
          fullName: 'Test User',
          email: 'test@example.com',
          role,
        },
      }),
    );
  }

  it('authGuard redirects anonymous users to /login with returnUrl', () => {
    setupTestBed();
    const result = TestBed.runInInjectionContext(() => authGuard(route, profileState));
    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toBe('/login?returnUrl=%2Fprofile');
  });

  it('authGuard allows logged-in users', () => {
    seedSession('Customer');
    setupTestBed();
    const result = TestBed.runInInjectionContext(() => authGuard(route, profileState));
    expect(result).toBe(true);
  });

  it('guestGuard allows anonymous users and redirects logged-in users to /profile', () => {
    setupTestBed();
    const anonResult = TestBed.runInInjectionContext(() => guestGuard(route, profileState));
    expect(anonResult).toBe(true);

    TestBed.resetTestingModule();
    seedSession('Customer');
    setupTestBed();
    const loggedInResult = TestBed.runInInjectionContext(() => guestGuard(route, profileState));
    expect(loggedInResult instanceof UrlTree).toBe(true);
    expect((loggedInResult as UrlTree).toString()).toBe('/profile');
  });

  it('roleGuard enforces required role', () => {
    seedSession('Customer');
    setupTestBed();
    const customerDenied = TestBed.runInInjectionContext(() =>
      roleGuard('Admin')(route, profileState),
    );
    expect((customerDenied as UrlTree).toString()).toBe('/profile');

    TestBed.resetTestingModule();
    seedSession('Admin');
    setupTestBed();
    const adminAllowed = TestBed.runInInjectionContext(() =>
      roleGuard('Admin')(route, profileState),
    );
    expect(adminAllowed).toBe(true);
  });
});
