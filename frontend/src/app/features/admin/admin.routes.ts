import { Routes } from '@angular/router';
import { BrandManagersComponent } from './brand-managers/brand-managers.component';

export const ADMIN_ROUTES: Routes = [
  { path: 'brand-managers', component: BrandManagersComponent },
  { path: '', redirectTo: 'brand-managers', pathMatch: 'full' }
];
