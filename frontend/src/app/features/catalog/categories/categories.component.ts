
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CatalogService } from '../services/catalog.service';
import {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../models/catalog.models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);

  categories = signal<CategoryResponse[]>([]);
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  editingId: number | null = null;
  categoryName = '';
  description = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.catalogService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load categories. Please try again.');
        this.loading.set(false);
      }
    });
  }

  saveCategory(): void {
    const name = this.categoryName.trim();

    if (!name) {
      this.errorMessage.set('Category name is required.');
      return;
    }

    if (name.length > 100) {
      this.errorMessage.set('Category name cannot exceed 100 characters.');
      return;
    }

    if (this.description.length > 500) {
      this.errorMessage.set('Description cannot exceed 500 characters.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.editingId !== null) {
      const request: UpdateCategoryRequest = {
        categoryName: name,
        description: this.description.trim() || null,
        isActive: true
      };

      this.catalogService.updateCategory(this.editingId, request).subscribe({
        next: () => {
          this.successMessage.set('Category updated successfully.');
          this.resetForm();
          this.loadCategories();
          this.saving.set(false);
        },
        error: (error) => this.handleError(error)
      });
    } else {
      const request: CreateCategoryRequest = {
        categoryName: name,
        description: this.description.trim() || null
      };

      this.catalogService.createCategory(request).subscribe({
        next: () => {
          this.successMessage.set('Category created successfully.');
          this.resetForm();
          this.loadCategories();
          this.saving.set(false);
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  editCategory(category: CategoryResponse): void {
    this.editingId = category.categoryId;
    this.categoryName = category.categoryName;
    this.description = category.description ?? '';
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  deleteCategory(category: CategoryResponse): void {
    if (!confirm(`Are you sure you want to deactivate ${category.categoryName}?`)) {
      return;
    }

    this.catalogService.deleteCategory(category.categoryId).subscribe({
      next: () => {
        this.successMessage.set('Category deactivated successfully.');
        this.loadCategories();
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message || 'Unable to deactivate category.'
        );
      }
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.categoryName = '';
    this.description = '';
  }

  private handleError(error: any): void {
    this.errorMessage.set(
      error.error?.message || 'Something went wrong. Please try again.'
    );
    this.saving.set(false);
  }
}
