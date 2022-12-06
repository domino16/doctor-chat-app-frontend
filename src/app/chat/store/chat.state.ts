import { Chat } from 'src/app/shared/models/chat';
import { Message } from 'src/app/shared/models/message';
import { User } from 'src/app/shared/models/user';

export interface myChatsState {
  chats: Chat[];
 selectedChat: Chat | null;
 allUsers: User[];
 messages: Message[];

}

export const initialState: myChatsState = {
  chats: [],
  selectedChat: null,
  allUsers: [],
  messages:[]

};
