
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { CatalogService } from '../services/catalog.service';
import {
  BrandResponse,
  CategoryResponse,
  ProductListItemResponse,
  ProductPackagingSummary,
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
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  readonly defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80';

  products = signal<ProductListItemResponse[]>([]);
  brands = signal<BrandResponse[]>([]);
  categories = signal<CategoryResponse[]>([]);

  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  addingToCartId = signal<number | null>(null);
  buyingNowId = signal<number | null>(null);
  selectedPackaging: Record<number, number> = {};

  editingId: number | null = null;

  productName = '';
  description = '';
  imageUrl = '';
  price: number | null = null;
  unit = '1 Unit';
  packagingName = 'Standard';
  brandId: number | null = null;
  categoryId: number | null = null;

  search = '';
  selectedBrandId: number | null = null;
  selectedCategoryId: number | null = null;

  currentPage = 1;
  pageSize = 12;
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

    if (this.authService.isBrandManager()) {
      this.catalogService.getMyBrandProducts(filters).subscribe({
        next: (response) => {
          this.products.set(response.items);
          this.currentPage = response.page;
          this.totalPages = response.totalPages;
          this.totalCount = response.totalCount;
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Unable to load your brand products. Please try again.');
          this.loading.set(false);
        }
      });
      return;
    }

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

    if (!this.categoryId) {
      this.errorMessage.set('Please select a category.');
      return;
    }

    if (!this.imageUrl.trim()) {
      this.errorMessage.set('Product image URL is required.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.authService.isBrandManager()) {
      if (this.editingId !== null) {
        this.catalogService.updateMyBrandProduct(this.editingId, {
          categoryId: this.categoryId,
          productName: name,
          description: this.description.trim() || null,
          imageUrl: this.imageUrl.trim(),
          isActive: true
        }).subscribe({
          next: () => {
            this.successMessage.set('Product updated successfully.');
            this.resetForm();
            this.loadProducts();
            this.saving.set(false);
          },
          error: (error) => this.handleError(error)
        });
      } else {
        this.catalogService.createMyBrandProduct({
          categoryId: this.categoryId,
          productName: name,
          description: this.description.trim() || null,
          imageUrl: this.imageUrl.trim(),
          price: this.price,
          unit: this.unit.trim() || null,
          packagingName: this.packagingName.trim() || null
        }).subscribe({
          next: () => {
            this.successMessage.set('Product added to your brand successfully.');
            this.resetForm();
            this.loadProducts();
            this.saving.set(false);
          },
          error: (error) => this.handleError(error)
        });
      }
      return;
    }

    if (!this.brandId) {
      this.errorMessage.set('Please select a brand.');
      this.saving.set(false);
      return;
    }

    const request: CreateProductRequest = {
      productName: name,
      brandId: this.brandId,
      categoryId: this.categoryId,
      description: this.description.trim() || null,
      imageUrl: this.imageUrl.trim()
    };

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
    this.price = null;
    this.unit = '1 Unit';
    this.packagingName = 'Standard';
    this.brandId = null;
    this.categoryId = null;
  }

  getActivePackaging(product: ProductListItemResponse): ProductPackagingSummary | null {
    if (!product.packagings || product.packagings.length === 0) {
      return null;
    }
    const selectedId = this.selectedPackaging[product.productId];
    if (selectedId) {
      const found = product.packagings.find((p) => p.packagingId === selectedId);
      if (found) return found;
    }
    return product.packagings[0];
  }

  onSelectPackaging(productId: number, packagingId: number): void {
    this.selectedPackaging[productId] = Number(packagingId);
  }

  addToCart(product: ProductListItemResponse, buyNow: boolean = false): void {
    const pkg = this.getActivePackaging(product);
    if (!pkg) {
      this.errorMessage.set(`No packaging option is available for "${product.productName}" yet.`);
      return;
    }

    if (buyNow) {
      this.buyingNowId.set(product.productId);
    } else {
      this.addingToCartId.set(product.productId);
    }

    this.errorMessage.set('');
    this.cartService.addItem({ packagingId: pkg.packagingId, quantity: 1 }).subscribe({
      next: () => {
        this.addingToCartId.set(null);
        this.buyingNowId.set(null);

        if (buyNow) {
          void this.router.navigate(['/cart']);
        } else {
          this.successMessage.set(`Added 1x ${product.productName} (${pkg.packagingName}) to your cart!`);
          setTimeout(() => {
            if (this.successMessage().startsWith('Added 1x')) {
              this.successMessage.set('');
            }
          }, 3500);
        }
      },
      error: (error) => {
        this.addingToCartId.set(null);
        this.buyingNowId.set(null);
        this.errorMessage.set(
          error.error?.message || error.error?.title || 'Unable to add item to cart. Please try again.'
        );
      }
    });
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
