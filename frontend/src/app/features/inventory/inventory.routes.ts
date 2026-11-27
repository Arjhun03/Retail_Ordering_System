import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../core/auth/auth.guard';
import { InventoryListComponent } from './inventory-list.component';

export const INVENTORY_ROUTES: Routes = [
  {
    path: '',
    component: InventoryListComponent,
    canActivate: [authGuard, roleGuard('Admin')],
  },
];
