import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      // Whenever the user logs in as a Customer, immediately fetch active cart
      if (this.authService.isLoggedIn() && this.authService.isCustomer()) {
        this.cartService.loadCart().subscribe({
          next: () => this.cdr.markForCheck(),
          error: () => {},
        });
      }
    });
  }

  onCartClick(): void {
    this.cartService.loadCart().subscribe({
      next: () => this.cdr.markForCheck(),
      error: () => {},
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.cartService.reset();
    void this.router.navigate(['/login']);
  }
}
