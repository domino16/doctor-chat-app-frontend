import { createAction, props } from "@ngrx/store";
import { User } from "../models/user";


export const setErrorMessage = createAction('set error message', props<{message:string}>())

export const setCurrentChatUserStart = createAction('set current chat user start')
export const setCurrentChatUserSuccess = createAction('set current chat user success', props<{currentChatUser:User}>())
