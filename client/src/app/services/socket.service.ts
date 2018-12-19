import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { LobbyList, Lobby } from '../types';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  lobbies: Observable<Lobby[]>

  constructor(private io: Socket, private auth: AuthService) {
    this.lobbies = this.io.fromEvent<LobbyList>('lobbyList').pipe(
      map(lobbyList => {
        console.log('lobbies: ', lobbyList);
        if (lobbyList) {
          return Object.keys(lobbyList).map(key => (lobbyList[key]) as Lobby);
        } else {
          return [];
        }
      })
    );

    combineLatest(this.io.fromEvent('connect'), this.auth.userAuth)
    .subscribe(([_res, username]) => {
      console.log('WTF', username);
      if (username) {
        this.io.emit('setUser', username);
      }
    })
  }

  setUser() {
    if (this.auth.username) {
      console.log('what');
      this.io.emit('setUser', this.auth.username);
    }
  }

  createRoom(name: string) {
    this.io.emit('createRoom', name);
  }

  joinRoom(id: string) {
    this.io.emit('joinRoom', id);
  }
}
