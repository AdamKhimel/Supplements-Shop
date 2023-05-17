import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item.model';
import { CartService, cartGems } from 'src/app/services/cart.service';
import { Observable, forkJoin, map } from 'rxjs';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit {
  showPaymentForm = false;
  
  togglePaymentForm() {
    this.showPaymentForm = !this.showPaymentForm;
  }
  cartItems: cartGems[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
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

}
