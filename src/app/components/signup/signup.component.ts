import { Component } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import 'firebase/database';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; 
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  email: string = ''; // initialize the email property
  password: string = '';
  confirmPassword: string = '';
  firstName: string = '';
  lastName: string = '';
  age: number = 0;
  admin: boolean=true;
  errorMessage: string | null = null;
  
  constructor(private authService: AuthService, private router: Router) {}

  isAdmin: boolean = false;

  async onSignUp(): Promise<void> {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    try {
      this.errorMessage = null;
      const newUser: User = {
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        age: this.age,
        isAdmin: this.isAdmin
      };
      await this.authService.signUp(this.email, this.password, this.firstName, this.lastName, this.age, this.isAdmin);
      console.log('User signed up successfully');

      // Reference the Firebase database
      const database = firebase.database();
      const cartId = 'E9nmwXb8aQMO60eUi8Bmlts6TIv1';
      const cartRef = database.ref(`carts/${cartId}`);
      cartRef.on('value', (snapshot) => {
        // Handle the data retrieved from the Firebase database
      }, (error) => {
        console.error(`Error retrieving data from Firebase: ${error.message}`);
      });

      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error signing up:', error);
      this.errorMessage = (error as firebase.FirebaseError).message;
    }
  }
}
