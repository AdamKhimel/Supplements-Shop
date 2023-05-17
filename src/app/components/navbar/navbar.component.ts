import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Update this line
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LogoService } from '../../services/logo.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  [x: string]: any;
  imageUrl$: Observable<string | null>;
  showMenu = false;
  showDropdown = false;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
  myFunction() {
    this.showDropdown = !this.showDropdown;
  }
  
  closeDropdown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.matches('.dropbtn')) {
      this.showDropdown = false;
    }
  }
  constructor(public authService: AuthService, private storage: AngularFireStorage, private logoService: LogoService) {
    this.imageUrl$ = this.logoService.getLogoUrl();
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
    this['router'].navigate(['/home']);
  }
  
  

}
