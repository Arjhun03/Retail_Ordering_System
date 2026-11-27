import { Component, OnInit, ChangeDetectorRef, inject, signal } from '@angular/core';
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly orderSignal = signal<OrderDetail | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorMessageSignal = signal('');

  get order(): OrderDetail | null {
    return this.orderSignal();
  }

  get loading(): boolean {
    return this.loadingSignal();
  }

  get errorMessage(): string {
    return this.errorMessageSignal();
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || id <= 0) {
      this.errorMessageSignal.set('Invalid order ID.');
      return;
    }

    this.loadOrder(id);
  }

  loadOrder(orderId: number): void {
    this.loadingSignal.set(true);
    this.errorMessageSignal.set('');
    this.cdr.markForCheck();

    this.orderService.getOrderById(orderId).subscribe({
      next: (response) => {
        this.orderSignal.set(response);
        this.loadingSignal.set(false);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.errorMessageSignal.set('Unable to load order details.');
        this.loadingSignal.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  backToOrders(): void {
    void this.router.navigate(['/orders']);
  }
}
