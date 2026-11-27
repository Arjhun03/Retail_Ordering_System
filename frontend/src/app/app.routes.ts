import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog/products', pathMatch: 'full' },
  {
    path: 'catalog',
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
  {
    path: 'cart',
    loadChildren: () =>
      import('./features/cart/cart.routes').then((m) => m.CART_ROUTES),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./features/orders/orders.routes').then((m) => m.ORDER_ROUTES),
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./features/inventory/inventory.routes').then((m) => m.INVENTORY_ROUTES),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  { path: '**', redirectTo: 'catalog/products' },
];
