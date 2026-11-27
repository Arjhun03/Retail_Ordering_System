import { Component, OnInit, ChangeDetectorRef, inject, signal } from '@angular/core';
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
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly ordersSignal = signal<OrderListItem[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorMessageSignal = signal('');
  private readonly pageSignal = signal(1);
  private readonly pageSizeSignal = signal(10);
  private readonly totalPagesSignal = signal(1);

  get orders(): OrderListItem[] {
    return this.ordersSignal();
  }

  get loading(): boolean {
    return this.loadingSignal();
  }

  get errorMessage(): string {
    return this.errorMessageSignal();
  }

  get page(): number {
    return this.pageSignal();
  }

  get pageSize(): number {
    return this.pageSizeSignal();
  }

  get totalPages(): number {
    return this.totalPagesSignal();
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loadingSignal.set(true);
    this.errorMessageSignal.set('');
    this.cdr.markForCheck();

    this.orderService.getMyOrders(this.pageSignal(), this.pageSizeSignal()).subscribe({
      next: (response) => {
        const list = response?.items ?? [];
        this.ordersSignal.set(list);
        this.totalPagesSignal.set(Math.max(1, response?.totalPages ?? 1));
        this.loadingSignal.set(false);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.errorMessageSignal.set(
          error.error?.message ||
          error.error?.title ||
          'Unable to load your orders. Check that the API is running, then try again.'
        );
        this.loadingSignal.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  viewOrder(orderId: number): void {
    void this.router.navigate(['/orders', orderId]);
  }

  previousPage(): void {
    if (this.pageSignal() > 1) {
      this.pageSignal.update((p) => p - 1);
      this.loadOrders();
    }
  }

  nextPage(): void {
    if (this.pageSignal() < this.totalPagesSignal()) {
      this.pageSignal.update((p) => p + 1);
      this.loadOrders();
    }
  }

  goToProducts(): void {
    void this.router.navigate(['/catalog/products']);
  }
}
