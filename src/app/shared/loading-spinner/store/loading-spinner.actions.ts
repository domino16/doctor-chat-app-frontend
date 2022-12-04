import { createAction, props } from '@ngrx/store';

export const setLoadingSpinner = createAction(
  'set loading spinner',
  props<{ status: boolean }>()
);
