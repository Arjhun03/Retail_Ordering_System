import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderDetailResponse, OrderListItemResponse } from '../../core/models/order.models';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly orders = signal<OrderListItemResponse[]>([]);
  readonly selectedOrderDetail = signal<OrderDetailResponse | null>(null);
  readonly expandedOrderId = signal<number | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly isLoadingDetail = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to load order history.');
      },
    });
  }

  toggleOrderDetails(orderId: number): void {
    if (this.expandedOrderId() === orderId) {
      this.expandedOrderId.set(null);
      this.selectedOrderDetail.set(null);
      return;
    }

    this.expandedOrderId.set(orderId);
    this.isLoadingDetail.set(true);

    this.orderService.getOrder(orderId).subscribe({
      next: (detail) => {
        this.selectedOrderDetail.set(detail);
        this.isLoadingDetail.set(false);
      },
      error: () => {
        this.isLoadingDetail.set(false);
      },
    });
  }
}
