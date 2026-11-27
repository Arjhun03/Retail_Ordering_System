import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../auth/auth.constants';
import { AddCartItemRequest, Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = `${API_BASE_URL}/cart`;
  readonly cart = signal<Cart | null>(null);

  readonly itemCount = computed<number>(() => {
    const c = this.cart();
    if (!c || !c.items) return 0;
    return c.items.reduce((acc, item) => acc + item.quantity, 0);
  });

  readonly totalAmount = computed<number>(() => {
    return this.cart()?.totalAmount ?? 0;
  });

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap((cart) => this.cart.set(cart)),
    );
  }

  loadCart(): Observable<Cart> {
    return this.getCart();
  }

  addItem(request: AddCartItemRequest): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/items`, request).pipe(
      tap((cart) => this.cart.set(cart)),
    );
  }

  updateItem(packagingIdOrCartItemId: number, quantity: number): Observable<Cart> {
    return this.http
      .put<Cart>(`${this.apiUrl}/items/${packagingIdOrCartItemId}`, {
        quantity,
      })
      .pipe(tap((cart) => this.cart.set(cart)));
  }

  removeItem(packagingIdOrCartItemId: number): Observable<Cart> {
    return this.http
      .delete<Cart>(`${this.apiUrl}/items/${packagingIdOrCartItemId}`)
      .pipe(tap((cart) => this.cart.set(cart)));
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl).pipe(
      tap(() => this.cart.set(null)),
    );
  }

  reset(): void {
    this.cart.set(null);
  }
}
