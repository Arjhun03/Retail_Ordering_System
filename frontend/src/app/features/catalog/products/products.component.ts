
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CatalogService } from '../services/catalog.service';
import {
  BrandResponse,
  CategoryResponse,
  ProductListItemResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQuery
} from '../models/catalog.models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);

  products = signal<ProductListItemResponse[]>([]);
  brands = signal<BrandResponse[]>([]);
  categories = signal<CategoryResponse[]>([]);

  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  editingId: number | null = null;

  productName = '';
  description = '';
  imageUrl = '';
  brandId: number | null = null;
  categoryId: number | null = null;

  search = '';
  selectedBrandId: number | null = null;
  selectedCategoryId: number | null = null;

  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalCount = 0;

  ngOnInit(): void {
    this.loadFilters();
    this.loadProducts();
  }

  loadFilters(): void {
    this.catalogService.getBrands().subscribe({
      next: (data) => this.brands.set(data.filter(b => b.isActive)),
      error: () => this.errorMessage.set('Unable to load brands.')
    });

    this.catalogService.getCategories().subscribe({
      next: (data) => this.categories.set(data.filter(c => c.isActive)),
      error: () => this.errorMessage.set('Unable to load categories.')
    });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const filters: ProductQuery = {
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.search.trim() || undefined,
      brandId: this.selectedBrandId ?? undefined,
      categoryId: this.selectedCategoryId ?? undefined
    };

    this.catalogService.getProducts(filters).subscribe({
      next: (response) => {
        this.products.set(response.items);
        this.currentPage = response.page;
        this.totalPages = response.totalPages;
        this.totalCount = response.totalCount;
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load products. Please try again.');
        this.loading.set(false);
      }
    });
  }

  saveProduct(): void {
    const name = this.productName.trim();

    if (!name) {
      this.errorMessage.set('Product name is required.');
      return;
    }

    if (!this.brandId || !this.categoryId) {
      this.errorMessage.set('Please select a brand and category.');
      return;
    }

    const request: CreateProductRequest = {
      productName: name,
      brandId: this.brandId,
      categoryId: this.categoryId,
      description: this.description.trim() || null,
      imageUrl: this.imageUrl.trim() || null
    };

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.editingId !== null) {
      const updateRequest: UpdateProductRequest = {
        ...request,
        isActive: true
      };

      this.catalogService.updateProduct(this.editingId, updateRequest).subscribe({
        next: () => {
          this.successMessage.set('Product updated successfully.');
          this.resetForm();
          this.loadProducts();
          this.saving.set(false);
        },
        error: (error) => this.handleError(error)
      });
    } else {
      this.catalogService.createProduct(request).subscribe({
        next: () => {
          this.successMessage.set('Product created successfully.');
          this.resetForm();
          this.loadProducts();
          this.saving.set(false);
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  editProduct(product: ProductListItemResponse): void {
    this.editingId = product.productId;
    this.productName = product.productName;
    this.description = product.description ?? '';
    this.imageUrl = product.imageUrl ?? '';
    this.brandId = product.brandId;
    this.categoryId = product.categoryId;

    this.errorMessage.set('');
    this.successMessage.set('');
  }

  deleteProduct(product: ProductListItemResponse): void {
    if (!confirm(`Are you sure you want to deactivate ${product.productName}?`)) {
      return;
    }

    this.catalogService.deleteProduct(product.productId).subscribe({
      next: () => {
        this.successMessage.set('Product deactivated successfully.');
        this.loadProducts();
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message || 'Unable to deactivate product.'
        );
      }
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.productName = '';
    this.description = '';
    this.imageUrl = '';
    this.brandId = null;
    this.categoryId = null;
  }

  searchProducts(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  clearFilters(): void {
    this.search = '';
    this.selectedBrandId = null;
    this.selectedCategoryId = null;
    this.currentPage = 1;
    this.loadProducts();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
    this.loadProducts();
  }

  private handleError(error: any): void {
    this.errorMessage.set(
      error.error?.message || 'Something went wrong. Please try again.'
    );
    this.saving.set(false);
  }
}
