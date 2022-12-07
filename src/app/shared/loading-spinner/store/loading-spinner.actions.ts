import { createAction, props } from '@ngrx/store';

export const pageIsLoading = createAction(
  'page is loading',
  props<{ status: boolean }>()
);
