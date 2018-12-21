import { Component } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Lobby } from '@types';
import { SocketService } from '@services/socket.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-lobby-list',
  templateUrl: './lobby-list.component.html',
  styleUrls: ['./lobby-list.component.scss']
})
export class LobbyListComponent {
  displayedColumns: string[] = ['name', 'owner', 'status', 'players', 'spectators', 'actions'];
  lobbyName: FormControl;
  lobbies: Observable<Lobby[]>;

  constructor(fb: FormBuilder, private socket: SocketService, private auth: AuthService) {
    this.lobbyName = fb.control('room#1', Validators.required);
    this.lobbies = this.socket.lobbies;
  }

  createLobby() {
    this.socket.createLobby(this.lobbyName.value);
  }

  joinLobby(id: string) {
    this.socket.joinLobby(id);
  }
}
