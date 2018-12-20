import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AuthService } from '@services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuardService implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.userAuth.pipe(
      tap(auth => console.log('loggedInGuard: ', auth)),
      map(auth => !auth),
      tap(noAuth => {
        if (!noAuth) {
          this.router.navigate(['/landing']);
        }
      })
    );
  }
}
