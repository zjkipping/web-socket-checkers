import { Component } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { SocketService } from '../services/socket.service';
import { Observable } from 'rxjs';
import { Lobby } from '../types';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent{
  roomName: FormControl;
  username: FormControl;
  lobbies: Observable<Lobby[]>;

  constructor(fb: FormBuilder, private socket: SocketService, private auth: AuthService) {
    this.roomName = fb.control('room#1', Validators.required);
    this.username = fb.control('Outis', Validators.required);
    this.lobbies = this.socket.lobbies;
  }

  login() {
    this.auth.login(this.username.value);
  }

  createRoom() {
    this.socket.createRoom(this.roomName.value);
  }

  joinRoom(id: string) {
    this.socket.joinRoom(id);
  }
}
