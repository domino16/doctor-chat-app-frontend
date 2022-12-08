import { createAction, props } from "@ngrx/store"
import { visitData } from "src/app/shared/models/visit.data"


export const incrementVisitNotificationNumber = createAction('[VisitPAGE]+1 Visit Notification Number')
export const decrementVisitNotificationNumber = createAction('[VisitPAGE] -1 Visit Notification Number')
export const resetVisitNotificationNumber = createAction('[VisitPAGE] reset Visit Notification Number')
export const loadVisitsStart = createAction('[CHAT PAGE] load visits start', props<{userId: string}>())
export const loadVisitsSuccess = createAction('[CHAT PAGE] load visits succsess', props<{visits:visitData[]}>())
