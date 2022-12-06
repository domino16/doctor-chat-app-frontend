import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import * as chatActions from './chat.actions';
import { initialState } from './chat.state';

export const chatReducer = createReducer(
  initialState,
  on(chatActions.loadChatsSuccess, (state, { chats }) => ({
    ...state,
    chats: chats,
  })),
  on(chatActions.setSelectedChat, (state, { selectedChat }) => ({
    ...state,
    selectedChat: selectedChat,
  })),
  on(chatActions.setAllUsersSuccess, (state, { users }) => ({
    ...state,
    allUsers: users,
  })),
  on(chatActions.loadMessagesSuccess, (state, {messages}) => ({...state, messages:messages}))
);
