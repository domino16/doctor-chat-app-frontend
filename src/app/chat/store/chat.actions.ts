import { createAction, props } from "@ngrx/store";
import { Chat } from "src/app/shared/models/chat";

export const loadChats = createAction('load chats');
export const loadChatsSuccess = createAction('success load chats', props<{chats: Chat[] }>());
