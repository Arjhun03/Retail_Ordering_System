import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../auth/auth.constants';
import { InventoryResponse, SetInventoryRequest } from '../models/inventory.models';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<InventoryResponse[]> {
    return this.http.get<InventoryResponse[]>(`${API_BASE_URL}/inventory`);
  }

  getByPackagingId(packagingId: number): Observable<InventoryResponse> {
    return this.http.get<InventoryResponse>(`${API_BASE_URL}/inventory/${packagingId}`);
  }

  setInventory(packagingId: number, req: SetInventoryRequest): Observable<InventoryResponse> {
    return this.http.put<InventoryResponse>(`${API_BASE_URL}/inventory/${packagingId}`, req);
  }
}
