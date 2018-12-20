import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { SocketService } from '@services/socket.service';

@Injectable({
  providedIn: 'root'
})
export class LobbyEnterGuardService implements CanActivate {
  constructor(private socket: SocketService, private router: Router) { }

  canActivate(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    if (!this.socket.inLobby) {
      this.router.navigate(['/landing']);
    }
    return this.socket.inLobby;
  }
}
