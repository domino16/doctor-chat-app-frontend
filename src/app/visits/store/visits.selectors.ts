import { createFeatureSelector, createSelector } from "@ngrx/store";
import { state } from "./visits.reducer";

export const VISIT_STATE_NAME = 'visits'

export const getVisitState = createFeatureSelector<state>(VISIT_STATE_NAME);

export const getVisitNotificationNumber = createSelector(getVisitState, state => state.visitNotificationNumber)

export const getVisits = createSelector(getVisitState, state => state.visits )
