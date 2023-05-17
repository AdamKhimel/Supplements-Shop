import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-prod',
  templateUrl: './add-prod.component.html',
  styleUrls: ['./add-prod.component.scss']
})
export class AddProductComponent {

  product = {
    name: '',
    price: 0,
    description: '',
    imageUrl: ''
  };

  selectedImage: any = null;

  constructor(private productService: ProductService, private storage: AngularFireStorage) { }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  addProduct() {
    // Upload image to Firebase Cloud Storage
    var filePath = `products/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.product.imageUrl = url;

          this.productService.createProduct(this.product)
            .then(() => {
              console.log('Product added');
              // Reset the form
              this.product = {
                name: '',
                price: 0,
                description: '',
                imageUrl: ''
              };
            })
            .catch((error: any) => {
              console.error('Error adding product: ', error);
            });
        })
      })
    ).subscribe();
  }
}
