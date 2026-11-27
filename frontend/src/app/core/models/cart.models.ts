export interface AddCartItemRequest {
  packagingId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartItemResponse {
  cartItemId: number;
  packagingId: number;
  productName: string;
  packagingName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CartResponse {
  cartId: number;
  status: string;
  items: CartItemResponse[];
  totalAmount: number;
  createdAtUtc: string;
}
