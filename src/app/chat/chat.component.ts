import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../shared/models/message';
import { Observable, combineLatest, map, from, switchMap, tap } from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user';
import { AuthUser } from '../Auth/authuser.model';
import { AuthService } from '../Auth/auth.service';
import { ChatService } from '../services/chat.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Chat } from '../shared/models/chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild('chatEnd')
  chatEnd!: ElementRef;

  username: string = '';
  messages!: Observable<Message[]>;
  searchControl = new FormControl('');
  users: Observable<User[]> = this.userService.getallUsers();
  currentUser!: User | null;
  myChats: Observable<Chat[]> = this.chatService.myChats;
  chatDisplayName: string | undefined = '';
  chatListControl = new FormControl('');
  messageControl = new FormControl('');
  chatAllMessages: Message[] = []
  selectedChat = combineLatest([
    this.chatListControl.valueChanges,
    this.myChats,
  ]).pipe(map(([value, chats]) => chats.find((c) => c.id === value![0])));

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.userService.CurrentAuthUSer.subscribe(
      (user) => (this.currentUser = user)
    );

    this.chatListControl.valueChanges.pipe(
      map((value) => value![0]),
      switchMap((chatID) => this.chatService.getChatMessages(chatID)),
      tap(() => {
        this.scrollToBottom();
      })
    ).subscribe(messsage => this.chatAllMessages = messsage);
  }

  createChat(user: User) {
    this.chatService.createChat(user).subscribe();
  }

  onSubmit() {
    const message = this.messageControl.value;
    const selectedChatID: any = this.chatListControl.value;

    if (message && selectedChatID[0]) {
      this.chatService.addChatMessage(selectedChatID[0], message).subscribe();
        this.messageControl.setValue('');
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatEnd) {
        this.chatEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 10);
  }
}
