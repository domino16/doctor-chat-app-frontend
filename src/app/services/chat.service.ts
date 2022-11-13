import { Injectable } from '@angular/core';
import {
  doc,
  addDoc,
  updateDoc,
  collectionData,
  Firestore,
  query,
  where,
  Timestamp,
  collection,
  orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { concatMap, take, map } from 'rxjs/operators';
import { Chat } from '../shared/models/chat';
import { Message } from '../shared/models/message';
import { User } from '../shared/models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private firestore: Firestore, private userService: UserService) {}

  createChat(otherChatUser: User) {
    const ref = collection(this.firestore, 'chats');
    return this.userService.CurrentAuthUSer.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          userIDs: [user?.uid, otherChatUser.uid],
          users: [
            {
              displayName: user?.displayName ?? '',
              photoUrl: user?.photoUrl ?? '',
            },
            {
              displayName: otherChatUser.displayName ?? '',
              photoUrl: otherChatUser.photoUrl ?? '',
            },
          ],
        })
      ),
      map((ref) => ref.id)
    );
  }

  get myChats(): Observable<Chat[]> {
    const ref = collection(this.firestore, 'chats');
    return this.userService.CurrentAuthUSer.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('userIDs', 'array-contains', user?.email)
        );
        return collectionData(myQuery, { idField: 'id' }).pipe(
          map((chats: any) => this.addChatNameAndPic(user?.uid ?? '', chats))
        ) as Observable<Chat[]>;
      })
    );
  }

  addChatNameAndPic(currentUserEmail: string, chats: Chat[]): Chat[] {
    chats.forEach((chat: Chat) => {
      // if (chat.userIds) {
      // const otherIndex = chat.userIds.indexOf(currentUserEmail ?? '') === 0 ? 1 : 0;
      const { displayName, photoUrl } = chat.users[1];
      chat.chatName = displayName;
      chat.chatImg = photoUrl;
      // }
    });

    return chats;
  }

  addChatMessage(chatId: string, message: string): Observable<any> {
    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const chatRef = doc(this.firestore, 'chats', chatId);
    const today = Timestamp.fromDate(new Date());
    return this.userService.CurrentAuthUSer.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          message: message,
          author: user?.uid,
          sentDate: today,
        })
      ),
      concatMap(() =>
        updateDoc(chatRef, { lastMessage: message, lastMessageDate: today })
      )
    );
  }

  getChatMessages(chatId: string): Observable<Message[]> {
    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const queryAll = query(ref, orderBy('sentDate', 'asc'));
    return collectionData(queryAll) as Observable<Message[]>;
  }
}
