import { createAction, props } from "@ngrx/store";
import { Chat } from "src/app/shared/models/chat";
import { Message } from "src/app/shared/models/message";
import { User } from "src/app/shared/models/user";

export const loadChats = createAction('[CHAT PAGE] load chats start');
export const loadChatsSuccess = createAction('[CHAT PAGE] success load chats', props<{chats: Chat[] }>());

export const addChat = createAction('[CHAT PAGE] add chat', props<{user:User}>())
export const addChatId = createAction('[CHAT PAGE] add Chat Id', props<{chatId:string}>())

export const setSelectedChat = createAction('[CHAT PAGE] set selected chat', props<{selectedChat:Chat| null}>())

export const setallUsers = createAction('[CHAT PAGE] get all users')
export const setAllUsersSuccess = createAction('[CHAT PAGE] get all users success', props<{users:User[]}>())

export const loadMessagesStart = createAction('[CHAT PAGE] load messages start', props<{chatId: string}>())
export const loadMessagesSuccess = createAction('[CHAT PAGE] load messages succsess', props<{messages:Message[]}>())

export const listIsLoading = createAction('[CHAT PAGE] list is loading', props<{status:boolean}>())
export const messagesIsLoading = createAction('[CHAT] PAGE messages is loading', props<{status:boolean}>())

export const addOneToCounter = createAction('[CHAT PAGE] +1 counter');
export const removeOneFromCounter = createAction('[CHAT PAGE] -1 counter');
export const resetCounter = createAction('[CHAT PAGE] reset counter', props<{counter:number}>());

