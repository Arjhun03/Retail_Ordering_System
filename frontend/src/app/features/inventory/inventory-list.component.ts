import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventoryResponse } from '../../core/models/inventory.models';
import { InventoryService } from '../../core/services/inventory.service';

interface EditableInventoryItem {
  item: InventoryResponse;
  editStock: number;
  editReorder: number;
  isSaving: boolean;
}

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss',
})
export class InventoryListComponent implements OnInit {
  private readonly inventoryService = inject(InventoryService);

  readonly items = signal<EditableInventoryItem[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.inventoryService.getAll().subscribe({
      next: (data) => {
        const editable = data.map((inv) => ({
          item: inv,
          editStock: inv.stockQuantity,
          editReorder: inv.reorderLevel,
          isSaving: false,
        }));
        this.items.set(editable);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to load inventory.');
      },
    });
  }

  onSaveStock(entry: EditableInventoryItem): void {
    entry.isSaving = true;
    this.errorMessage.set(null);

    this.inventoryService
      .setInventory(entry.item.packagingId, {
        stockQuantity: entry.editStock,
        reorderLevel: entry.editReorder,
      })
      .subscribe({
        next: (updated) => {
          entry.item = updated;
          entry.isSaving = false;
          this.showSuccess(`Updated stock for ${updated.productName} (${updated.packagingName})`);
        },
        error: (err) => {
          entry.isSaving = false;
          this.errorMessage.set(err.error?.message || 'Failed to update stock quantity.');
        },
      });
  }

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => {
      this.successMessage.set(null);
    }, 3500);
  }
}
