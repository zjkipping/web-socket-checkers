export interface LobbyList {
  [key: string]: Lobby;
}

export interface Lobby {
  id: string; // also the socket room name
  name: string; // display name to users
  owner: string;
  created: number;
}
