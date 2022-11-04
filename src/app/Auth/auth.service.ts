import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';


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
    ).pipe(catchError(errorRes => {
      let errorMessage = 'Nieznany błąd'
      if(!errorRes.error || !errorRes.error.error){
        throwError(() => new Error(errorMessage))
      }
      switch(errorRes.error.error.message){
        case 'EMAIL_EXISTS':
          errorMessage= 'Ten Email jest już używany.'
      }
      return  throwError(() => new Error(errorMessage))
    }));
  }

  signin(email: string, password: string) {
   return this.http.post(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCkd1Jpn3tJGmDKaVwhL107eZyyNEdP8pc',
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    ).pipe(catchError(errorRes => {
      let errorMessage = 'Nieznany błąd'
      if(!errorRes.error || !errorRes.error.error){
        throwError(() => new Error(errorMessage))
      }
      switch(errorRes.error.error.message){
        case 'EMAIL_NOT_FOUND':
          errorMessage= 'Nie znaleźliśmy użytkownika o tej nazwie. Użytkownik mógł zostać usunięty.'
          break;
          case 'INVALID_PASSWORD':
          errorMessage= 'Błędne hasło'
          break;
          case 'USER_DISABLED':
          errorMessage= 'To konto zostało wyłączone przez administratora'
          break;

      }
      return  throwError(() => new Error(errorMessage))
    }));;
  }


}
