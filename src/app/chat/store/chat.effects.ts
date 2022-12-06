import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { act, Actions, createEffect, ofType } from '@ngrx/effects';
import { createEffects } from '@ngrx/effects/src/effects_module';
import { switchMap, map, exhaustMap, of, tap } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { Chat } from 'src/app/shared/models/chat';
import * as chatActions from './chat.actions';

@Injectable({
  providedIn: 'root',
})
export class ChatEffects {
  constructor(private actions$: Actions, private chatService: ChatService, private userService: UserService
  ) {}

  loadChat$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatActions.loadChats),
      switchMap((action) => {
        console.log(action)
        return this.chatService.myChats.pipe(
          map((chats) => {
            console.log(chats);
            return chatActions.loadChatsSuccess({ chats });
          })
        );
      })
    );
  });

  addChat$ = createEffect(()=>{
    return this.actions$.pipe(
      ofType(chatActions.addChat),
      switchMap((action)=>{return this.chatService.chatExist(action.user.uid!).
        pipe(switchMap((chatId) =>{if (chatId) {
                  return of(chatId);
                } else {
                  return this.chatService.createChat(action.user);
                }
        }))
      }
    )
  )},{ dispatch: false })


  loadAllUsers = createEffect(()=>{
  return this.actions$.pipe(
    ofType(chatActions.setallUsers),
    switchMap(action =>{ return this.userService.getallUsers().pipe( map(users =>{
      return chatActions.setAllUsersSuccess({users:users})
    }))})
  )})

  loadMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatActions.loadMessagesStart),
      switchMap((action) => {
        return this.chatService.getChatMessages(action.chatId).pipe(
          map((messages) => {
            return chatActions.loadMessagesSuccess({ messages: messages  });
          })
        );
      })
    );
  });



    }
