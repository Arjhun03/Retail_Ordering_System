import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';
import { CheckoutComponent } from './checkout/checkout';
import { MyOrdersComponent } from './my-orders/my-orders';
import { OrderDetailsComponent } from './order-details/order-details';

export const ORDER_ROUTES: Routes = [
  {
    path: '',
    component: MyOrdersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard],
  },
  {
    path: ':id',
    component: OrderDetailsComponent,
    canActivate: [authGuard],
  },
];
