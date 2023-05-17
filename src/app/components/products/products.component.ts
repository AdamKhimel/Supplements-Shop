import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { CartService, CartItem } from 'src/app/services/cart.service';
import { Product } from 'src/app/models/product.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  imageUrl$: Observable<string | null>;

  constructor(private productService: ProductService, private cartService: CartService, private snackBar: MatSnackBar, private storage: AngularFireStorage,) {
    this.imageUrl$ = this.productService.getitemUrl();
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }
  addToCart(product: Product): void {
    const cartItem: CartItem = {
      productId: product.id,
      quantity: 1,
      product,
      price: product.price
    };
    this.cartService.addToCart(cartItem);
    this.snackBar.open('Item added to cart', '', {
      duration: 2000, // Duration in milliseconds
      panelClass: ['snackbar-success'] // Custom class
    });  
  }
}
