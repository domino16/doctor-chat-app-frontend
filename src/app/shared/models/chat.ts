import { Timestamp } from "@angular/fire/firestore";
import { User } from "./user";

export interface lastMessage{
  lastMessage?:string;
  lastMessageDate?:Date & Timestamp;
  lastMessageAuthor?:User;
}

export interface Chat{
  id:string;
  lastMessage?:lastMessage
  userIDs:string[];
  users:User[];
  chatImg?:string;
  chatName?:string;
  lastMessageUnread?:boolean;
}
