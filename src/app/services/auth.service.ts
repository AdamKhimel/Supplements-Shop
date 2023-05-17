import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, UserCredential, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { authState } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLoggedIn: boolean = false;
  user$: Observable<any>;
  isAdmin$ = new BehaviorSubject<boolean>(false);

  constructor(private toastr: ToastrService, private afs: AngularFirestore) {
    const auth = getAuth();
    this.user$ = new Observable((observer) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.isLoggedIn = true;
          observer.next(user);
          this.afs
            .doc(`users/${user.uid}`)
            .valueChanges()
            .subscribe((data: any) => {
              if (data) {
                this.isAdmin$.next(data.admin === true);
              } else {
                this.isAdmin$.next(false);
              }
            });
        } else {
          this.isLoggedIn = false;
          observer.next(null);
          this.isAdmin$.next(false);
        }
      });
    });
  }

  async signUp(email: string,
     password: string, 
     firstName: string, 
     lastName: string, 
     age: number, 
     isAdmin: boolean):
      Promise<UserCredential> {
    const auth = getAuth();
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });
  
    // Set the user's admin status in the Firestore
    await this.afs.doc(`users/${user.uid}`).set({
      admin: isAdmin
    });
  
    this.toastr.success('Signed up successfully!');
    return userCredential;
  }

  async signIn(email: string, password: string): Promise<UserCredential> {
    const userCredential: UserCredential = await signInWithEmailAndPassword(getAuth(), email, password);
    this.toastr.success('Logged in successfully!');
    return userCredential;
  }

  async signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    const userCredential: UserCredential = await signInWithPopup(getAuth(), provider);
    this.toastr.success('Logged in successfully!');
    return userCredential;
  }

  async signOut(): Promise<void> {
    return signOut(getAuth());
  }

  makeAdmin(uid: string) {
    return this.afs.doc(`users/${uid}`).update({ admin: true });
  }

  isAdmin(): Observable<boolean> {
    return this.isAdmin$.asObservable();
  }

}
