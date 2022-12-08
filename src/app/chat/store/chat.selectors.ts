import { createFeatureSelector, createSelector } from "@ngrx/store"
import { myChatsState } from "./chat.state"

export const CHAT_STATE_NAME = 'chat'

export const getChatState = createFeatureSelector<myChatsState>(CHAT_STATE_NAME);

export const getChats = createSelector(getChatState, state => state.chats)

export const getaddChatId = createSelector(getChatState, state=> state.addChatId)

export const getSelectedChat = createSelector(getChatState, state => state.selectedChat)

export const getMessages = createSelector(getChatState, state => state.messages)

export const getListIsLoadingStatus = createSelector(getChatState, state => state.listIsLoading)

export const getMessagesIsLoadingStatus = createSelector(getChatState, state => state.messagesIsLoading)

export const getMessagesNotificationsNumber = createSelector(getChatState, state => state.messageNotificationcCounter)

