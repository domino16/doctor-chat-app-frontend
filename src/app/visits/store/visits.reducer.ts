import { createReducer, on } from '@ngrx/store';
import { visitData } from 'src/app/shared/models/visit.data';
import {
  decrementVisitNotificationNumber,
  incrementVisitNotificationNumber,
  loadVisitsSuccess,
  resetVisitNotificationNumber,
} from './visits.action';

export interface state {
  visits:visitData[]
  visitNotificationNumber: number;
}

export const initialState:state = {
  visitNotificationNumber: 0,
  visits:[],
};

export const visitReducer = createReducer(
  initialState,
  on(incrementVisitNotificationNumber, (state) => ({
    ...state,
    visitNotificationNumber: state.visitNotificationNumber + 1,
  })),
  on(decrementVisitNotificationNumber, (state) => ({
    ...state,
    visitNotificationNumber: state.visitNotificationNumber + 1,
  })),
  on(resetVisitNotificationNumber, (state) => ({
    ...state,
    visitNotificationNumber: state.visitNotificationNumber + 1,
  })),
  on(loadVisitsSuccess, (state, action) => ({...state, visits:action.visits}))
);
