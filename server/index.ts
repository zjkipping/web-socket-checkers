import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import socket from 'socket.io';

import config from './config';
import router from './router';
import { Request, LobbyList, UserList } from './types';
import socketHandler from './socket-handler';

const app = express();
const server = http.createServer(app);
const io = socket(server);
const port = process.env.PORT || config.port || 8080;
const lobbies: LobbyList = {};
const users: UserList = {};

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req: Request, _res, next) => {
  req.io = io;
  req.lobbies = lobbies;
  req.users = users;
  next();
});

app.get('/', async (_req, res) => {
  return res.status(200).send({});
});

app.use('/api', router);

server.listen(port, () => {
  console.log('Started Server On Port: ' + port);
});

io.on('connection', socket => {
  socketHandler(io, socket, lobbies, users);
});
