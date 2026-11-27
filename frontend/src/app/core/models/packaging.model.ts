export interface Packaging {
  packagingId: number;
  productId: number;
  productName: string;
  packagingName: string;
  price: number;
  unit: string;
  isActive: boolean;
  availableQuantity: number | null;
}