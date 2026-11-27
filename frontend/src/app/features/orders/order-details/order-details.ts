import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { OrderDetail } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss',
})
export class OrderDetailsComponent implements OnInit {
  order: OrderDetail | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || id <= 0) {
      this.errorMessage = 'Invalid order ID.';
      return;
    }

    this.loadOrder(id);
  }

  loadOrder(orderId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getOrderById(orderId).subscribe({
      next: (response) => {
        this.order = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.errorMessage = 'Unable to load order details.';
        this.loading = false;
      },
    });
  }

  backToOrders(): void {
    this.router.navigate(['/orders']);
  }
}