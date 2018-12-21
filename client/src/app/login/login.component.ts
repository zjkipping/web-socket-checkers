import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';

  constructor(fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.authService.loginUser(
      this.loginForm.value['username'],
      this.loginForm.value['password']
    ).subscribe(
      res => {
        this.router.navigate(['/lobbies']);
      },
      res => {
        this.error = res.error.message;
      }
    );
  }
}
