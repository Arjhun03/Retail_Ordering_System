import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { PlaceOrderRequest } from '../../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class CheckoutComponent {
  deliveryAddress = '';
  loading = false;
  errorMessage = '';

  constructor(
    private orderService: OrderService,
    private router: Router,
  ) {}

  placeOrder(): void {
    this.errorMessage = '';

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

        this.router.navigate(['/orders', order.orderId]);
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
}