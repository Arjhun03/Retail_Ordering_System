import { Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout';
import { MyOrdersComponent } from './my-orders/my-orders';
import { OrderDetailsComponent } from './order-details/order-details';

export const ORDER_ROUTES: Routes = [
  {
    path: '',
    component: MyOrdersComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: ':id',
    component: OrderDetailsComponent,
  },
];
