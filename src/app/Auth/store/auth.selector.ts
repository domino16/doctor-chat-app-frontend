import { createFeatureSelector, createSelector } from "@ngrx/store"
import { authState } from "./auth.state"

export const AUTH_STATE_NAME = 'auth'


export const getAuthState = createFeatureSelector<authState>(AUTH_STATE_NAME);

export const authUser = createSelector(getAuthState, state => state.authUser)
export const isAuthenticated = createSelector(getAuthState, state => state.authUser ? true : false)
