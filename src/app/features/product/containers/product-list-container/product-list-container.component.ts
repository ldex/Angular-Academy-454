import { Component, OnInit, Signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductService } from '../../../../services/product.service';
import { CartService } from '../../../../services/cart.service';
import { AuthService } from '../../../../services/auth.service';
import { Product } from '../../../../models/product.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductStore } from '../../../../store/product.store';

@Component({
  selector: 'app-product-list-container',
  imports: [CommonModule, ProductListComponent],
  template: `
    <app-product-list
      [products]="products()"
      [error]="error()"
      [loading]="loading()"
      [isAuthenticated]="isAuthenticated()"
      (addToCart)="onAddToCart($event)"
      (refresh)="onRefresh()">
    </app-product-list>
  `
})
export class ProductListContainerComponent implements OnInit {
  //private productService = inject(ProductService);
  private store = inject(ProductStore)
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  // products$!: Observable<Product[]>;
  // error: string | null = null;
  // loading: boolean = false;

  //authState$ = this.authService.getAuthState();
  private authState = toSignal(this.authService.getAuthState());
  isAuthenticated = computed(() => this.authState()?.isAuthenticated ?? false)

  protected products: Signal<Product[]> = this.store.products;
  protected loading = this.store.loading;
  protected error = this.store.error;

  ngOnInit(): void {
    //this.productService.getProducts()
  }

  onAddToCart(productId: number): void {
    this.cartService.addToCart(productId);
  }

  onRefresh(): void {
    this.store.refreshCache();
  }
}