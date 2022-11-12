import { User } from "./user";

export interface Chat{
  id:string;
  lastMessage?:string;
  lastMessageDate?:Date;
  userIds:string[];
  users:User[];
  chatImg?:string;
  chatName?:string;
}
