import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AUTH_ENDPOINTS, AUTH_STORAGE_KEY } from './auth.constants';
import { AuthResponse } from './auth.models';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('stores session on login and updates signals', () => {
    const service = TestBed.inject(AuthService);
    const futureExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const mockResponse: AuthResponse = {
      token: 'jwt-token-123',
      expiresAtUtc: futureExpiry,
      user: {
        userId: 1,
        fullName: 'Alice Example',
        email: 'alice@example.com',
        role: 'Customer',
      },
    };

    service.login({ email: 'alice@example.com', password: 'Password123!' }).subscribe();

    const req = httpMock.expectOne(AUTH_ENDPOINTS.login);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.isLoggedIn()).toBe(true);
    expect(service.isAdmin()).toBe(false);
    expect(service.token).toBe('jwt-token-123');
    expect(service.currentUser()?.email).toBe('alice@example.com');
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toContain('jwt-token-123');
  });

  it('treats an expired stored session as logged out', () => {
    const pastExpiry = new Date(Date.now() - 60 * 1000).toISOString();
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        token: 'expired-token',
        expiresAtUtc: pastExpiry,
        user: {
          userId: 2,
          fullName: 'Expired User',
          email: 'expired@example.com',
          role: 'Admin',
        },
      }),
    );

    const service = TestBed.inject(AuthService);

    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(service.token).toBeNull();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it('clears session and storage on logout', () => {
    const service = TestBed.inject(AuthService);
    const futureExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    service.login({ email: 'admin@example.com', password: 'Password123!' }).subscribe();
    httpMock.expectOne(AUTH_ENDPOINTS.login).flush({
      token: 'admin-token',
      expiresAtUtc: futureExpiry,
      user: {
        userId: 3,
        fullName: 'Admin User',
        email: 'admin@example.com',
        role: 'Admin',
      },
    } satisfies AuthResponse);

    expect(service.isAdmin()).toBe(true);

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(service.token).toBeNull();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });
});
