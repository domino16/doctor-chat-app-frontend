import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, throwError } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { pageIsLoading } from 'src/app/shared/loading-spinner/store/loading-spinner.actions';
import { setErrorMessage } from 'src/app/shared/store/shared.actions';
import { rootState } from 'src/app/store/rootState';
import { AuthService } from '../auth.service';
import { AuthUser } from '../authuser.model';

import {
  loginStart,
  loginSuccess,
  signUpStart,
  signUpSuccess,
} from './auth.actions';
@Injectable()
export class AuthEffects {
  user!: AuthUser;

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store<rootState>,
    private router: Router,
    private userService: UserService
  ) {}
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginStart),
      exhaustMap((action) => {
        return this.authService.signin(action.email, action.password).pipe(
          map((data) => {
            this.store.dispatch(pageIsLoading({ status: false }));
            const authUser = this.authService.handleAuth(
              data.email,
              data.idToken,
              +data.expiresIn
            );
            return loginSuccess({ authUser });
          }),
          catchError((errorRes) => {
            console.log(errorRes);
            this.store.dispatch(pageIsLoading({ status: false }));
            let errorMessage = 'Nieznany błąd';
            if (!errorRes.error || !errorRes.error.error) {
              throwError(() => new Error(errorMessage));
            }
            switch (errorRes.error.text) {
              case 'User not found\r\n':
                errorMessage = 'Nie znaleźliśmy użytkownika o tej nazwie.';
                break;
              case 'Bad credentials\r\n':
                errorMessage = 'Błędne hasło';
                break;
            }
            return of(setErrorMessage({ message: errorMessage }));
          })
        );
      })
    );
  });

  loginredirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(...[loginSuccess, signUpSuccess]),
        map(() => {
          this.store.dispatch(setErrorMessage({ message: '' }));
          this.router.navigate(['/chat']);
        })
      );
    },
    { dispatch: false }
  );

  signUp$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(signUpStart),
      exhaustMap((action) => {
        return this.authService.signup(action.email, action.password,action.photoUrl,action.firstName,action.lastName,action.doctor, action.unReadChatsCounter,action.visitNotificationsNumber).pipe(
          map((data) => {
            this.store.dispatch(pageIsLoading({ status: false }));
            const authUser = this.authService.handleAuth(
              data.email,
              data.idToken,
              +data.expiresIn
            );
            return loginSuccess({ authUser });
          }),
          catchError((errorRes) => {
            console.log(errorRes);
            this.store.dispatch(pageIsLoading({ status: false }));
            let errorMessage = 'Nieznany błąd';
            if (!errorRes.error || !errorRes.error.error) {
              throwError(() => new Error(errorMessage));
            }
            switch (errorRes.error) {
              case 'EMAIL_EXISTS':
                errorMessage = 'Ten Email jest już używany.';
                break;
              case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                errorMessage = 'Zbyt wiele prób spróbuj ponownie później';
                break;
            }
            return of(setErrorMessage({ message: errorMessage }));
          })
        );
      })
    );
  });
}
