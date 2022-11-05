import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,

  Validators,
} from '@angular/forms';

import { Validation } from '../passwordValidators/validation';
import { StrongPasswordValidation } from '../passwordValidators/strongPasswordValidation';
import { AuthService } from '../auth.service';

import { Router } from '@angular/router';

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
    private router: Router,
  ) {}

  signupForm: FormGroup = new FormGroup(
    {
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15),
      ]),
      password: new FormControl(
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
        ])
      ),
      repassword: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      acceptTerms: new FormControl(false, Validators.requiredTrue),
    },
    Validation.match('password', 'repassword')
  );

  ngOnInit(): void {

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
          this.router.navigate(['chat'])
        },
        error: (errorMessage) => {
          console.error(errorMessage);
          this.error = errorMessage;
          this.isLoading = false;
        },
      });

    }
  }
}
