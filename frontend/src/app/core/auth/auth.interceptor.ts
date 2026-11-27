import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_BASE_URL, AUTH_ENDPOINTS } from './auth.constants';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isApiRequest = req.url.startsWith(API_BASE_URL);
  const token = isApiRequest ? authService.token : null;

  const outgoingReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(outgoingReq).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.startsWith(AUTH_ENDPOINTS.login)
      ) {
        authService.logout();
        const currentUrl = router.url;
        const queryParams = currentUrl.startsWith('/login')
          ? undefined
          : { returnUrl: currentUrl };
        void router.navigate(['/login'], { queryParams });
      }

      return throwError(() => error);
    }),
  );
};
