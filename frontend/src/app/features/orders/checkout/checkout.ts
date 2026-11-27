import { Component, OnInit, ChangeDetectorRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { CartService } from '../../../core/services/cart.service';
import { PlaceOrderRequest } from '../../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class CheckoutComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  deliveryAddress = '';
  private readonly loadingSignal = signal(false);
  private readonly loadingCartSignal = signal(false);
  private readonly errorMessageSignal = signal('');

  get loading(): boolean {
    return this.loadingSignal();
  }

  get loadingCart(): boolean {
    return this.loadingCartSignal();
  }

  get errorMessage(): string {
    return this.errorMessageSignal();
  }

  ngOnInit(): void {
    if (!this.cartService.cart()) {
      this.loadingCartSignal.set(true);
      this.cdr.markForCheck();

      this.cartService.loadCart().subscribe({
        next: () => {
          this.loadingCartSignal.set(false);
          this.cdr.markForCheck();
        },
        error: () => {
          this.loadingCartSignal.set(false);
          this.cdr.markForCheck();
        },
      });
    }
  }

  get isCartEmpty(): boolean {
    const c = this.cartService.cart();
    return !c || !c.items || c.items.length === 0;
  }

  placeOrder(): void {
    this.errorMessageSignal.set('');

    if (this.isCartEmpty) {
      this.errorMessageSignal.set('Your cart is empty. Please add items before checking out.');
      return;
    }

    const address = this.deliveryAddress.trim();

    if (!address) {
      this.errorMessageSignal.set('Please enter your delivery address.');
      return;
    }

    if (address.length > 500) {
      this.errorMessageSignal.set('Delivery address cannot exceed 500 characters.');
      return;
    }

    const request: PlaceOrderRequest = {
      deliveryAddress: address,
    };

    this.loadingSignal.set(true);
    this.cdr.markForCheck();

    this.orderService.placeOrder(request).subscribe({
      next: (order) => {
        this.loadingSignal.set(false);
        this.cdr.markForCheck();

        // Refresh cart state so frontend shows empty cart and 0 badge
        this.cartService.loadCart().subscribe({
          error: () => this.cartService.reset(),
        });
        void this.router.navigate(['/orders', order.orderId]);
      },
      error: (error) => {
        console.error('Checkout error:', error);
        this.errorMessageSignal.set(
          error.error?.message ||
          error.error?.title ||
          'Unable to place your order. Please try again.'
        );
        this.loadingSignal.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  goBackToCart(): void {
    void this.router.navigate(['/cart']);
  }

  goToProducts(): void {
    void this.router.navigate(['/catalog/products']);
  }
}
