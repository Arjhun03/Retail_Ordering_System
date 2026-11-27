import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart, AddCartItemRequest } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = 'https://localhost:7102/api/cart';

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  addItem(request: AddCartItemRequest): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/items`, request);
  }

  updateItem(cartItemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/items/${cartItemId}`, {
      quantity,
    });
  }

  removeItem(cartItemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/items/${cartItemId}`);
  }
}