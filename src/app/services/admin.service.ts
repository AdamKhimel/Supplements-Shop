import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private productsCollection: AngularFirestoreCollection<Product>;
  products$: Observable<Product[]>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.productsCollection = afs.collection<Product>('products');
    this.products$ = this.productsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Product;
        const id = a.payload.doc.id;
        return { ...data, id};
      }))
    );
  }

  getProducts() {
    return this.products$;
  }

  addProduct(product: Product) {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (user && user.admin) {
          return this.productsCollection.add(product);
        } else {
          throw new Error('Unauthorized access: User is not an admin.');
        }
      })
    );
  }

  updateProduct(id: string, product: Product) {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (user && user.admin) {
          return this.productsCollection.doc(id).update(product);
        } else {
          throw new Error('Unauthorized access: User is not an admin.');
        }
      })
    );
  }

  deleteProduct(id: string) {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (user && user.admin) {
          return this.productsCollection.doc(id).delete();
        } else {
          throw new Error('Unauthorized access: User is not an admin.');
        }
      })
    );
  }

}
