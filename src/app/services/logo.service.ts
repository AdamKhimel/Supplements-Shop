import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogoService {
  constructor(private storage: AngularFireStorage) {}

  getLogoUrl(): Observable<string> {
    const logoPath = '/logo.png'; 
    return this.storage.ref(logoPath).getDownloadURL();
  }
}
