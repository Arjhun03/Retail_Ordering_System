import { Component, OnInit } from '@angular/core';
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
  orders: OrderListItem[] = [];
  loading = false;
  errorMessage = '';
  page = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private orderService: OrderService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getMyOrders(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.orders = response.items ?? response.data ?? [];
        this.totalPages = response.totalPages ?? 1;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to load your orders.';
        this.loading = false;
      },
    });
  }

  viewOrder(orderId: number): void {
    this.router.navigate(['/orders', orderId]);
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
}