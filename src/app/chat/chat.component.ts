import { Component, OnInit } from '@angular/core';
import { Message } from '../shared/models/message';
import { Observable, combineLatest, map } from 'rxjs';
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
  username: string = '';
  message: string = '';
  messages!: Observable<Message[]>;
  searchControl = new FormControl('');
  users: Observable<User[]> = this.userService.getallUsers();
  currentUserEmail: string | undefined = '';
  myChats:Observable<Chat[]> = this.chatService.myChats;
  chatDisplayName:string | undefined = ''
  chatListControl = new FormControl('');
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
      (user) => (this.currentUserEmail = user?.email)
    );
      this.chatListControl.valueChanges.subscribe(data=> console.log(data))
    }

  createChat(user: User) {
    this.chatService.createChat(user).subscribe();
  }

  onSubmit() {}
}
