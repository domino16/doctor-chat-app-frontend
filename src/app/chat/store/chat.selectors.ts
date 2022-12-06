import { createFeatureSelector, createSelector } from "@ngrx/store"
import { myChatsState } from "./chat.state"

export const CHAT_STATE_NAME = 'chat'

export const getChatState = createFeatureSelector<myChatsState>(CHAT_STATE_NAME);

export const getChats = createSelector(getChatState, state => state.chats)
