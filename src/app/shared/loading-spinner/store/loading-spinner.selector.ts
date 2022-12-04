import { createFeatureSelector, createSelector } from "@ngrx/store";
import { loadingSpinnerState } from "./loading-spinner.state";
export const LOADING_SPINNER_STATE_NAME = 'loadingSpinner';


export const getLoadingSpinnerState = createFeatureSelector<loadingSpinnerState>(LOADING_SPINNER_STATE_NAME);

export const getLoadingSpinner = createSelector(getLoadingSpinnerState, state => state.showLoading)
