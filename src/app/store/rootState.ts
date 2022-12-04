import { authReducer } from "../Auth/store/auth.reducer";
import { AUTH_STATE_NAME } from "../Auth/store/auth.selector";
import { authState } from "../Auth/store/auth.state";
import { loadingSpinnerReducer } from "../shared/loading-spinner/store/loading-spinner.reducer";
import { LOADING_SPINNER_STATE_NAME } from "../shared/loading-spinner/store/loading-spinner.selector";
import { loadingSpinnerState } from "../shared/loading-spinner/store/loading-spinner.state";
import { sharedReducer } from "../shared/store/shared.reducer";
import { SHARED_STATE_NAME } from "../shared/store/shared.selector";
import { sharedState } from "../shared/store/shared.state";

export interface rootState{
  [AUTH_STATE_NAME]:authState
  [LOADING_SPINNER_STATE_NAME]:loadingSpinnerState
  [SHARED_STATE_NAME]: sharedState
}

export const rootReducer ={
  [AUTH_STATE_NAME]:authReducer,
  [LOADING_SPINNER_STATE_NAME]:loadingSpinnerReducer,
  [SHARED_STATE_NAME]: sharedReducer

}
