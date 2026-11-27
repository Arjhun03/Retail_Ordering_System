import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../auth/auth.constants';
import { AuthService } from '../auth/auth.service';
import { AddCartItemRequest, CartResponse, UpdateCartItemRequest } from '../models/cart.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  readonly cart = signal<CartResponse | null>(null);

  readonly itemCount = computed<number>(() => {
    const current = this.cart();
    if (!current || !current.items) return 0;
    return current.items.reduce((sum, item) => sum + item.quantity, 0);
  });

  readonly totalAmount = computed<number>(() => {
    return this.cart()?.totalAmount ?? 0;
  });

  loadCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${API_BASE_URL}/cart`).pipe(
      tap((cart) => this.cart.set(cart)),
    );
  }

  addItem(packagingId: number, quantity: number = 1): Observable<CartResponse> {
    const body: AddCartItemRequest = { packagingId, quantity };
    return this.http.post<CartResponse>(`${API_BASE_URL}/cart/items`, body).pipe(
      tap((cart) => this.cart.set(cart)),
    );
  }

  updateItem(packagingId: number, quantity: number): Observable<CartResponse> {
    const body: UpdateCartItemRequest = { quantity };
    return this.http.put<CartResponse>(`${API_BASE_URL}/cart/items/${packagingId}`, body).pipe(
      tap((cart) => this.cart.set(cart)),
    );
  }

  removeItem(packagingId: number): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${API_BASE_URL}/cart/items/${packagingId}`).pipe(
      tap((cart) => this.cart.set(cart)),
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/cart`).pipe(
      tap(() => this.cart.set(null)),
    );
  }

  reset(): void {
    this.cart.set(null);
  }
}
