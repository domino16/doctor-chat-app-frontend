import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { HttpUserService } from '../services/http-user.service';
import { map, of, every, find } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  password= '';
  username = '';
  users:User[] = [];
  constructor(private http : HttpUserService) { }

  ngOnInit(): void {
    this.http.getUser().pipe(
      map(res => this.users = res)
    ).subscribe(x => console.log(x))
  }

  send(){
    this.users.forEach(element => {
      if(element.password == this.password && element.username == this.username){
        console.log('udało się zalogować ');
      }
      else {
        console.log('nie udało się zalogować');
      }

    });

    }


}
