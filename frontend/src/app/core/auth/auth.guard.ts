import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from './auth.models';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree([authService.getDefaultRouteForRole()]);
};

export function roleGuard(allowedRoles: UserRole | readonly UserRole[]): CanActivateFn {
  const roles: readonly UserRole[] = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (_route, _state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUser();
    if (!user) {
      return router.createUrlTree(['/login']);
    }

    if (roles.includes(user.role)) {
      return true;
    }

    return router.createUrlTree([authService.getDefaultRouteForRole()]);
  };
}
