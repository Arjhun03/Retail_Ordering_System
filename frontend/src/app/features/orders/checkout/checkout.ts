import { Component, OnInit, inject } from '@angular/core';
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

  deliveryAddress = '';
  loading = false;
  loadingCart = false;
  errorMessage = '';

  ngOnInit(): void {
    if (!this.cartService.cart()) {
      this.loadingCart = true;
      this.cartService.loadCart().subscribe({
        next: () => {
          this.loadingCart = false;
        },
        error: () => {
          this.loadingCart = false;
        },
      });
    }
  }

  get isCartEmpty(): boolean {
    const c = this.cartService.cart();
    return !c || !c.items || c.items.length === 0;
  }

  placeOrder(): void {
    this.errorMessage = '';

    if (this.isCartEmpty) {
      this.errorMessage = 'Your cart is empty. Please add items before checking out.';
      return;
    }

    const address = this.deliveryAddress.trim();

    if (!address) {
      this.errorMessage = 'Please enter your delivery address.';
      return;
    }

    if (address.length > 500) {
      this.errorMessage = 'Delivery address cannot exceed 500 characters.';
      return;
    }

    const request: PlaceOrderRequest = {
      deliveryAddress: address,
    };

    this.loading = true;

    this.orderService.placeOrder(request).subscribe({
      next: (order) => {
        this.loading = false;
        // Refresh cart state so frontend shows empty cart and 0 badge
        this.cartService.loadCart().subscribe({
          error: () => this.cartService.reset(),
        });
        void this.router.navigate(['/orders', order.orderId]);
      },
      error: (error) => {
        console.error('Checkout error:', error);
        this.errorMessage =
          error.error?.message ||
          error.error?.title ||
          'Unable to place your order. Please try again.';
        this.loading = false;
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
