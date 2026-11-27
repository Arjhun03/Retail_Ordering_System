export interface AddCartItemRequest {
  packagingId: number;
  quantity: number;
}

export interface CartItem {
  cartItemId: number;
  packagingId: number;
  productName: string;
  packagingName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Cart {
  cartId: number;
  status: string;
  items: CartItem[];
  totalAmount: number;
  createdAtUtc: string;
}