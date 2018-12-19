import { Socket, Server } from 'socket.io';
import moment from 'moment';

import { LobbyList, UserList, Lobby } from './types';

export default (io: Server, socket: Socket, lobbies: LobbyList, users: UserList) => {
  console.dir('connection created: ' + socket.id);
  socket.on('setUser', (name: string) => {
    console.dir(socket.id + ' set their profile to ' + name);
    users[socket.id] = {
      lobbyID: undefined,
      username: name
    }
  });

  socket.on('createRoom', (name: string) => {
    const owner = users[socket.id].username;
    const id = name + '#' + owner;
    const newLobby: Lobby = {
      id,
      name,
      owner,
      created: moment().unix()
    };
    lobbies[id] = newLobby;
    socket.join(id);
    users[socket.id].lobbyID = id;
    io.emit('lobbyList', lobbies);
    console.dir('lobby ' + JSON.stringify(newLobby) + ' created by ' + users[socket.id].username);
  });

  socket.on('joinRoom', (id: string) => {
    const user = users[socket.id];
    if (lobbies[id]) {
      user.lobbyID = id;
      socket.join(id);
    }
  })

  socket.on('disconnect', () => {
    let username = socket.id;
    if (users[socket.id]) {
      username = users[socket.id].username;
      const lobbyID = users[socket.id].lobbyID;
      if (lobbyID) {
        socket.leave(lobbyID);
        if (lobbies[lobbyID].owner === username) {
          io.sockets.in(lobbyID).clients((_error: any, socketIds: string[]) => {
            socketIds.forEach(socketId => {
              users[socketId].lobbyID = undefined;
              io.sockets.sockets[socketId].leave(lobbyID);
              io.sockets.sockets[socketId].emit('lobbyClosed');
            });
          })
          delete lobbies[lobbyID];
        }
      }
    }
    console.dir(username + ' has disconnected');
  });

  socket.emit('lobbyList', lobbies);
}
