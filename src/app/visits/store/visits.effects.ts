import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, take } from 'rxjs';
import * as visitActions from '../store/visits.action';
import { VisitsService } from '../../services/visits.service';
import { UserService } from 'src/app/services/user.service';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class VisitsEffects {
  constructor(
    private visitsService: VisitsService,
    private actions$: Actions,
    private userService: UserService
  ) {}

  loadVisits$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(visitActions.loadVisitsStart),
      switchMap((action) => {
        return this.visitsService.getVisits(action.userId).pipe(
          map((visits) => {
            return visitActions.loadVisitsSuccess({ visits: visits });
          })
        );
      })
    );
  });


  incrementVisitsNotifyNumber$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(visitActions.incrementVisitNotificationNumber),
      switchMap((action) => {

        return this.userService.getUserById(action.userId).pipe(take(1),
          map((user) => {
               const newNumber =user.visitNotificationsNumber + 1
              return this.visitsService.updateVisitNotificationNumber(action.userId, newNumber)

          })
        );
      })
    );
  },{dispatch:false});


  resetVisitsNotifyNumber$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(visitActions.resetVisitNotificationNumber),
      switchMap((action) => {
        return this.userService.CurrentAuthUser().pipe(take(2), map(user =>{
          return this.visitsService.updateVisitNotificationNumber(user?.uid!, 0)
        }))

      })
    );
  },{dispatch:false});

  loadVisitNotificationsNuumber$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(visitActions.loadNotificationNumberStart),
      switchMap((action) => {
        return this.userService.CurrentAuthUser().pipe( map(user =>{
          return visitActions.loadNotificationNumberSuccess({visitNotificationNumber: +(user?.visitNotificationsNumber!)})}
        ))

      })
    );
  });

}
