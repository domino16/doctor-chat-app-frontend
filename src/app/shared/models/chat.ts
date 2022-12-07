import { Timestamp } from "@angular/fire/firestore";
import { User } from "./user";

export interface Chat{
  id:string;
  lastMessage?:string;
  lastMessageDate?:Date & Timestamp;
  lastMessageUnread?:boolean;
  userIDs:string[];
  users:User[];
  chatImg?:string;
  chatName?:string;
}
