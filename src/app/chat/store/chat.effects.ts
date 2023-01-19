import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, of } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { rootState } from 'src/app/store/rootState';
import * as chatActions from './chat.actions';

@Injectable({
  providedIn: 'root',
})
export class ChatEffects {
  constructor(private actions$: Actions, private chatService: ChatService, private userService: UserService, private store:Store<[rootState]>) {}

  loadChat$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatActions.loadChats),
      switchMap((action) => {
        return this.chatService.myChats.pipe(
          map((chats) => {
            this.store.dispatch(chatActions.listIsLoading({status:false}))
            return chatActions.loadChatsSuccess({ chats });
          })
        );
      })
    );
  });


  addChat$ = createEffect(()=>{
    return this.actions$.pipe(
      ofType(chatActions.addChat),
      switchMap((action)=>{
        return this.chatService.chatExist(action.user.email).pipe(switchMap((chatId) =>{if (chatId) {

                  return of(chatId);
                } else {
                  return this.chatService.createChat(action.user);
                }

        }))
      }
    )
  )},{dispatch:false})


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
            this.store.dispatch(chatActions.messagesIsLoading({status:false}))
            return chatActions.loadMessagesSuccess({ messages: messages  });
          })
        );
      })
    );
  });





    }
