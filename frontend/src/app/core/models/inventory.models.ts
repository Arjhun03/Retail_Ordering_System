export interface SetInventoryRequest {
  stockQuantity: number;
  reorderLevel: number;
}

export interface InventoryResponse {
  inventoryId: number;
  packagingId: number;
  productName: string;
  packagingName: string;
  stockQuantity: number;
  reorderLevel: number;
  isLowStock: boolean;
  updatedAtUtc: string;
}
