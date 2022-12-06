import { User } from "../models/user"

export interface sharedState{
errorMessage:string
currentChatUser:User;

}

export const initialState:sharedState = {
errorMessage:'',
currentChatUser:{ 'uid':'','email':'','displayName': '','password':'', 'photoUrl':'https://cdn.pixabay.com/photo/2016/11/14/17/39/person-1824144__340.png', 'firstName':'','lastName':'', 'phone':'', 'address':''}
}
