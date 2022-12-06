import { Chat } from "src/app/shared/models/chat";


export interface myChatsState
{
  chats:Chat[]
}

export const initialState:myChatsState ={
  chats: []
}
