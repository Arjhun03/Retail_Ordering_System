
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/auth/auth.constants';

import {
  BrandResponse,
  CategoryResponse,
  CreateBrandRequest,
  UpdateBrandRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ProductListItemResponse,
  ProductDetailResponse,
  CreateProductRequest,
  UpdateProductRequest,
  PagedResponse,
  ProductQuery
} from '../models/catalog.models';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private readonly http = inject(HttpClient);

  private readonly brandsUrl = `${API_BASE_URL}/Brands`;
  private readonly categoriesUrl = `${API_BASE_URL}/Categories`;
  private readonly productsUrl = `${API_BASE_URL}/Products`;

  // Brand APIs
  getBrands(): Observable<BrandResponse[]> {
    return this.http.get<BrandResponse[]>(this.brandsUrl);
  }

  getBrandById(id: number): Observable<BrandResponse> {
    return this.http.get<BrandResponse>(`${this.brandsUrl}/${id}`);
  }

  createBrand(request: CreateBrandRequest): Observable<BrandResponse> {
    return this.http.post<BrandResponse>(this.brandsUrl, request);
  }

  updateBrand(id: number, request: UpdateBrandRequest): Observable<BrandResponse> {
    return this.http.put<BrandResponse>(`${this.brandsUrl}/${id}`, request);
  }

  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.brandsUrl}/${id}`);
  }

  // Category APIs
  getCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.categoriesUrl);
  }

  getCategoryById(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.categoriesUrl}/${id}`);
  }

  createCategory(request: CreateCategoryRequest): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.categoriesUrl, request);
  }

  updateCategory(id: number, request: UpdateCategoryRequest): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(
      `${this.categoriesUrl}/${id}`,
      request
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoriesUrl}/${id}`);
  }

  // Product APIs
  getProducts(
    filters: ProductQuery = {}
  ): Observable<PagedResponse<ProductListItemResponse>> {
    let params = new HttpParams()
      .set('page', filters.page ?? 1)
      .set('pageSize', filters.pageSize ?? 10);

    if (filters.categoryId !== undefined) {
      params = params.set('categoryId', filters.categoryId);
    }

    if (filters.brandId !== undefined) {
      params = params.set('brandId', filters.brandId);
    }

    if (filters.search?.trim()) {
      params = params.set('search', filters.search.trim());
    }

    return this.http.get<PagedResponse<ProductListItemResponse>>(
      this.productsUrl,
      { params }
    );
  }

  getProductById(id: number): Observable<ProductDetailResponse> {
    return this.http.get<ProductDetailResponse>(`${this.productsUrl}/${id}`);
  }

  createProduct(request: CreateProductRequest): Observable<ProductDetailResponse> {
    return this.http.post<ProductDetailResponse>(this.productsUrl, request);
  }

  updateProduct(
    id: number,
    request: UpdateProductRequest
  ): Observable<ProductDetailResponse> {
    return this.http.put<ProductDetailResponse>(
      `${this.productsUrl}/${id}`,
      request
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.productsUrl}/${id}`);
  }
}
