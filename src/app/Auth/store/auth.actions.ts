import { createAction, props } from '@ngrx/store';
import { AuthUser } from '../authuser.model';



export const loginStart = createAction(
  'Login start',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  'Login success',
  props<{ authUser: AuthUser | null}>()
);

export const signUpStart = createAction(
  'SignUp Start',
  props<{  email: string; password: string;}>()
);

export const  signUpSuccess = createAction(
  'Singup Success', props<{authUser: AuthUser | null}>()
)
