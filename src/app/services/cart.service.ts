import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { CartItem } from '../models/cart-item.model';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';


export interface cartGems {
  productId: string;
  quantity: number;
  product: Product;
  price: number;
  id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  updateQuantity(id: string | undefined, quantity: number) {
    throw new Error('Method not implemented.');
  }
  private dbPath = '/carts';
  cartRef: AngularFireList<CartItem>;

  constructor(private db: AngularFireDatabase, private authService: AuthService) {
    this.cartRef = db.list(this.dbPath);
  }

  // Get cart items for the currently authenticated user
  getCartItems(): Observable<cartGems[]> {
    return new Observable((observer) => {
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          const userId = user.uid;
          const userCartRef = this.db.list(`${this.dbPath}/${userId}`);
          userCartRef.snapshotChanges().subscribe((changes) => {
            const cartItems = changes.map((c) => {
              const cartItem = c.payload.val() as Omit<cartGems, 'id'>;
              const id = c.payload.key as string;
              return { id, ...cartItem };
            });
            observer.next(cartItems);
          });
        } else {
          observer.next([]);
        }
      });
    });
  }

  // Add item to cart for the currently authenticated user
  addToCart(cartItem: CartItem): void {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        const userId = user.uid;
        const userCartRef = this.db.list(`${this.dbPath}/${userId}`);
        userCartRef.push(cartItem);
      }
    });
  }

  // Update cart item quantity for the currently authenticated user
  updateCartItem(id: string, cartItem: CartItem): Promise<void> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          const userId = user.uid;
          const userCartItemRef = this.db.object(`${this.dbPath}/${userId}/${id}`);
          userCartItemRef.update(cartItem).then(() => resolve()).catch((error) => reject(error));
        }
      });
    });
  }

  // Remove item from cart for the currently authenticated user
  removeFromCart(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          const userId = user.uid;
          const userCartItemRef = this.db.object(`${this.dbPath}/${userId}/${id}`);
          userCartItemRef.remove().then(() => resolve()).catch((error) => reject(error));
        } else {
          reject(new Error('User not authenticated'));
        }
      });
      
    });
  }
}
export { CartItem };

