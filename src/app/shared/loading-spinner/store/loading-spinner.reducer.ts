import { createReducer, on } from "@ngrx/store";
import { setLoadingSpinner } from "./loading-spinner.actions";
import { initialState } from "./loading-spinner.state";


export const loadingSpinnerReducer = createReducer(
  initialState,
  on(setLoadingSpinner,(state, action) => ({...state, showLoading:action.status}))
)
