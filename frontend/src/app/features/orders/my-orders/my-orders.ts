import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { OrderListItem } from '../../../core/models/order.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.scss',
})
export class MyOrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  orders: OrderListItem[] = [];
  loading = false;
  errorMessage = '';
  page = 1;
  pageSize = 10;
  totalPages = 1;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getMyOrders(this.page, this.pageSize).subscribe({
      next: (response) => {
        const list = Array.isArray(response)
          ? response
          : (response?.items ?? response?.data ?? []);
        this.orders = list;
        this.totalPages = response?.totalPages ?? 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.errorMessage =
          error.error?.message ||
          error.error?.title ||
          'Unable to load your orders. Please try again.';
        this.loading = false;
      },
    });
  }

  viewOrder(orderId: number): void {
    void this.router.navigate(['/orders', orderId]);
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadOrders();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadOrders();
    }
  }

  goToProducts(): void {
    void this.router.navigate(['/catalog/products']);
  }
}
