import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import { API_BASE_URL } from '../auth/auth.constants';
import {
  OrderDetail,
  OrderListItem,
  PlaceOrderRequest,
  PagedResponse,
} from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly apiUrl = `${API_BASE_URL}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder(request: PlaceOrderRequest | string): Observable<OrderDetail> {
    const body: PlaceOrderRequest =
      typeof request === 'string' ? { deliveryAddress: request } : request;
    return this.http.post<OrderDetail>(this.apiUrl, body);
  }

  getOrderById(orderId: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.apiUrl}/${orderId}`);
  }

  getOrder(orderId: number): Observable<OrderDetail> {
    return this.getOrderById(orderId);
  }

  getMyOrders(page = 1, pageSize = 10): Observable<PagedResponse<OrderListItem>> {
    return this.http.get<PagedResponse<OrderListItem>>(
      `${this.apiUrl}?page=${page}&pageSize=${pageSize}`,
    ).pipe(timeout(15000));
  }

  getOrders(): Observable<OrderListItem[]> {
    return this.http.get<OrderListItem[]>(this.apiUrl);
  }
}
