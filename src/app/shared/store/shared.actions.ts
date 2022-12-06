import { createAction, props } from "@ngrx/store";
import { User } from "../models/user";


export const setErrorMessage = createAction('set error message', props<{message:string}>())
export const setCurrentChatUser = createAction('set current chat user', props<{currentChatUser:User}>())
