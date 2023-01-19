import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { addChatId, loadChats, messagesIsLoading } from '../chat/store/chat.actions';
import { getSelectedChat } from '../chat/store/chat.selectors';
import { Chat } from '../shared/models/chat';
import { Message } from '../shared/models/message';
import { User } from '../shared/models/user';
import { UserService } from './user.service';
import { WebSocketService } from './webSocket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private userService: UserService,
    private store: Store,
    private http: HttpClient,
    private webSocketService: WebSocketService
  ) {}

  createChat(otherChatUser: User) {

    this.userService
      .CurrentAuthUser()
      .pipe(
        take(1),
        switchMap((user) =>{
         return this.http.post('http://localhost:8080/chats/addchat', {
            userIDs: [user?.email, otherChatUser.email],
            firstChatUser: {
              email: user?.email ?? '',
              photoUrl: user?.photoUrl ?? '',
              firstName: user?.firstName ?? '',
              lastName: user?.lastName ?? '',
            },
            secondChatUser: {
              email: otherChatUser.email ?? '',
              photoUrl: otherChatUser.photoUrl ?? '',
              firstName: otherChatUser?.firstName ?? '',
              lastName: otherChatUser?.lastName ?? '',
            },
          })
  })
      )
      .subscribe((id)=>{
        this.store.dispatch(loadChats()),
        this.store.dispatch(addChatId({chatId:+id}))
      });
    return otherChatUser.email;
  }

  chatExist(otherChatUser: string): Observable<number | null> {
    return this.myChats.pipe(
      take(1),
      map((chats) => {
        for (let i = 0; i < chats.length; i++) {
          if (chats[i].userIDs.includes(otherChatUser)) {
            console.log(chats);
            this.store.dispatch(addChatId({chatId:chats[i].id}))
            return chats[i].id;
          }
        }
        return null;
      })
    );
  }

  get myChats(): Observable<Chat[]> {


    return this.userService.CurrentAuthUser().pipe(
      switchMap((user) => {
        return this.http
          .get<Chat[]>(`http://localhost:8080/chats/${user?.email}`)
          .pipe(
            map((chats) => this.addChatNameAndPic(user?.email ?? '', chats))
          ) as Observable<Chat[]>;
      })
    );
  }

  addChatNameAndPic(currentUserId: string | undefined, chats: Chat[]): Chat[] {
    chats.forEach((chat: Chat) => {
      const otherUserIndex =
        chat.userIDs?.indexOf(currentUserId ?? '') === 0 ? 1 : 0;
      const { photoUrl, firstName, lastName } = chat.users[otherUserIndex];
      chat.chatName = `${firstName} ${lastName}`;
      chat.chatImg = photoUrl;
    });

    return chats;
  }

  addChatMessage(chatId: number, message: string) {

    let messageAuthor = '';
    const today = new Date();

    return this.userService
      .CurrentAuthUser()
      .pipe(take(2))
      .subscribe((user) => {
        messageAuthor = user?.email!;
        this.http
          .patch(`http://localhost:8080/chats/lastmessage/${chatId}`, {
            lastMessageUnread: true,
            lastMessage: {
              lastMessage: message,
              lastMessageDate: today,
              lastMessageAuthor: messageAuthor,
            },
          })
          .subscribe();
        this.webSocketService.sendMessage(
          JSON.stringify({
            message: message,
            author: user?.email!,
            sentDate: today,
          })
        );
      });
  }

  setLastMessageUnreadToFalse(chatId: number) {
    if (chatId) {

      this.http
        .patch(
          `http://localhost:8080/chats/setlastmessageunreadtofalse/${chatId}`,
          false
        )
        .subscribe();
    }
  }

  getChatMessages(chatId: number): Observable<Message[]> {

    let selectedChatID: number;
    this.store.dispatch(messagesIsLoading({status:false}))
    this.store.select(getSelectedChat).subscribe((chat) => {
      console.log(chatId);
      selectedChatID = chat?.id!;
    });

    return this.webSocketService.messageComeEvent.pipe(
      switchMap((newMessage) => {
        return this.store.select(getSelectedChat).pipe((switchMap) => {
          return this.http.get<Message[]>(
            `http://localhost:8080/chats/messages/${selectedChatID}`
          );
        });
      })
    );
  }
}
