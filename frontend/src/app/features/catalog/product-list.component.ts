import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import {
  Brand,
  Category,
  Packaging,
  ProductListItem,
} from '../../core/models/catalog.models';
import { CartService } from '../../core/services/cart.service';
import { CatalogService } from '../../core/services/catalog.service';

interface ProductCardState {
  product: ProductListItem;
  packagings: Packaging[];
  selectedPackagingId: number | null;
  quantity: number;
  isLoadingPackagings: boolean;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly categories = signal<Category[]>([]);
  readonly brands = signal<Brand[]>([]);
  readonly productCards = signal<ProductCardState[]>([]);
  readonly selectedCategoryId = signal<number | null>(null);
  readonly selectedBrandId = signal<number | null>(null);
  readonly searchTerm = signal<string>('');
  readonly isLoading = signal<boolean>(false);
  readonly toastMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFilters();
    this.loadProducts();
  }

  loadFilters(): void {
    this.catalogService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats.filter((c) => c.isActive)),
    });
    this.catalogService.getBrands().subscribe({
      next: (b) => this.brands.set(b.filter((br) => br.isActive)),
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.catalogService
      .getProducts({
        page: 1,
        pageSize: 50,
        searchTerm: this.searchTerm(),
        categoryId: this.selectedCategoryId() ?? undefined,
        brandId: this.selectedBrandId() ?? undefined,
      })
      .subscribe({
        next: (res) => {
          const cards: ProductCardState[] = res.items
            .filter((p) => p.isActive)
            .map((p) => ({
              product: p,
              packagings: [],
              selectedPackagingId: null,
              quantity: 1,
              isLoadingPackagings: true,
            }));

          this.productCards.set(cards);
          this.isLoading.set(false);

          // Fetch packagings for each product
          cards.forEach((card, idx) => {
            this.catalogService.getPackagingsByProduct(card.product.productId).subscribe({
              next: (packagings) => {
                const active = packagings.filter((pk) => pk.isActive);
                const currentCards = [...this.productCards()];
                if (currentCards[idx]) {
                  currentCards[idx] = {
                    ...currentCards[idx],
                    packagings: active,
                    selectedPackagingId: active.length > 0 ? active[0].packagingId : null,
                    isLoadingPackagings: false,
                  };
                  this.productCards.set(currentCards);
                }
              },
              error: () => {
                const currentCards = [...this.productCards()];
                if (currentCards[idx]) {
                  currentCards[idx] = {
                    ...currentCards[idx],
                    isLoadingPackagings: false,
                  };
                  this.productCards.set(currentCards);
                }
              },
            });
          });
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.message || 'Failed to load products.');
        },
      });
  }

  onFilterCategory(id: number | null): void {
    this.selectedCategoryId.set(id);
    this.loadProducts();
  }

  onSearch(): void {
    this.loadProducts();
  }

  getSelectedPackaging(card: ProductCardState): Packaging | undefined {
    return card.packagings.find((p) => p.packagingId === card.selectedPackagingId);
  }

  onAddToCart(card: ProductCardState): void {
    if (!this.authService.isLoggedIn()) {
      void this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/products' },
      });
      return;
    }

    if (!card.selectedPackagingId) {
      return;
    }

    const pkg = this.getSelectedPackaging(card);
    const packagingName = pkg ? `${pkg.packagingName}` : 'Item';

    this.cartService.addItem(card.selectedPackagingId, card.quantity).subscribe({
      next: () => {
        this.showToast(`Added ${card.quantity}x ${card.product.productName} (${packagingName}) to cart!`);
      },
      error: (err) => {
        this.showToast(`Error adding to cart: ${err.error?.message || err.message}`);
      },
    });
  }

  private showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3500);
  }
}
