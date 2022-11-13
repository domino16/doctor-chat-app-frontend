import { Timestamp } from "@angular/fire/firestore";

export interface Message {
  id?:number;
  message: string;
  author: string;
  sentDate: Date & Timestamp;

}
