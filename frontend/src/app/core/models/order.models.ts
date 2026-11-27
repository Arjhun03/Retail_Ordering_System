export interface PlaceOrderRequest {
  deliveryAddress: string;
}

export interface OrderItemResponse {
  orderItemId: number;
  packagingId: number;
  productName: string;
  packagingName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderListItemResponse {
  orderId: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  orderedAtUtc: string;
}

export interface OrderDetailResponse {
  orderId: number;
  orderNumber: string;
  userId: number;
  deliveryAddress: string;
  totalAmount: number;
  status: string;
  orderedAtUtc: string;
  items: OrderItemResponse[];
}
