
import { createReducer, on } from '@ngrx/store';

import * as authActions from './auth.actions';
import { initialState } from './auth.state';

export const authReducer = createReducer(
  initialState,
  on(authActions.loginSuccess, (state, { authUser }) =>  ({ ...state,authUser:authUser })),
  on(authActions.signUpSuccess, (state, {authUser}) =>  ({ ...state,authUser:authUser })),

);
