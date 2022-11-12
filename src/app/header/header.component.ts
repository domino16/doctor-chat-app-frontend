import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { AuthService } from '../Auth/auth.service';
import { AuthUser } from '../Auth/authuser.model';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userSub!:Subscription;
  loggedIn:boolean = false;
  username!:string | undefined;


  constructor(private authService: AuthService, private userService:UserService){}


  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user =>{
      this.loggedIn = !!user
    })

    this.userService.CurrentAuthUSer.subscribe(user => this.username = user?.displayName);
  }

  onLogout(){
    this.authService.logout()
  }


}
