import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { CatalogService } from '../../catalog/services/catalog.service';
import { BrandResponse } from '../../catalog/models/catalog.models';
import { BrandManagerResponse, CreateBrandManagerRequest } from '../../../core/auth/auth.models';

@Component({
  selector: 'app-brand-managers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brand-managers.component.html',
  styleUrl: './brand-managers.component.scss'
})
export class BrandManagersComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly catalogService = inject(CatalogService);

  brandManagers = signal<BrandManagerResponse[]>([]);
  brands = signal<BrandResponse[]>([]);

  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  fullName = '';
  email = '';
  phone = '';
  password = '';
  brandId: number | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.catalogService.getBrands().subscribe({
      next: (brands) => {
        this.brands.set(brands.filter(b => b.isActive));
      },
      error: () => this.errorMessage.set('Failed to load brands.')
    });

    this.authService.getBrandManagers().subscribe({
      next: (managers) => {
        this.brandManagers.set(managers);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load brand managers.');
        this.loading.set(false);
      }
    });
  }

  createManager(): void {
    if (!this.fullName.trim() || !this.email.trim() || !this.password || !this.brandId) {
      this.errorMessage.set('Please fill in all required fields (Name, Email, Password, Brand).');
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage.set('Password must be at least 8 characters long.');
      return;
    }

    const request: CreateBrandManagerRequest = {
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      phone: this.phone.trim() || null,
      password: this.password,
      brandId: this.brandId
    };

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.createBrandManager(request).subscribe({
      next: (manager) => {
        this.successMessage.set(`Brand manager "${manager.fullName}" assigned to "${manager.brandName}" created successfully!`);
        this.resetForm();
        this.loadData();
        this.saving.set(false);
      },
      error: (err) => {
        const msg = err.error?.message || err.error?.title || 'Failed to create brand manager.';
        this.errorMessage.set(msg);
        this.saving.set(false);
      }
    });
  }

  resetForm(): void {
    this.fullName = '';
    this.email = '';
    this.phone = '';
    this.password = '';
    this.brandId = null;
  }
}
