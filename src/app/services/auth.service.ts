import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IUser } from '@interfaces/iuser';
import { ApptrayService } from './apptray.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userState!: firebase.User | null;
  storeData!: IUser;

  isLoggedIn: boolean = localStorage.getItem('user') ? true : false;
  isVerified: boolean = false;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private apptray: ApptrayService
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        localStorage.setItem('user', user.uid);

        this.userState = user;
        this._createStoreData(user);
        this.apptray.retrieveUserApps();

        this.isLoggedIn = true;
        if (user.emailVerified) this.isVerified = true;
        else this.isVerified = false;
        this.SetDocData();
      } else {
        this.isLoggedIn = false;
        localStorage.removeItem('user');
      }
    });
    this.afAuth.user.subscribe((userData) => {
      if (userData && this.isLoggedIn) {
        this.userState = userData;
        this._createStoreData(userData);
        this.SetDocData();
      } else this.userState = null;
    });
  }

  private _createStoreData(data: firebase.User) {
    if (data.displayName && data.email && data.emailVerified) {
      this.storeData = {
        uid: data.uid,
        displayName: data.displayName,
        photoURL: data.photoURL,
        email: data.email,
        emailVerified: data.emailVerified,
      };
    }
  }

  SignIn(email: string, password: string): void {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.ngZone.run(() => {
          this.router.navigate(['home']);
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  GoogleAuth(): void {
    this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  AuthLogin(provider: firebase.auth.AuthProvider): void {
    this.afAuth
      .signInWithPopup(provider)
      .then(() => {
        this.ngZone.run(() => {
          this.router.navigate(['home']);
        });
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  SetDocData(): void {
    if (this.storeData && this.userState) {
      this.afs.collection('users').doc(this.userState.uid).set(this.storeData, {
        merge: true,
      });
    }
  }

  SignOut(): void {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

  /**
   * Make sure that the user is authenticated before calling these.
   */
  get Email() {
    if (this.userState && this.userState.email) return this.userState.email;
    else return '';
  }
  set Email(v: string) {
    this.afAuth.currentUser.then((user): void => {
      if (user) user?.updateEmail(v);
      if (this.userState) {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(
          `users/${this.userState.uid}`
        );
        userRef.update({
          email: v,
        });
      }
    });
  }

  get EmailVerified() {
    if (this.userState && this.userState.emailVerified)
      return this.userState.emailVerified;
    else return false;
  }

  get DisplayName() {
    if (this.userState && this.userState.displayName)
      return this.userState.displayName;
    else return '';
  }
  set DisplayName(v: string) {
    this.afAuth.currentUser.then((user) => {
      if (user) user.updateProfile({ displayName: v });
      if (this.userState) {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(
          `users/${this.userState.uid}`
        );
        userRef.update({
          displayName: v,
        });
      }
    });
  }

  get PhotoURL(): string | null {
    if (this.userState && this.userState.photoURL)
      return this.userState.photoURL;
    else return null;
  }
  set PhotoURL(v: string | null) {
    this.afAuth.currentUser.then((user) => {
      if (user) user.updateProfile({ photoURL: v });
      if (this.userState) {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(
          `users/${this.userState.uid}`
        );
        userRef.update({
          photoURL: v,
        });
      }
    });
  }
}
