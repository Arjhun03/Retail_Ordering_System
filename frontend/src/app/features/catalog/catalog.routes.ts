
import { Routes } from '@angular/router';

import { BrandsComponent } from './brands/brands.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';

export const CATALOG_ROUTES: Routes = [
  {
    path: 'brands',
    component: BrandsComponent
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  }
];
