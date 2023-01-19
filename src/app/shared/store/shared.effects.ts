import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap} from "rxjs";
import { UserService } from "src/app/services/user.service";
import { setCurrentChatUserStart, setCurrentChatUserSuccess } from "./shared.actions";

@Injectable()
export class SharedEffects {
  constructor(private actions$: Actions,  private userService: UserService
  ) {}

  setCurrentUser$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(setCurrentChatUserStart),
        switchMap(() => {
          return this.userService.CurrentAuthUser().pipe( map(user => {
            return setCurrentChatUserSuccess({currentChatUser:user!})
          }))
        })
      );
    },
  );

  }
