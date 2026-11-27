export interface Brand {
  brandId: number;
  brandName: string;
  description?: string | null;
  isActive: boolean;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  description?: string | null;
  isActive: boolean;
}

export interface Packaging {
  packagingId: number;
  productId: number;
  productName: string;
  packagingName: string;
  price: number;
  unit: string;
  isActive: boolean;
  availableQuantity?: number | null;
}

export interface ProductPackagingSummary {
  packagingId: number;
  packagingName: string;
  price: number;
  unit: string;
  stockQuantity: number;
}

export interface ProductListItem {
  productId: number;
  productName: string;
  description?: string | null;
  imageUrl?: string | null;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  startingPrice?: number | null;
  defaultPackagingId?: number | null;
  packagings?: ProductPackagingSummary[] | null;
}

export interface ProductDetail {
  productId: number;
  productName: string;
  description?: string | null;
  imageUrl?: string | null;
  brand: Brand;
  category: Category;
  packagings: Packaging[];
  createdAtUtc: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
