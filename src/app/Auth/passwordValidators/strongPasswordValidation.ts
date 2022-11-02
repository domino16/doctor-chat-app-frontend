import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class StrongPasswordValidation{

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

      const valid = regex.test(control.value);
      return valid ? null! : error;
    };
  }
}


