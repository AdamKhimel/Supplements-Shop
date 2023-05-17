import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  constructor(private productService: ProductService, private adminService: AdminService) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
