import { Component, OnInit } from '@angular/core';
import { Message } from '../shared/models/message';
import { visitData } from '../shared/models/visit.data';
import {
  Observable,
  combineLatest,
  map,
  switchMap,
  tap,
  startWith,
  take,
} from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user';
import { AuthService } from '../Auth/auth.service';
import { ChatService } from '../services/chat.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Chat } from '../shared/models/chat';
import { Store } from '@ngrx/store';
import { rootState } from '../store/rootState';

import {
  getaddChatId,
  getChats,
  getListIsLoadingStatus,
  getMessages,
  getMessagesIsLoadingStatus,
  getSelectedChat,
} from './store/chat.selectors';
import {
  addChat,
  addOneToCounter,
  listIsLoading,
  loadChats,
  loadMessagesStart,
  messagesIsLoading,
  resetCounter,
  setallUsers,
  setSelectedChat,
} from './store/chat.actions';
import { getCurrentChatUser } from '../shared/store/shared.selector';
import { VisitsService } from '../services/visits.service';
import {
  incrementVisitNotificationNumber,
} from '../visits/store/visits.action';
import { WebSocketService } from '../services/webSocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  username: string = '';

  searchControl = new FormControl<string | User>('');
  users!: User[];
  currentUser!: User | null;
  hideClassToggle: boolean = false;
  myChats: Observable<Chat[]> = this.store
    .select(getChats)
    .pipe(
      map((chats) =>
        [...chats].sort(
          (a, b) =>
            new Date(b.lastMessage?.lastMessageDate!).getTime() -
            new Date (a.lastMessage?.lastMessageDate!).getTime()!
        )
      )
    );

  chatListControl = new FormControl<number[]>([0]);
  messageControl = new FormControl('');
  chatAllMessages: Message[] = [];
  currentDate = new Date().getTime();
  filteredAllUsers!: Observable<User[]>;
  filteredAllDoctor!: Observable<User[]>;
  selectedChat = this.store.select(getSelectedChat);
  selectedChatID: number = 0;
  otherUserId!: string;
  otherUserIndex!: number;
  myUserIndex!: number;
  listIsLoading: Observable<Boolean> = this.store.select(
    getListIsLoadingStatus
  );
  messagesIsLoading: Observable<Boolean> = this.store.select(
    getMessagesIsLoadingStatus
  );

  popupVisible: boolean = false;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private visitsService: VisitsService,
    private store: Store<rootState>,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.webSocketService._connect();
    this.store.dispatch(listIsLoading({ status: true }));
    this.store.dispatch(loadChats());
    this.store.dispatch(setallUsers());
    this.store.select(getChats).subscribe();
    this.store.select(getMessages).subscribe((messages) => {
      this.chatAllMessages = [...messages].reverse();
    });

    combineLatest([this.chatListControl.valueChanges, this.myChats])
      .pipe(
        map(([value, chats]) => {
          return chats.find((c) => c.id === value![0])!;
        })
      )
      .subscribe((chat) =>
        this.store.dispatch(setSelectedChat({ selectedChat: chat }))
      );

    this.userService.getallUsers().subscribe((users) => {
      this.users = users;
      this.filteredAllDoctor = this.searchControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.email;
          return name
            ? this._filter(name as string)
            : users.filter((user) => user.doctor == true).slice();
        })
      );

      this.filteredAllUsers = this.searchControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          // const name = typeof value === 'string' ? value : value?.displayName;
          const name = typeof value === 'string' ? value : value?.email;
          return name ? this._filter(name as string) : this.users?.slice();
        })
      );
    });

    this.store
      .select(getCurrentChatUser)
      .subscribe((user) => (this.currentUser = user));

    this.store.select(getSelectedChat).subscribe((chat) => {
      this.otherUserIndex =
        chat?.userIDs.indexOf(this.currentUser?.email ?? '') === 0 ? 1 : 0;
      this.myUserIndex =
        chat?.userIDs.indexOf(this.currentUser?.email ?? '') === 0 ? 0 : 1;
      this.otherUserId = chat?.userIDs[this.otherUserIndex]!;
    });

    this.chatListControl.valueChanges
      .pipe(
        tap(() => {
          this.store.dispatch(loadChats());
          this.myChats.pipe(take(1)).subscribe((chats) => {
            this.store.dispatch(resetCounter({ counter: 0 }));
            return chats.forEach((chat) => {
              if (
                chat.lastMessageUnread == true &&
                chat.lastMessage?.lastMessageAuthor == this.currentUser?.email
              ) {
                this.store.dispatch(addOneToCounter());
              }
            });
          });
        }),
        map((value) => {
          this.webSocketService._connect();
          this.selectedChatID = value![0];
          this.chatService.setLastMessageUnreadToFalse(this.selectedChatID);
          this.chatAllMessages = null!;
          this.store.dispatch(messagesIsLoading({ status: true }));
          if (this.selectedChatID) {
            return this.store.dispatch(
              loadMessagesStart({ chatId: this.selectedChatID })
            );
          }
        }),
        switchMap(() => this.store.select(getMessages))
      )
      .subscribe(() => {});
  }


  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    const filteredUsers = this.users.filter((option) => {
      const arr = filterValue.split(' ');
      return arr.some(
        (el) =>
          option.firstName?.toLowerCase().includes(el) ||
          option.lastName?.toLowerCase().includes(el)
      );
    });
    return filteredUsers;
  }

  createChat(user: User) {
    this.store.dispatch(addChat({ user }));
    this.store
      .select(getaddChatId)
      .pipe(take(100))
      .subscribe((chatId) => {
        this.chatListControl.setValue([chatId]);
      });
    this.searchControl.setValue('');


  }

  onSubmit() {
    const message: string = this.messageControl.value!;
    const selectedChatID: any = this.chatListControl.value;

    this.chatService.addChatMessage(selectedChatID[0], message!);

    this.messageControl.setValue('');
  }

  onClickX() {
    this.chatListControl.setValue([0]);


    this.hideClassToggle = !this.hideClassToggle;
  }

  setUnreadToFalse() {
    this.chatService.setLastMessageUnreadToFalse(this.selectedChatID);
    this.store.dispatch(loadChats());
  }

  popupVisibleToggle() {
    this.popupVisible = !this.popupVisible;
  }

  addVisitForm: FormGroup = new FormGroup({
    datePick: new FormControl('', Validators.required),
    timePick: new FormControl('', Validators.required),
    placePick: new FormControl('', Validators.required),
    comment: new FormControl(''),
  });

  visitAddSubmit() {
    const date: Date = this.addVisitForm.controls['datePick'].value;
    const time: string = this.addVisitForm.controls['timePick'].value;
    const place: string = this.addVisitForm.controls['placePick'].value;
    const comment: string = this.addVisitForm.controls['comment'].value;

    const visit: visitData = {
      date: date,
      time: time,
      place: place,
      comment: comment,
      doctor: `${this.currentUser?.firstName} ${this.currentUser?.lastName}`,
      doctorImg: this.currentUser?.photoUrl!,
    };

    if (this.addVisitForm.valid) {
      this.store.dispatch(
        incrementVisitNotificationNumber({ userId: this.otherUserId })
      );
      this.visitsService.addVisit(
        this.otherUserId,
        this.currentUser!.email,
        visit
      );
      this.popupVisible = false;
    }
  }

}
