export interface User{
  uid?: string;
  email: string;
  password:string;
  photoUrl?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  notificationsCounter?:string;
  unReadChatsCounter?:string;
  visitNotificationsNumber:number;
  doctor:boolean;
}
