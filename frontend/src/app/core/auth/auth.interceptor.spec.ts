import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AUTH_ENDPOINTS, AUTH_STORAGE_KEY } from './auth.constants';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let router: Router;
  let authService: AuthService;

  beforeEach(() => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        token: 'valid-jwt',
        expiresAtUtc: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        user: {
          userId: 1,
          fullName: 'Alice',
          email: 'alice@example.com',
          role: 'Customer',
        },
      }),
    );

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('attaches Bearer token only to /api requests', () => {
    http.get('/api/users/me').subscribe();
    const apiReq = httpMock.expectOne('/api/users/me');
    expect(apiReq.request.headers.get('Authorization')).toBe('Bearer valid-jwt');
    apiReq.flush({});

    http.get('https://example.com/public.json').subscribe();
    const extReq = httpMock.expectOne('https://example.com/public.json');
    expect(extReq.request.headers.has('Authorization')).toBe(false);
    extReq.flush({});
  });

  it('clears session and redirects to /login on 401 from non-login endpoints', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    http.get(AUTH_ENDPOINTS.me).subscribe({ error: () => undefined });
    const req = httpMock.expectOne(AUTH_ENDPOINTS.me);
    req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(authService.isLoggedIn()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/' },
    });
  });

  it('does not redirect on 401 from /api/auth/login', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    http.post(AUTH_ENDPOINTS.login, {}).subscribe({ error: () => undefined });
    const req = httpMock.expectOne(AUTH_ENDPOINTS.login);
    req.flush({ error: 'Invalid' }, { status: 401, statusText: 'Unauthorized' });

    expect(authService.isLoggedIn()).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
