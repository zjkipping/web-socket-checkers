import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AuthService } from '@services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.userAuth.pipe(
      tap(auth => console.log('authGuard: ', auth)),
      map(auth => !!auth),
      tap(hasAuth => {
        if (!hasAuth) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
