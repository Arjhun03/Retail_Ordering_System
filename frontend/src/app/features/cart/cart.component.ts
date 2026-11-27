import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartResponse } from '../../core/models/cart.models';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  readonly deliveryAddress = signal<string>('');
  readonly isCheckingOut = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.cartService.loadCart().subscribe({
      next: () => this.isLoading.set(false),
      error: (err) => {
        this.isLoading.set(false);
        if (err.status !== 404) {
          this.errorMessage.set(err.error?.message || 'Failed to load cart.');
        }
      },
    });
  }

  onUpdateQty(packagingId: number, currentQty: number, delta: number): void {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      this.onRemoveItem(packagingId);
      return;
    }

    this.cartService.updateItem(packagingId, newQty).subscribe({
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to update quantity.');
      },
    });
  }

  onRemoveItem(packagingId: number): void {
    this.cartService.removeItem(packagingId).subscribe({
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to remove item.');
      },
    });
  }

  onClearCart(): void {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    this.cartService.clearCart().subscribe({
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to clear cart.');
      },
    });
  }

  onCheckout(): void {
    const address = this.deliveryAddress().trim();
    if (!address) {
      this.errorMessage.set('Please provide a delivery address.');
      return;
    }

    this.isCheckingOut.set(true);
    this.errorMessage.set(null);

    this.orderService.placeOrder(address).subscribe({
      next: (order) => {
        this.isCheckingOut.set(false);
        this.cartService.reset();
        void this.router.navigate(['/orders'], {
          queryParams: { newOrderId: order.orderId },
        });
      },
      error: (err) => {
        this.isCheckingOut.set(false);
        this.errorMessage.set(err.error?.message || err.error?.detail || 'Failed to place order. Please check stock availability.');
      },
    });
  }
}
