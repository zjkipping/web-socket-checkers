import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { LobbyComponent } from './lobby.component';
import { SocketService } from '@services/socket.service';

@Injectable({
  providedIn: 'root'
})
export class LobbyLeaveGuardService implements CanDeactivate<LobbyComponent> {
  constructor(private socket: SocketService, private dialog: MatDialog) { }

  canDeactivate(): Observable<boolean> | boolean {
    console.log('um yo wtf', this.socket.inLobby);
    if (this.socket.inLobby) {
      // return this.dialog.open(ConfirmCancelDialogComponent).afterClosed();
      return window.confirm(
        'Are you sure you want to leave the lobby? (if you are the owner, the lobby will close)'
      );
    } else {
      return true;
    }
  }
}
