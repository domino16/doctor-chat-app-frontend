import { createAction, props } from '@ngrx/store';
import { AuthUser } from '../authuser.model';



export const loginStart = createAction(
  '[AUTH PAGE] Login start',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[AUTH PAGE] Login success',
  props<{ authUser: AuthUser | null}>()
);

export const signUpStart = createAction(
  '[AUTH PAGE] SignUp Start',
  props<{  email: string; password: string;photoUrl:string; firstName:string; lastName:string;doctor:boolean;  unReadChatsCounter:number; visitNotificationsNumber:number }>()
);

export const  signUpSuccess = createAction(
  '[AUTH PAGE] Singup Success', props<{authUser: AuthUser | null}>()
)
