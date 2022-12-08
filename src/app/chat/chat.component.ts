import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../shared/models/message';
import { visitData } from '../shared/models/visit.data';
import {
  Observable,
  combineLatest,
  map,
  switchMap,
  tap,
  of,
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
import { authUser, isAuthenticated } from '../Auth/store/auth.selector';
import { authState } from '@angular/fire/auth';
import {
  getaddChatId,
  getChats,
  getListIsLoadingStatus,
  getMessages,
  getMessagesIsLoadingStatus,
  getMessagesNotificationsNumber,
  getSelectedChat,
} from './store/chat.selectors';
import {
  addChat,
  addOneToCounter,
  listIsLoading,
  loadChats,
  loadChatsSuccess,
  loadMessagesStart,
  messagesIsLoading,
  resetCounter,
  setallUsers,
  setSelectedChat,
} from './store/chat.actions';
import { getCurrentChatUser } from '../shared/store/shared.selector';
import { Timestamp } from '@angular/fire/firestore';
import { VisitsService } from '../services/visits.service';
import { incrementVisitNotificationNumber } from '../visits/store/visits.action';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  username: string = '';
  // messages!: Observable<Message[]>;
  searchControl = new FormControl<string | User>('');
  users!: User[];
  currentUser!: User | null;
  hideClassToggle: boolean = false;
  myChats: Observable<Chat[]> = this.store.select(getChats);
  chatDisplayName: string | undefined = '';
  chatListControl = new FormControl<string[]>(['']);
  messageControl = new FormControl('');
  chatAllMessages: Message[] = [];
  currentDate = new Date().getTime();
  filteredUsers!: Observable<User[]>;
  selectedChat = this.store.select(getSelectedChat);
  selectedChatID!: string;
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
    private authService: AuthService,
    private chatService: ChatService,
    private visitsService: VisitsService,
    private store: Store<rootState>
  ) {}

  ngOnInit(): void {
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

    this.userService.getallUsers().subscribe((user) => {
      this.users = user;
      this.filteredUsers = this.searchControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.displayName;
          return name ? this._filter(name as string) : this.users?.slice();
        })
      );
    });

    // this.store.select(authUser).subscribe(user => this.currentUser = user)
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

  displayFn(user: User): string {
    return user && user.displayName ? user.displayName : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.users.filter((option) =>
      option.displayName?.toLowerCase().includes(filterValue)
    );
  }

  createChat(user: User) {
    this.store.dispatch(addChat({ user }));
    this.store.select(getaddChatId).subscribe((chatId) => {
      this.chatListControl.setValue([chatId]);
    });
    this.searchControl.setValue('');

    // this.chatListControl.setValue([chatId]);
    // this.chatService
    //   .chatExist(user.uid!)
    //   .pipe(
    //     switchMap((chatId) => {
    //       if (chatId) {
    //         this.searchControl.setValue('');
    //         return of(chatId);
    //       } else {
    //         return this.chatService.createChat(user);
    //       }
    //     })
    //   )
    //   .subscribe((chatId) => {
    //     this.chatListControl.setValue([chatId]);
    //   });
  }

  onSubmit() {
    const message = this.messageControl.value;
    const selectedChatID: any = this.chatListControl.value;

    if (message && this.selectedChatID[0]) {
      this.chatService.addChatMessage(selectedChatID[0], message).subscribe();
      this.messageControl.setValue('');
    }
  }

  onClickX() {
    this.chatListControl.setValue(['']);

    // this.chatListControl.valueChanges
    //   .pipe(
    //     map((value) => value![0]),
    //     switchMap((chatID) => this.chatService.getChatMessages(chatID)),

    //   )
    //   .subscribe((messsage) => (this.chatAllMessages = messsage));

    this.hideClassToggle = !this.hideClassToggle;
  }

  setUnreadToFalse() {
    this.chatService.setLastMessageUnreadToFalse(this.selectedChatID);
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
    const date: Timestamp = this.addVisitForm.controls['datePick'].value;
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
      this.visitsService.addVisit(
        this.otherUserId,
        this.currentUser!.email,
        visit
      );
      this.popupVisible = false;
      this.store.dispatch(incrementVisitNotificationNumber({userId:this.otherUserId}))
    }
  }
}
