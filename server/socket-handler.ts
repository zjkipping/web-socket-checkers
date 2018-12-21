import { Server, Socket } from 'socket.io';
import moment from 'moment';
import jwt from 'jsonwebtoken';

import { LobbyList, UserList, Lobby, User, Database } from './types';
import { socketNoAuthCheck } from './middleware';

export default async (io: Server, socket: Socket, db: Database, lobbies: LobbyList, users: UserList) => {
  console.dir('connection created: ' + socket.id);
  users[socket.id] = {} as User;

  socket.on('setAccessToken', async (accessToken: string) => {
    const error = await socketNoAuthCheck(accessToken);
    if (error) {
      socket.emit('apiError', error);
      return;
    }

    try {
      const uid = (await jwt.decode(accessToken) as any)['uid'] as number;
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
      console.dir(socket.id + ' logged in as ' + users[socket.id].username);
    } catch (error) {
      socket.emit('apiError', error);
    }
  });

  socket.on('createLobby', async (name: string) => {
    const error = await socketNoAuthCheck(users[socket.id].accessToken);
    if (error) {
      socket.emit('apiError', error);
      return;
    }

    const owner = users[socket.id].username;
    const id = name + '#' + owner;
    const newLobby: Lobby = {
      id,
      name,
      owner,
      created: moment().unix(),
      players: [users[socket.id]],
      spectators: [],
      status: 'in-lobby'
    };
    lobbies[id] = newLobby;
    socket.join(id);
    users[socket.id].lobbyID = id;
    io.emit('lobbyList', lobbies);
    socket.emit('lobbyJoined', lobbies[id]);
    console.dir('lobby ' + newLobby.name + ' created by ' + users[socket.id].username);
  });

  socket.on('joinLobby', async (id: string) => {
    const error = await socketNoAuthCheck(users[socket.id].accessToken);
    if (error) {
      socket.emit('apiError', error);
      return;
    }

    const user = users[socket.id];
    if (lobbies[id]) {
      user.lobbyID = id;
      socket.join(id);
      if (lobbies[id].players.length === 2) {
        lobbies[id].spectators.push(user);
      } else {
        lobbies[id].players.push(user);
      }
      socket.emit('lobbyJoined');
      console.dir(user.username + ' joined lobby ' + lobbies[id].name);
    } else {
      socket.emit('apiError', { type: 'nonexistant_lobby' })
    }
  });

  socket.on('leaveLobby', async () => {
    const error = await socketNoAuthCheck(users[socket.id].accessToken);
    if (error) {
      socket.emit('apiError', error);
      return;
    }

    const lobbyID = users[socket.id].lobbyID;
      if (lobbyID) {
        socket.leave(lobbyID);
        lobbies[lobbyID].players = lobbies[lobbyID].players.filter(player => player.id === socket.id);
        if (lobbies[lobbyID].owner === users[socket.id].username) {
          io.sockets.in(lobbyID).clients((_error: any, socketIds: string[]) => {
            socketIds.forEach(socketId => {
              users[socketId].lobbyID = undefined;
              io.sockets.sockets[socketId].leave(lobbyID);
              io.sockets.sockets[socketId].emit('lobbyClosed');
              console.dir('lobby ' + lobbyID + ' was closed due to owner leaving');
            });
          })
          delete lobbies[lobbyID];
          io.emit('lobbyList', lobbies);
        }
      } else {
        io.emit('apiError', { type: 'no_lobby' });
      }
  });

  socket.on('lobby/message', async (message: string) => {
    const error = await socketNoAuthCheck(users[socket.id].accessToken);
    if (error) {
      socket.emit('apiError', error);
      return;
    }

    if (users[socket.id].lobbyID) {
      let room = io.to(users[socket.id].lobbyID as string);
      if (room) {
        room.emit('lobby/chat', message);
      } else {
        socket.emit('apiError', { type: 'nonexistant_lobby' })
      }
    } else {
      socket.emit('apiError', { type: 'no_lobby' })
    }
  });

  socket.on('disconnect', async () => {
    let username = socket.id;
    if (users[socket.id]) {
      username = users[socket.id].username;
      console.dir(username + ' has disconnected');
      const lobbyID = users[socket.id].lobbyID;
      if (lobbyID) {
        socket.leave(lobbyID);
        lobbies[lobbyID].players = lobbies[lobbyID].players.filter(player => player.id === socket.id);
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
          io.emit('lobbyList', lobbies);
        }
      }
      delete users[socket.id];
    }
  });
}
