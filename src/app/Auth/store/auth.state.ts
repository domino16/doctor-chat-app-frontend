
import { AuthUser } from "../authuser.model"



export interface  authState {
  authUser: AuthUser|null

}

export const initialState:authState= {
  authUser: null
}
