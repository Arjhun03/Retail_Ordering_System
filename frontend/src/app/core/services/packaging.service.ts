import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Packaging } from '../models/packaging.model';

@Injectable({
  providedIn: 'root',
})
export class PackagingService {
  private readonly apiUrl = 'https://localhost:7102/api';

  constructor(private http: HttpClient) {}

  getByProductId(productId: number): Observable<Packaging[]> {
    return this.http.get<Packaging[]>(
      `${this.apiUrl}/products/${productId}/packaging`,
    );
  }
}