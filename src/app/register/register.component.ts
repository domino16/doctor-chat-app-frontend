import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { HttpUserService } from '../services/http-user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  username = '';
  password = '';
  repassword = '';
  email = '';

  constructor(private http: HttpUserService) { }

  ngOnInit(): void {
  }

  send(){
    const user: User = {
      username: this.username,
      password: this.password,
      email: this.password,
      imgSrc:'https://solisradius.pl/wp-content/uploads/2021/04/person-icon.png',
      loginStatus: false,

  }

    this.http.postUser(user).subscribe()
  }

}

