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

    const userRole = user.role?.toLowerCase().replace(/[\s_-]+/g, '') ?? '';
    const isAllowed = roles.some((r) => {
      const allowed = r.toLowerCase().replace(/[\s_-]+/g, '');
      return allowed === userRole;
    });

    if (isAllowed) {
      return true;
    }

    // Special case for Customer: anyone logged in who is neither Admin nor BrandManager is a Customer
    if (roles.some((r) => r.toLowerCase() === 'customer') && authService.isCustomer()) {
      return true;
    }

    return router.createUrlTree([authService.getDefaultRouteForRole()]);
  };
}
