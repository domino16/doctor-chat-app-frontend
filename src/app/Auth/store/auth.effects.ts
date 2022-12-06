import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, throwError } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { setLoadingSpinner } from 'src/app/shared/loading-spinner/store/loading-spinner.actions';
import { setErrorMessage } from 'src/app/shared/store/shared.actions';
import { getCurrentChatUser } from 'src/app/shared/store/shared.selector';
import { rootState } from 'src/app/store/rootState';
import { AuthService } from '../auth.service';
import { AuthUser } from '../authuser.model';
import { SignupComponent } from '../signup/signup.component';
import {
  loginStart,
  loginSuccess,
  signUpStart,
  signUpSuccess,
} from './auth.actions';
import { authUser } from './auth.selector';
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
            this.store.dispatch(setLoadingSpinner({ status: false }));
            const authUser = this.authService.handleAuth(
              data.email,
              data.localId,
              data.idToken,
              +data.expiresIn
            );
            return loginSuccess({ authUser });
          }),
          catchError((errorRes) => {
            console.log(errorRes);
            this.store.dispatch(setLoadingSpinner({ status: false }));
            let errorMessage = 'Nieznany błąd';
            if (!errorRes.error || !errorRes.error.error) {
              throwError(() => new Error(errorMessage));
            }
            switch (errorRes.error.error.message) {
              case 'EMAIL_NOT_FOUND':
                errorMessage = 'Nie znaleźliśmy użytkownika o tej nazwie.';
                break;
              case 'INVALID_PASSWORD':
                errorMessage = 'Błędne hasło';
                break;
              case 'USER_DISABLED':
                errorMessage =
                  'To konto zostało wyłączone przez administratora';
                break;
              case 'INVALID_EMAIL':
                errorMessage = 'Musisz wpisać email';
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
        return this.authService.signup(action.email, action.password).pipe(
          map((data) => {
            this.store.dispatch(setLoadingSpinner({ status: false }));
            const authUser = this.authService.handleAuth(
              data.email,
              data.localId,
              data.idToken,
              +data.expiresIn
            );
            this.store.select(getCurrentChatUser).subscribe((currentUser) => {
              this.userService.addUser(currentUser!)
            });
            return loginSuccess({ authUser });
          }),
          catchError((errorRes) => {
            console.log(errorRes);
            this.store.dispatch(setLoadingSpinner({ status: false }));
            let errorMessage = 'Nieznany błąd';
            if (!errorRes.error || !errorRes.error.error) {
              throwError(() => new Error(errorMessage));
            }
            switch (errorRes.error.error.message) {
              case 'EMAIL_EXISTS':
                errorMessage = 'Ten Email jest już używany.';
                break;
              case 'OPERATION_NOT_ALLOWED':
                errorMessage = 'Logowanie na hasło jest wyłączone';
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
