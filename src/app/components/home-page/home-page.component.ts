// home-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  featuredProducts: Product[] = [];

  constructor(private productService: ProductService, private cartService: CartService) { }

  ngOnInit(): void {
    // Fetch featured products
    this.productService.getProducts().subscribe(products => {
      this.featuredProducts = products.slice(0, 6); // Only show the first 6 products
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart({
      productId: product.id!,
      quantity: 1,
      product,
      price: product.price
    });
    console.log('Product added');
  }
}
