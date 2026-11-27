import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';
import { CartComponent } from './cart.component';

export const CART_ROUTES: Routes = [
  {
    path: '',
    component: CartComponent,
    canActivate: [authGuard],
  },
];
