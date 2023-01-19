
import { User } from "./user";

export interface lastMessage{
  lastMessage?:string;
  lastMessageDate?:Date;
  lastMessageAuthor?:User;
}

export interface Chat{
  id:number;
  lastMessage?:lastMessage
  userIDs:string[];
  users:User[];
  chatImg?:string;
  chatName?:string;
  lastMessageUnread?:boolean;
}
