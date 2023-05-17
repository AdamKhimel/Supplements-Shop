import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item.model';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartOpen: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
    });
  }

  getTotal(): number {
    let total = 0;
    for (let item of this.cartItems) {
      total += item.quantity * item.price;
    }
    return total;
  }

  removeCartItem(itemId: string): void {
    this.cartService.removeFromCart(itemId)
      .then(() => {
        console.log('Item removed');
      })
      .catch((error: any) => {
        console.error('Error removing item: ', error);
      });
  }

  updateQuantity(itemId: string, quantity: number): void {
    const currentItem = this.cartItems.find(item => item.id === itemId);
    if (currentItem) {
      const updatedCartItem: CartItem = {
        ...currentItem,
        quantity,
      };
      this.cartService.updateCartItem(itemId, updatedCartItem)
        .then(() => {
          console.log('Quantity updated');
        })
        .catch((error: any) => {
          console.error('Error updating quantity: ', error);
        });
    }
  }

  checkout(): void {
    // Navigate to the checkout page
    this.router.navigateByUrl('/checkout');
  }

  getQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  toggleCart(): void {
    this.cartOpen = !this.cartOpen;
  }
}
