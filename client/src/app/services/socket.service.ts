import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { LobbyList, Lobby } from '../types';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  lobbies: Observable<Lobby[]>;
  inLobby = false;
  setAuthSubscription: Subscription;
  getErrorSubscription: Subscription;
  lobbyJoinedSubscription: Subscription;

  constructor(private io: Socket, private auth: AuthService, private router: Router) {
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

    this.getErrorSubscription = this.io.fromEvent('error').subscribe((err: any) => {
      console.log(err);
      if (err.type === 'access_token_expired' || err.type === 'missing_access_token') {
        this.auth.logoutUser();
      }
    });

    this.lobbyJoinedSubscription = this.io.fromEvent<Lobby>('lobbyJoined').subscribe((lobby: Lobby) => {
      console.log('Lobby Created!');
      this.router.navigate(['/lobby']);
      this.inLobby = true;
    });

    this.setAuthSubscription = combineLatest(this.io.fromEvent('connect'), this.auth.userAuth).subscribe(([_res, userAuth]) => {
      if (userAuth) {
        this.io.emit('setAccessToken', userAuth.accessToken);
      }
    });
  }

  ngOnDestroy() {
    this.getErrorSubscription.unsubscribe();
    this.setAuthSubscription.unsubscribe();
    this.lobbyJoinedSubscription.unsubscribe();
  }

  createRoom(name: string) {
    this.io.emit('createRoom', name);
  }

  joinRoom(id: string) {
    this.io.emit('joinRoom', id);
  }
}
