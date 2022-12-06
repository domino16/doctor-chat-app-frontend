import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { AuthService } from '../Auth/auth.service';
import { AuthUser } from '../Auth/authuser.model';
import { isAuthenticated } from '../Auth/store/auth.selector';
import { authState } from '../Auth/store/auth.state';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user';
import { getCurrentChatUser } from '../shared/store/shared.selector';
import { rootState } from '../store/rootState';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userSub!:Subscription;
  loggedIn!:boolean;
  username!:string | undefined;
  avatar!:string | undefined


  constructor(private authService: AuthService, private userService:UserService, private store:Store<[rootState]>){}


  ngOnInit(): void {
    this.store.select(isAuthenticated).subscribe(status => {this.loggedIn = status; console.log(status)})

    this.store.select(getCurrentChatUser).subscribe(user => {this.username = user?.displayName; this.avatar = user?.photoUrl} );


  }

  onLogout(){
    this.authService.logout()
  }


}
