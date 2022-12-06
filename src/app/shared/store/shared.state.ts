import { User } from "../models/user"

export interface sharedState{
errorMessage:string
currentChatUser:User | null;

}

export const initialState:sharedState = {
errorMessage:'',
currentChatUser:null,
}
