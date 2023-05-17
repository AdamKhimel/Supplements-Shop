import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { authMethods } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authMethods = authMethods;
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  rememberMe: boolean = false;

  async signIn(): Promise<void> {
    try {
      this.errorMessage = null;
      await this.authService.signIn(this.email, this.password);
      if (this.rememberMe) {
        localStorage.setItem('email', this.email);
        localStorage.setItem('password', this.password);
      }
      this.router.navigate(['/products']);
    } catch (error) {
      this.errorMessage = (error as firebase.default.FirebaseError).message;
    }
  }

  async signInWithGoogle(): Promise<void> {
    try {
      await this.authService.signInWithGoogle();
      this.router.navigate(['/home']); // Navigate to the products route
    } catch (error) {
      console.log('Error signing in with Google:', error);
    }
  }

  async makeUserAdmin(): Promise<void> {
    try {
      const userId = 'ASoVEUz2IfQanCBeHaWSX0zhoJl2'; // Replace with the user ID of the user you want to make an admin
      await this.authService.makeAdmin(userId);
      console.log(`User ${userId} is now an admin.`);
    } catch (error) {
      console.error(error);
    }
  }

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    if (email && password) {
      this.email = email;
      this.password = password;
      this.rememberMe = true;
    }
  }
}
