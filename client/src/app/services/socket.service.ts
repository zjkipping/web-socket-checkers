import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { LobbyList, Lobby } from '../types';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  onDestroy = new Subscription();
  inLobby = false;
  lobbies: Observable<Lobby[]>;

  constructor(private io: Socket, private auth: AuthService, private router: Router) {
    this.lobbies = this.io.fromEvent<LobbyList>('lobbyList').pipe(
      map(lobbyList => {
        if (lobbyList) {
          return Object.keys(lobbyList).map(key => (lobbyList[key]) as Lobby);
        } else {
          return [];
        }
      }),
      tap(lobbies => console.log(lobbies))
    );

    this.onDestroy.add(this.io.fromEvent('apiError').subscribe((err: any) => {
      console.log(err);
      if (err.type === 'access_token_expired' || err.type === 'missing_access_token') {
        this.auth.logoutUser();
      }
    }));

    this.onDestroy.add(this.io.fromEvent<Lobby>('lobbyJoined').subscribe((lobby: Lobby) => {
      console.log('Lobby Created!');
      this.router.navigate(['/lobby']);
      this.inLobby = true;
    }));

    this.onDestroy.add(this.io.fromEvent('lobbyClosed').subscribe(() => {
      console.log('Lobby Closed!');
      this.router.navigate(['/lobbies']);
      this.inLobby = false;
    }))

    this.onDestroy.add(combineLatest(this.io.fromEvent('connect'), this.auth.userAuth).subscribe(([_res, userAuth]) => {
      if (userAuth) {
        this.io.emit('setAccessToken', userAuth.accessToken);
      }
    }));
  }

  ngOnDestroy() {
    this.onDestroy.unsubscribe();
  }

  createLobby(name: string) {
    this.io.emit('createLobby', name);
  }

  joinLobby(id: string) {
    this.io.emit('joinLobby', id);
  }

  async leaveLobby() {
    const success = await this.router.navigate(['lobbies']);
    if (success) {
      this.io.emit('leaveLobby');
    }
  }
}
