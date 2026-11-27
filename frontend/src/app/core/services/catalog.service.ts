import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../auth/auth.constants';
import {
  Brand,
  Category,
  Packaging,
  PagedResponse,
  ProductDetail,
  ProductListItem,
} from '../models/catalog.models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);

  getProducts(params?: {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    categoryId?: number;
    brandId?: number;
  }): Observable<PagedResponse<ProductListItem>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params?.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm.trim());
    if (params?.categoryId) httpParams = httpParams.set('categoryId', params.categoryId.toString());
    if (params?.brandId) httpParams = httpParams.set('brandId', params.brandId.toString());

    return this.http.get<PagedResponse<ProductListItem>>(`${API_BASE_URL}/products`, {
      params: httpParams,
    });
  }

  getProduct(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${API_BASE_URL}/products/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API_BASE_URL}/categories`);
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${API_BASE_URL}/brands`);
  }

  getPackagingsByProduct(productId: number): Observable<Packaging[]> {
    return this.http.get<Packaging[]>(`${API_BASE_URL}/packaging/product/${productId}`);
  }
}
