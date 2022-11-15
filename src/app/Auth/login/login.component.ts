import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  ngOnInit(): void {}

  send() {
    console.log(this.loginForm);

    const email: string = this.loginForm.controls['username'].value;
    const password: string = this.loginForm.controls['password'].value;
    this.isLoading = true;
    this.authService.signin(email, password).subscribe({
      next: (resData) => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        console.log(errorMessage);
        this.isLoading = false;
      },
    });
  }
}
