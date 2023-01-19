import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loginStart} from '../store/auth.actions';
import { Observable} from 'rxjs';
import { rootState } from 'src/app/store/rootState';
import {
  getLoadingSpinner
} from 'src/app/shared/loading-spinner/store/loading-spinner.selector';
import { pageIsLoading } from 'src/app/shared/loading-spinner/store/loading-spinner.actions';
import { getErrorMessage } from 'src/app/shared/store/shared.selector';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading!:Observable<boolean>;
  authUser!: any;

  errorMessage!: Observable<string>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<rootState>
  ) {}

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.isLoading = this.store.select(getLoadingSpinner);
    this.errorMessage = this.store.select(getErrorMessage);
  }

  send() {

    const email: string = this.loginForm.controls['username'].value;
    const password: string = this.loginForm.controls['password'].value;

    this.store.dispatch(loginStart({ email, password }));
    this.store.dispatch(pageIsLoading({ status: true }));

  }
}
