import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthUser } from './authuser.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loginSuccess } from './store/auth.actions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  expiresIn: string;
}

export interface TestAuthResponsData {}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<AuthUser>(null!);
  private tokenExpirationTimer!: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {}

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData') ?? '{}');
    if (!userData) {
      return;
    }

    const loadedUser = new AuthUser(
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.store.dispatch(loginSuccess({ authUser: loadedUser }));
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.store.dispatch(loginSuccess({ authUser: null }));
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  handleAuth(email: string, idToken: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new AuthUser(email, idToken, expirationDate);
    this.user$.next(user);
    this.autoLogout(+expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
    return user;
  }

  signup(
    email: string,
    password: string,
    photoUrl: string,
    firstName: String,
    lastName: string,
    doctor: boolean,
    unReadChatsCounter: number,
    visitNotificationNumber: number
  ) {
    return this.http.post<AuthResponseData>(
      'https://doctor-chat-app.herokuapp.com/api/v1/auth/register',
      {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        photoUrl: photoUrl,
        doctor: doctor,
        unReadChatsCounter: unReadChatsCounter,
        visitNotificationNumber: visitNotificationNumber,
      }
    );
  }

  signin(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://doctor-chat-app.herokuapp.com/api/v1/auth/login',
      {
        email: email,
        password: password,
      }
    );
  }
}
