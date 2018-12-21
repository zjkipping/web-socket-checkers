import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective, FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';

import { AuthService } from '@services/auth.service';

class PasswordValidationErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.dirty && form && form.hasError('passwordsDoNotMatch'));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  error = '';
  passwordValidation = new PasswordValidationErrorMatcher();

  constructor(fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      password_conf: ['', Validators.required]
    }, {
      validator: this.passwordValidator
    });
  }

  register() {
    this.authService.registerUser(
      this.registerForm.value['username'],
      this.registerForm.value['email'],
      this.registerForm.value['password']
    ).subscribe(
      _res => this.router.navigate(['/login']),
      res => this.error = res.error.message
    );
  }

  passwordValidator(form: FormGroup) {
    const password = form.get('password');
    const conf_password = form.get('password_conf');
    if (password && conf_password) {
      const condition = password.value !== conf_password.value;
      return condition ? { passwordsDoNotMatch: true} : null;
    } else {
      return null;
    }
  }
}
