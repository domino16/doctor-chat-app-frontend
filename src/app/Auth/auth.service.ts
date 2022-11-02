import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AuthResponseData{
  idToken:string;
  email:string;
  refreshToken:string;
  expiresIn:string;
  localId:string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCkd1Jpn3tJGmDKaVwhL107eZyyNEdP8pc',
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );
  }

  signin(email: string, password: string) {
   return this.http.post(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCkd1Jpn3tJGmDKaVwhL107eZyyNEdP8pc',
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );
  }


}
