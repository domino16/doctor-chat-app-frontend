import { createAction, props } from "@ngrx/store";


export const setErrorMessage = createAction('set error message', props<{message:string}>())
