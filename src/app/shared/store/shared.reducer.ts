import { createReducer, on } from "@ngrx/store";
import { setCurrentChatUser, setErrorMessage } from "./shared.actions";
import { initialState } from "./shared.state";

export const sharedReducer = createReducer(
  initialState,
  on(setErrorMessage, (state, action) => ({...state,errorMessage:action.message})),
  on(setCurrentChatUser, (state, action) => ({...state, currentChatUser:action.currentChatUser}))
)
