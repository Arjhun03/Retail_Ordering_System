import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../auth/auth.constants';
import { Packaging } from '../models/packaging.model';

@Injectable({
  providedIn: 'root',
})
export class PackagingService {
  private readonly apiUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getByProductId(productId: number): Observable<Packaging[]> {
    return this.http.get<Packaging[]>(
      `${this.apiUrl}/products/${productId}/packaging`,
    );
  }
}
