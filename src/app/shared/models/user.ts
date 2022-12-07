export interface User{
  uid?: string;
  email: string;
  password:string;
  displayName?: string;
  photoUrl?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  notificationsCounter?:string;
  unReadChatsCounter?:string;
}
