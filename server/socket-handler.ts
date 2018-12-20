import { Server, Socket } from 'socket.io';
import moment from 'moment';
import jwt from 'jsonwebtoken';

import { LobbyList, UserList, Lobby, User, Database } from './types';
import { socketNoAuthCheck } from './middleware';

export default async (io: Server, socket: Socket, db: Database, lobbies: LobbyList, users: UserList) => {
  console.dir('connection created: ' + socket.id);
  users[socket.id] = {} as User;

  socket.on('setAccessToken', async (accessToken: string) => {
    const uid = (await jwt.decode(accessToken) as any)['uid'] as number;
    try {
      const [res] = await db.execute('SELECT username FROM User WHERE id = ?', [uid]);
      const username = res[0].username;
      if (!users[socket.id].accessToken) {
        socket.emit('lobbyList', lobbies);
      }
      users[socket.id] = {
        id: socket.id,
        lobbyID: undefined,
        accessToken,
        uid,
        username
      }
    } catch (error) {
      socket.emit('error', error);
    }
    console.dir(socket.id + ' logged in as ' + users[socket.id].username);
  });

  socket.on('createRoom', async (name: string) => {
    const error = socketNoAuthCheck(users[socket.id]);
    if (error) {
      socket.emit('error', error);
    }

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
    socket.emit('lobbyJoined', lobbies[id]);
    console.dir('lobby ' + newLobby.name + ' created by ' + users[socket.id].username);
  });

  socket.on('joinRoom', async (id: string) => {
    const error = socketNoAuthCheck(users[socket.id]);
    if (error) {
      socket.emit('error', error);
    }

    const user = users[socket.id];
    if (lobbies[id]) {
      user.lobbyID = id;
      socket.join(id);
      socket.emit('lobbyJoined');
    }
  })

  socket.on('disconnect', async () => {
    let username = socket.id;
    if (users[socket.id]) {
      username = users[socket.id].username;
      console.dir(username + ' has disconnected');
      const lobbyID = users[socket.id].lobbyID;
      if (lobbyID) {
        socket.leave(lobbyID);
        if (lobbies[lobbyID].owner === username) {
          io.sockets.in(lobbyID).clients((_error: any, socketIds: string[]) => {
            socketIds.forEach(socketId => {
              users[socketId].lobbyID = undefined;
              io.sockets.sockets[socketId].leave(lobbyID);
              io.sockets.sockets[socketId].emit('lobbyClosed');
              console.dir('lobby ' + lobbyID + ' was closed due to owner disconnection');
            });
          })
          delete lobbies[lobbyID];
        }
      }
      delete users[socket.id];
    }
  });
}
