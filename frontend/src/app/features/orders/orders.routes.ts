import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';
import { OrderListComponent } from './order-list.component';

export const ORDER_ROUTES: Routes = [
  {
    path: '',
    component: OrderListComponent,
    canActivate: [authGuard],
  },
];
