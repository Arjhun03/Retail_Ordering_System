import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list.component';

export const CATALOG_ROUTES: Routes = [
  {
    path: '',
    component: ProductListComponent,
  },
];
