import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import * as visitActions from '../store/visits.action'
import { VisitsService } from '../visits.service';

@Injectable({
  providedIn: 'root'
})
export class VisitsEffects {

  constructor(private visitsService:VisitsService, private actions$: Actions, ) { }

  loadVisits$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(visitActions.loadVisitsStart),
      switchMap((action) => {
        return this.visitsService.getVisits(action.userId).pipe(
          map((visits) => {
            console.log(visits);
            return visitActions.loadVisitsSuccess({ visits: visits  });
          })
        );
      })
    );
  });
}
