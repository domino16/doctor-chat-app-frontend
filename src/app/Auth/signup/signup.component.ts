import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/user';
import { HttpUserService } from '../../services/http-user.service';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { Validation } from '../passwordValidators/validation';
import { StrongPasswordValidation } from '../passwordValidators/strongPasswordValidation';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  isLoading = false;
  error: string = '';

  numberPattern = new RegExp('(?=.*[0-9])');
  uppercasePattern = new RegExp('(?=.*[A-Z])');
  lowercasePattern = new RegExp('(?=.*[a-z])');
  symbolsPattern = new RegExp('(?=.*[$@^!%*?&-.;:])');

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  signupForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    repassword: new FormControl(''),
    email: new FormControl(''),
    acceptTerms: new FormControl(''),
  });

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(15),
          ],
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            StrongPasswordValidation.patternValidator(this.numberPattern, {
              requiresnumber: true,
            }),
            StrongPasswordValidation.patternValidator(this.uppercasePattern, {
              requiresuppercase: true,
            }),
            StrongPasswordValidation.patternValidator(this.lowercasePattern, {
              requireslowercase: true,
            }),
            StrongPasswordValidation.patternValidator(this.symbolsPattern, {
              requiressymbol: true,
            }),
          ]),
        ],
        repassword: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        acceptTerms: [false, Validators.requiredTrue],
      },
      {
        validator: Validation.match('password', 'repassword'), // custom validation
      }
    );
  }

  onSubmit() {
    console.log(this.signupForm.valid);
    if (!this.signupForm.valid) {
      return;
    } else {
      const email: string = this.signupForm.controls['email'].value;
      const password: string = this.signupForm.controls['password'].value;

      this.isLoading = true;
      this.authService.signup(email, password).subscribe({
        next: (resData) => {
          console.log(resData);
          this.isLoading = false;
        },
        error: (errorMessage) => {
          console.error(errorMessage);
          this.error = errorMessage;
          this.isLoading = false;
        },
      });
      // this.signupForm.reset;
    }
  }
}
