import { Component, OnInit, ChangeDetectorRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Cart } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly loadingSignal = signal(false);
  private readonly updatingItemIdSignal = signal<number | null>(null);
  private readonly removingItemIdSignal = signal<number | null>(null);
  private readonly errorMessageSignal = signal('');
  private readonly successMessageSignal = signal('');

  get cart(): Cart | null {
    return this.cartService.cart();
  }

  get loading(): boolean {
    return this.loadingSignal();
  }

  get updatingItemId(): number | null {
    return this.updatingItemIdSignal();
  }

  get removingItemId(): number | null {
    return this.removingItemIdSignal();
  }

  get errorMessage(): string {
    return this.errorMessageSignal();
  }

  get successMessage(): string {
    return this.successMessageSignal();
  }

  get isCartEmpty(): boolean {
    const c = this.cart;
    return !c || !c.items || c.items.length === 0;
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loadingSignal.set(true);
    this.errorMessageSignal.set('');
    this.cdr.markForCheck();

    this.cartService.getCart().subscribe({
      next: () => {
        this.loadingSignal.set(false);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.errorMessageSignal.set('Unable to load your cart. Check that the API is running, then try again.');
        this.loadingSignal.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  increaseQuantity(item: Cart['items'][number]): void {
    if (item.quantity >= 100) {
      this.errorMessageSignal.set('Maximum quantity is 100.');
      return;
    }

    this.updateQuantity(item.cartItemId, item.quantity + 1);
  }

  decreaseQuantity(item: Cart['items'][number]): void {
    if (item.quantity <= 1) {
      return;
    }

    this.updateQuantity(item.cartItemId, item.quantity - 1);
  }

  updateQuantity(cartItemId: number, quantity: number): void {
    this.errorMessageSignal.set('');
    this.successMessageSignal.set('');
    this.updatingItemIdSignal.set(cartItemId);
    this.cdr.markForCheck();

    this.cartService.updateItem(cartItemId, quantity).subscribe({
      next: () => {
        this.updatingItemIdSignal.set(null);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error updating cart:', error);
        this.errorMessageSignal.set(error.error?.message || 'Unable to update quantity.');
        this.updatingItemIdSignal.set(null);
        this.cdr.markForCheck();
      },
    });
  }

  removeItem(cartItemId: number): void {
    this.errorMessageSignal.set('');
    this.successMessageSignal.set('');
    this.removingItemIdSignal.set(cartItemId);
    this.cdr.markForCheck();

    this.cartService.removeItem(cartItemId).subscribe({
      next: () => {
        this.successMessageSignal.set('Item removed from cart.');
        this.removingItemIdSignal.set(null);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.errorMessageSignal.set(error.error?.message || 'Unable to remove item.');
        this.removingItemIdSignal.set(null);
        this.cdr.markForCheck();
      },
    });
  }

  proceedToCheckout(): void {
    if (this.isCartEmpty) {
      this.errorMessageSignal.set('Your cart is empty. Please add items to proceed.');
      return;
    }
    void this.router.navigate(['/orders/checkout']);
  }

  goToProducts(): void {
    void this.router.navigate(['/catalog/products']);
  }
}
