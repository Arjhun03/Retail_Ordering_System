import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PlaceOrderRequest,
  OrderDetail,
  OrderListItem,
} from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly apiUrl = 'https://localhost:7102/api/orders';

  constructor(private http: HttpClient) {}

  placeOrder(request: PlaceOrderRequest): Observable<OrderDetail> {
    return this.http.post<OrderDetail>(this.apiUrl, request);
  }

  getOrderById(orderId: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.apiUrl}/${orderId}`);
  }

  getMyOrders(page = 1, pageSize = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }
}