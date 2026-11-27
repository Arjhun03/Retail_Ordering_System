import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../auth/auth.constants';
import {
  OrderDetailResponse,
  OrderListItemResponse,
  PlaceOrderRequest,
} from '../models/order.models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  placeOrder(deliveryAddress: string): Observable<OrderDetailResponse> {
    const body: PlaceOrderRequest = { deliveryAddress };
    return this.http.post<OrderDetailResponse>(`${API_BASE_URL}/orders`, body);
  }

  getOrders(): Observable<OrderListItemResponse[]> {
    return this.http.get<OrderListItemResponse[]>(`${API_BASE_URL}/orders`);
  }

  getOrder(id: number): Observable<OrderDetailResponse> {
    return this.http.get<OrderDetailResponse>(`${API_BASE_URL}/orders/${id}`);
  }
}
