import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  cart: Cart | null = null;
  loading = false;
  updatingItemId: number | null = null;
  removingItemId: number | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.errorMessage = '';

    this.cartService.getCart().subscribe({
      next: (response) => {
        this.cart = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.errorMessage = 'Unable to load your cart.';
        this.loading = false;
      },
    });
  }

  increaseQuantity(item: Cart['items'][number]): void {
    if (item.quantity >= 100) {
      this.errorMessage = 'Maximum quantity is 100.';
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
    this.errorMessage = '';
    this.successMessage = '';
    this.updatingItemId = cartItemId;

    this.cartService.updateItem(cartItemId, quantity).subscribe({
      next: (response) => {
        this.cart = response;
        this.updatingItemId = null;
      },
      error: (error) => {
        console.error('Error updating cart:', error);
        this.errorMessage = error.error?.message || 'Unable to update quantity.';
        this.updatingItemId = null;
      },
    });
  }

  removeItem(cartItemId: number): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.removingItemId = cartItemId;

    this.cartService.removeItem(cartItemId).subscribe({
      next: (response) => {
        this.cart = response;
        this.successMessage = 'Item removed from cart.';
        this.removingItemId = null;
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.errorMessage = error.error?.message || 'Unable to remove item.';
        this.removingItemId = null;
      },
    });
  }

  get isCartEmpty(): boolean {
    return !this.cart || this.cart.items.length === 0;
  }

  proceedToCheckout(): void {
  alert('Checkout will be implemented in the next phase.');
}
}