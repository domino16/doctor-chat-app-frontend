import { Chat } from 'src/app/shared/models/chat';
import { Message } from 'src/app/shared/models/message';
import { User } from 'src/app/shared/models/user';

export interface myChatsState {
  chats: Chat[];
  addChatId: string;
  selectedChat: Chat | null;
  allUsers: User[];
  messages: Message[];
  listIsLoading: boolean;
  messagesIsLoading: boolean;
  messageNotificationcCounter: number;
}

export const initialState: myChatsState = {
  chats: [],
  addChatId: '',
  selectedChat: null,
  allUsers: [],
  messages: [],
  listIsLoading: false,
  messagesIsLoading: false,
  messageNotificationcCounter: 0,
};
