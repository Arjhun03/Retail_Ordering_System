import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
export class NavbarComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.cartService.loadCart().subscribe({
        error: () => {
          // cart might be empty or new, safe to ignore
        },
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.cartService.reset();
    void this.router.navigate(['/login']);
  }
}
