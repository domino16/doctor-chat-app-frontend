import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './Auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  userSub!:Subscription
  loggedIn:boolean = false;

  constructor(private authService:AuthService){}


ngOnInit(): void {
  this.userSub = this.authService.user$.subscribe(user =>{
    this.loggedIn = user ? true : false;
  }
  )
  this.authService.autoLogin()

}

}
