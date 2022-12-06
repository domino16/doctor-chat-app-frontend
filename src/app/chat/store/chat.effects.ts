import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { Chat } from 'src/app/shared/models/chat';
import * as chatActions from './chat.actions';

@Injectable({
  providedIn: 'root',
})
export class ChatEffects {
  constructor(private actions$: Actions, private chatService: ChatService) {}

  loadChat$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatActions.loadChats),
      switchMap((action) => {
        return this.chatService.myChats.pipe(
          map((chats) => {
            console.log(chats);
            const myChats = chats;
            return chatActions.loadChatsSuccess({ chats: myChats });
          })
        );
      })
    );
  });
}
