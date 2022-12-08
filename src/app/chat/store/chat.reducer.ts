
import { createReducer, on } from '@ngrx/store';
import * as chatActions from './chat.actions';
import { getMessagesNotificationsNumber } from './chat.selectors';
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
  on(chatActions.loadMessagesSuccess, (state, { messages }) => ({
    ...state,
    messages: messages,
  })),
  on(chatActions.listIsLoading, (state, { status }) => ({
    ...state,
    listIsLoading: status,
  })),
  on(chatActions.messagesIsLoading, (state, { status }) => ({
    ...state,
    messagesIsLoading: status,
  })),
  on(chatActions.addChatId, (state, { chatId }) => ({
    ...state,
    addChatId: chatId,
  })),
  on(chatActions.addOneToCounter, (state) => ({
    ...state,
    messageNotificationcCounter: state.messageNotificationcCounter + 1,
  })),
  on(chatActions.removeOneFromCounter, (state) => ({
    ...state,
    messageNotificationcCounter: state.messageNotificationcCounter - 1,
  })),
  on(chatActions.resetCounter, (state, {counter}) => ({
    ...state,
    messageNotificationcCounter:counter
  })),

);
