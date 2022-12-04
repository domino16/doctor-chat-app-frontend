import { createFeatureSelector, createSelector } from "@ngrx/store";
import { sharedState } from "./shared.state";

export const SHARED_STATE_NAME = 'shared'


export const getSharedState = createFeatureSelector<sharedState>(SHARED_STATE_NAME)

export const  getErrorMessage = createSelector(getSharedState,state=> state.errorMessage)
