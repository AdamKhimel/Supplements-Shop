import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {}

  getProducts(): Observable<Product[]> {
    return this.firestore
      .collection('products')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Product;
            const id = a.payload.doc.id;
            return { ...data, id };
          })
        )
      );
  }

  getProduct(id: string): Observable<Product | undefined> {
    const productDoc: AngularFirestoreDocument<Product> = this.firestore.doc<Product>(`products/${id}`);
    return productDoc.snapshotChanges().pipe(
      map((action) => {
        if (action.payload.exists) {
          const data = action.payload.data() as Product;
          const id = action.payload.id;
          return { ...data, id };
        } else {
          return undefined;
        }
      })
    );
  }

  createProduct(product: any) {
    return this.firestore.collection('products').add(product);
  }

  updateProduct(id: string, product: any) {
    return this.firestore.collection('products').doc(id).update(product);
  }

  deleteProduct(id: string) {
    return this.firestore.collection('products').doc(id).delete();
  }
  getitemUrl(): Observable<string> {
    const itemPath = '/ON mass.png'; 
    return this.storage.ref(itemPath).getDownloadURL();
  }
}
