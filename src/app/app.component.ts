import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, ɵBrowserPlatformLocation } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from './Auth/auth.service';
import { setCurrentChatUserStart } from './shared/store/shared.actions';
import { rootState } from './store/rootState';
import { loadNotificationNumberStart } from './visits/store/visits.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  userSub!:Subscription
  loggedIn:boolean = false;

  constructor(private authService:AuthService, private  store:Store<[rootState]>,@Inject(PLATFORM_ID) private platformId:ɵBrowserPlatformLocation){}


ngOnInit(): void {
  this.store.dispatch(loadNotificationNumberStart())
  this.store.dispatch(setCurrentChatUserStart())
  this.userSub = this.authService.user$.subscribe(user =>{
    this.loggedIn = user ? true : false;
  }
  )
  if(isPlatformBrowser(this.platformId)){
    this.authService.autoLogin()
  }

}

}
