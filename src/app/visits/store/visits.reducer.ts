import { createReducer, on } from '@ngrx/store';
import { visitData } from 'src/app/shared/models/visit.data';
import {
  incrementVisitNotificationNumber,
  loadNotificationNumberSuccess,
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
  on(loadVisitsSuccess, (state, action) => ({...state, visits:action.visits})),
  on(loadNotificationNumberSuccess, (state, action)=> ({...state, visitNotificationNumber: action.visitNotificationNumber}))
);
