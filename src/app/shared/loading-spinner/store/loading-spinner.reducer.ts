import { createReducer, on } from "@ngrx/store";
import { pageIsLoading} from "./loading-spinner.actions";
import { initialState } from "./loading-spinner.state";


export const loadingSpinnerReducer = createReducer(
  initialState,
  on(pageIsLoading,(state, action) => ({...state, pageIsLoading:action.status}))
)
