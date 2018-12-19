import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  username?: string;
  userAuth = new BehaviorSubject<string | undefined>(undefined);

  constructor() {
    this.username = 'Outis';
  }

  login(username: string) {
    this.username = username;
    this.userAuth.next(this.username);
  }
}
