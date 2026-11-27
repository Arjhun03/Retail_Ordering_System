import { Routes } from '@angular/router';
import { roleGuard } from '../../core/auth/auth.guard';
import { BrandsComponent } from './brands/brands.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';

export const CATALOG_ROUTES: Routes = [
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [roleGuard(['Admin', 'BrandManager', 'Brand Manager'])],
  },
  {
    path: 'brands',
    component: BrandsComponent,
    canActivate: [roleGuard(['Admin', 'BrandManager', 'Brand Manager'])],
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
];
