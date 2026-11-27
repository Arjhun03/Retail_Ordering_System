
export interface BrandResponse {
  brandId: number;
  brandName: string;
  description: string | null;
  isActive: boolean;
}

export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  description: string | null;
  isActive: boolean;
}

export interface CreateBrandRequest {
  brandName: string;
  description: string | null;
}

export interface UpdateBrandRequest extends CreateBrandRequest {
  isActive: boolean;
}

export interface CreateCategoryRequest {
  categoryName: string;
  description: string | null;
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  isActive: boolean;
}

export interface ProductPackagingSummary {
  packagingId: number;
  packagingName: string;
  price: number;
  unit: string;
  stockQuantity: number;
}

export interface ProductListItemResponse {
  productId: number;
  productName: string;
  description: string | null;
  imageUrl: string | null;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  startingPrice?: number | null;
  defaultPackagingId?: number | null;
  packagings?: ProductPackagingSummary[] | null;
}

export interface PackagingResponse {
  packagingId: number;
  productId: number;
  productName: string;
  packagingName: string;
  price: number;
  unit: string;
  isActive: boolean;
  availableQuantity: number | null;
}

export interface ProductDetailResponse {
  productId: number;
  productName: string;
  description: string | null;
  imageUrl: string | null;
  brand: BrandResponse;
  category: CategoryResponse;
  packagings: PackagingResponse[];
  createdAtUtc: string;
}

export interface CreateProductRequest {
  brandId: number;
  categoryId: number;
  productName: string;
  description: string | null;
  imageUrl: string | null;
}

export interface UpdateProductRequest extends CreateProductRequest {
  isActive: boolean;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ProductQuery {
  categoryId?: number;
  brandId?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}
