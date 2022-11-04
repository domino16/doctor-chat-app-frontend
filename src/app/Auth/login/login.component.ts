import { Component, OnInit } from '@angular/core';
import { HttpUserService } from '../../services/http-user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  isLoading = false;

  constructor(private http: HttpUserService) {}

  loginForm: FormGroup = new FormGroup ({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })


  ngOnInit(): void {
  }

  send() {
    console.log(this.loginForm);
  }
}
