import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Routes
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProductsComponent } from './components/products/products.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductsListComponent } from './components/product-list/product-list.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AddProductComponent } from './components/add-prod/add-prod.component';


const routes: Routes = [
  { path: 'edit-product/:id', component: ProductsListComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {path: 'add', component: AddProductComponent},
  { path: 'cart', component: CartComponent },
  { path: 'product-list', component: ProductsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
