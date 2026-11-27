
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/auth/auth.service';
import { CatalogService } from '../services/catalog.service';
import {
  BrandResponse,
  CreateBrandRequest,
  UpdateBrandRequest
} from '../models/catalog.models';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  readonly authService = inject(AuthService);

  brands = signal<BrandResponse[]>([]);
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  editingId: number | null = null;
  brandName = '';
  description = '';

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    if (this.authService.isBrandManager()) {
      this.catalogService.getMyBrand().subscribe({
        next: (brand) => {
          this.brands.set([brand]);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Unable to load your brand details. Please try again.');
          this.loading.set(false);
        }
      });
      return;
    }

    this.catalogService.getBrands().subscribe({
      next: (data) => {
        this.brands.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load brands. Please try again.');
        this.loading.set(false);
      }
    });
  }

  saveBrand(): void {
    const name = this.brandName.trim();

    if (!name) {
      this.errorMessage.set('Brand name is required.');
      return;
    }

    if (name.length > 100) {
      this.errorMessage.set('Brand name cannot exceed 100 characters.');
      return;
    }

    if (this.description.length > 500) {
      this.errorMessage.set('Description cannot exceed 500 characters.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.authService.isBrandManager()) {
      const request: UpdateBrandRequest = {
        brandName: name,
        description: this.description.trim() || null,
        isActive: true
      };

      this.catalogService.updateMyBrand(request).subscribe({
        next: () => {
          this.successMessage.set('Brand details updated successfully.');
          this.resetForm();
          this.loadBrands();
          this.saving.set(false);
        },
        error: (error) => this.handleError(error)
      });
      return;
    }

    if (this.editingId !== null) {
      const request: UpdateBrandRequest = {
        brandName: name,
        description: this.description.trim() || null,
        isActive: true
      };

      this.catalogService.updateBrand(this.editingId, request).subscribe({
        next: () => {
          this.successMessage.set('Brand updated successfully.');
          this.resetForm();
          this.loadBrands();
          this.saving.set(false);
        },
        error: (error) => this.handleError(error)
      });
    } else {
      const request: CreateBrandRequest = {
        brandName: name,
        description: this.description.trim() || null
      };

      this.catalogService.createBrand(request).subscribe({
        next: () => {
          this.successMessage.set('Brand created successfully.');
          this.resetForm();
          this.loadBrands();
          this.saving.set(false);
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  editBrand(brand: BrandResponse): void {
    this.editingId = brand.brandId;
    this.brandName = brand.brandName;
    this.description = brand.description ?? '';
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  deleteBrand(brand: BrandResponse): void {
    if (!confirm(`Are you sure you want to deactivate ${brand.brandName}?`)) {
      return;
    }

    this.catalogService.deleteBrand(brand.brandId).subscribe({
      next: () => {
        this.successMessage.set('Brand deactivated successfully.');
        this.loadBrands();
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message || 'Unable to deactivate brand.'
        );
      }
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.brandName = '';
    this.description = '';
  }

  private handleError(error: any): void {
    this.errorMessage.set(
      error.error?.message || 'Something went wrong. Please try again.'
    );
    this.saving.set(false);
  }
}
