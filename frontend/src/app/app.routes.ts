import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  // 1. Initial entry point: always redirect to /login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. Auth routes (Login, Register - protected by guestGuard)
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // 3. Catalog (Products, Categories, Brands - requires login)
  {
    path: 'catalog',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/catalog/catalog.routes').then((m) => m.CATALOG_ROUTES),
  },
  {
    path: 'products',
    redirectTo: 'catalog/products',
    pathMatch: 'full',
  },
  {
    path: 'categories',
    redirectTo: 'catalog/categories',
    pathMatch: 'full',
  },
  {
    path: 'brands',
    redirectTo: 'catalog/brands',
    pathMatch: 'full',
  },

  // 4. Cart (Customer & Admin)
  {
    path: 'cart',
    canActivate: [authGuard, roleGuard(['Customer', 'Admin'])],
    loadChildren: () =>
      import('./features/cart/cart.routes').then((m) => m.CART_ROUTES),
  },

  // 5. Orders (Customer & Admin)
  {
    path: 'orders',
    canActivate: [authGuard, roleGuard(['Customer', 'Admin'])],
    loadChildren: () =>
      import('./features/orders/orders.routes').then((m) => m.ORDER_ROUTES),
  },

  // 6. Inventory (Admin only)
  {
    path: 'inventory',
    canActivate: [authGuard, roleGuard(['Admin'])],
    loadChildren: () =>
      import('./features/inventory/inventory.routes').then((m) => m.INVENTORY_ROUTES),
  },

  // 7. Profile (All authenticated roles)
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
  },

  // 8. Catch-all: redirect to /login
  { path: '**', redirectTo: 'login' },
];
