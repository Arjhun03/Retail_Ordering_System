import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackagingService } from '../../../core/services/packaging.service';
import { CartService } from '../../../core/services/cart.service';
import { Packaging } from '../../../core/models/packaging.model';

@Component({
  selector: 'app-packaging-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './packaging-list.component.html',
  styleUrl: './packaging-list.component.scss',
})
export class PackagingListComponent implements OnInit {
  @Input({ required: true }) productId!: number;

  packagingOptions: Packaging[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  addingPackagingId: number | null = null;

  constructor(
    private packagingService: PackagingService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.loadPackaging();
  }

  loadPackaging(): void {
    this.loading = true;
    this.errorMessage = '';

    this.packagingService.getByProductId(this.productId).subscribe({
      next: (response) => {
        this.packagingOptions = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading packaging:', error);
        this.errorMessage = 'Unable to load packaging options.';
        this.loading = false;
      },
    });
  }

  addToCart(packaging: Packaging): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.addingPackagingId = packaging.packagingId;

    this.cartService
      .addItem({
        packagingId: packaging.packagingId,
        quantity: 1,
      })
      .subscribe({
        next: () => {
          this.successMessage = `${packaging.packagingName} added to cart successfully!`;
          this.addingPackagingId = null;
        },
        error: (error) => {
          console.error('Error adding item to cart:', error);

          if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'Please log in as a customer to add items to cart.';
          } else {
            this.errorMessage = error.error?.message || 'Unable to add item to cart.';
          }

          this.addingPackagingId = null;
        },
      });
  }
}