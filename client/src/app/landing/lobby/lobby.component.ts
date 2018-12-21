import { Component } from '@angular/core';
import { SocketService } from '@services/socket.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent {
  constructor(private socket: SocketService) { }

  leaveLobby() {
    this.socket.leaveLobby();
  }
}
