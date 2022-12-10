import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, of, Subscription, take } from 'rxjs';
import { AppComponent } from '../app.component';
import { AuthService } from '../Auth/auth.service';
import { AuthUser } from '../Auth/authuser.model';
import { isAuthenticated } from '../Auth/store/auth.selector';
import { authState } from '../Auth/store/auth.state';
import { addOneToCounter, resetCounter } from '../chat/store/chat.actions';
import { loadVisitsStart, resetVisitNotificationNumber } from '../visits/store/visits.action';
import {
  getChats,
  getMessagesNotificationsNumber,
} from '../chat/store/chat.selectors';
import { UserService } from '../services/user.service';
import { Chat } from '../shared/models/chat';
import { User } from '../shared/models/user';
import { getCurrentChatUser } from '../shared/store/shared.selector';
import { rootState } from '../store/rootState';
import { getVisitNotificationNumber } from '../visits/store/visits.selectors';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userSub!: Subscription;
  loggedIn!: boolean;
  username!: string | undefined;
  avatar!: string | undefined;
  messageNotificationNumber!: Observable<number>;
  emailCurrentUser!: string | undefined;
  visitNotificationNumber:Observable<number> = this.store.select(getVisitNotificationNumber)
  activeRoute!:string

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private store: Store<[rootState]>,
    private router:Router,
  ) {}

  myChats: Observable<Chat[]> = this.store.select(getChats);
  chats!: Chat[];
  userId!:string

  ngOnInit(): void {


    this.router.events
    .subscribe(event =>
     {
        this.activeRoute = this.router.url;
        console.log(this.activeRoute);
     });

    this.store.select(getCurrentChatUser).subscribe(user => {this.userId =user?.email!;}
    )
    this.store.dispatch(loadVisitsStart({userId:this.userId}))
    this.messageNotificationNumber = this.store.select(
      getMessagesNotificationsNumber
    );

    this.store.select(isAuthenticated).subscribe((status) => {
      this.loggedIn = status;
    });

    this.store.select(getCurrentChatUser).subscribe((user) => {
      this.emailCurrentUser = user?.email;
      this.username =`${user?.firstName} ${user?.lastName}`
      this.avatar = user?.photoUrl;
    });

    this.myChats
      .pipe(
        map((chats) => { take(1),
          this.store.dispatch(resetCounter({counter:0}))
          chats.forEach((chat) => {
            if (
              chat.lastMessageUnread == true &&
              chat.lastMessage?.lastMessageAuthor != this.emailCurrentUser
            ) {
              this.store.dispatch(addOneToCounter())
            }
          });
        })
      )
      .subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  onNotificationsClick(){
    this.router.navigate(['/visits'])
  }
}
