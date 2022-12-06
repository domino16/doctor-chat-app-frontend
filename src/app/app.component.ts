import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from './Auth/auth.service';
import { UserService } from './services/user.service';
import { setCurrentChatUserStart } from './shared/store/shared.actions';
import { rootState } from './store/rootState';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  userSub!:Subscription
  loggedIn:boolean = false;

  constructor(private authService:AuthService, private userService:UserService, private  store:Store<[rootState]>){}


ngOnInit(): void {
  this.store.dispatch(setCurrentChatUserStart())
  this.userSub = this.authService.user$.subscribe(user =>{
    this.loggedIn = user ? true : false;
  }
  )
  this.authService.autoLogin()

}

}
