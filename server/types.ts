import { Request } from 'express';
import { Server } from 'socket.io';

export interface Request extends Request {
  io: Server;
  lobbies: LobbyList;
  users: UserList;
}

export interface LobbyList {
  [key: string]: Lobby;
}

export interface Lobby {
  id: string; // also the socket room name
  name: string; // display name to users
  owner: string;
  created: number;
}

export interface UserList {
  [key: string]: User;
}

export interface User {
  username: string;
  lobbyID: string;
}

export interface ChatMessage {
  username: string;
  timestamp: number;
  message: string;
}
