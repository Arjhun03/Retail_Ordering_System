export interface PlaceOrderRequest {
  deliveryAddress: string;
}

export interface OrderItem {
  orderItemId: number;
  packagingId: number;
  productName: string;
  packagingName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDetail {
  orderId: number;
  orderNumber: string;
  userId: number;
  deliveryAddress: string;
  totalAmount: number;
  status: string;
  orderedAtUtc: string;
  items: OrderItem[];
}

export interface OrderListItem {
  orderId: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  orderedAtUtc: string;
}