import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../shared/models/message';
import {
  Observable,
  combineLatest,
  map,
  switchMap,
  tap,
  of,
  startWith,
} from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user';
import { AuthService } from '../Auth/auth.service';
import { ChatService } from '../services/chat.service';
import { FormControl } from '@angular/forms';
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
  getSelectedChat,
} from './store/chat.selectors';
import {
  addChat,
  listIsLoading,
  loadChats,
  loadChatsSuccess,
  loadMessagesStart,
  messagesIsLoading,
  setallUsers,
  setSelectedChat,
} from './store/chat.actions';
import { getCurrentChatUser } from '../shared/store/shared.selector';

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
  chatListControl = new FormControl< string | string[]>('');
  messageControl = new FormControl('');
  chatAllMessages: Message[] = [];
  currentDate = new Date().getTime();
  filteredUsers!: Observable<User[]>;
  selectedChat = this.store.select(getSelectedChat);
  selectedChatID!:string
  otherUserIndex!: number;
  myUserIndex!: number;
  listIsLoading: Observable<Boolean> = this.store.select(
    getListIsLoadingStatus
  );
  messagesIsLoading: Observable<Boolean> = this.store.select(
    getMessagesIsLoadingStatus
  );

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private chatService: ChatService,
    private store: Store<rootState>
  ) {}

  ngOnInit(): void {
    this.chatService.setLastMessageUnreadToFalse(this.selectedChatID)
    this.store.dispatch(listIsLoading({ status: true }));
    this.store.dispatch(loadChats());

    this.store.dispatch(setallUsers());
    this.store.select(getChats).subscribe();
    this.store.select(getMessages).subscribe(messages => {this.chatAllMessages = [...messages].reverse()
    })

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
    });

    this.chatListControl.valueChanges
      .pipe(
        map((value) => {
          this.selectedChatID = this.chatListControl.value as string
          this.chatAllMessages = null!;
          this.store.dispatch(messagesIsLoading({ status: true }));
          return this.store.dispatch(loadMessagesStart({ chatId: value![0] }));
        }),
        switchMap(() => this.store.select(getMessages)),

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
    this.store.dispatch(addChat({ user }))
    this.store.select(getaddChatId).subscribe(chatId => {
      console.log(chatId)
      this.chatListControl.setValue([chatId]);
    })
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

    if (message && this.selectedChatID![0]) {
      this.chatService.addChatMessage(selectedChatID[0], message).subscribe();
      this.messageControl.setValue('');
    }
  }


  onClickX() {
    this.chatListControl.setValue('');

    // this.chatListControl.valueChanges
    //   .pipe(
    //     map((value) => value![0]),
    //     switchMap((chatID) => this.chatService.getChatMessages(chatID)),

    //   )
    //   .subscribe((messsage) => (this.chatAllMessages = messsage));

    this.hideClassToggle = !this.hideClassToggle;
  }
}
