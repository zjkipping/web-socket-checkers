import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

import { environment } from '../../environments/environment';
import { UserAuth } from '@types';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userAuth: BehaviorSubject<UserAuth | undefined>;

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {
    const accessToken = this.cookieService.get('access_token');
    this.userAuth = new BehaviorSubject(accessToken !== '' ? { accessToken } : undefined ) as BehaviorSubject<UserAuth | undefined>;
  }

  registerUser(username: string, email: string, password: string): Observable<any> {
    return this.http.post(API_URL + '/register', { username, email, password }).pipe(take(1));
  }

  loginUser(username: string, password: string): Observable<any> {
    return this.http.post<UserAuth>(API_URL + '/login', { username, password }).pipe(
      take(1),
      tap((res: UserAuth) => {
        this.userAuth.next(res)
        this.cookieService.set('access_token', res.accessToken);
      })
    );
  }

  logoutUser(): void {
    this.cookieService.delete('access_token');
    this.userAuth.next(undefined);
    this.router.navigate(['/login']);
  }
}
