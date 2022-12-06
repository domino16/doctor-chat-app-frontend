
import { createReducer, on } from '@ngrx/store';
import * as chatActions from './chat.actions'
import { initialState } from './chat.state';



export const chatReducer = createReducer(
  initialState,
  on(
    chatActions.loadChatsSuccess,
    (state, {chats}) => ({...state, chats:chats}),
  ),
);
