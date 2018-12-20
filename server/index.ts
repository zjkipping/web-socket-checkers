import express, { Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import socket, { Socket } from 'socket.io';
import mysql2 from 'mysql2/promise';
import genericPool from 'generic-pool';

import config from './config';
import router from './router';
import { Request, LobbyList, UserList, Database, User } from './types';
import socketHandler from './socket-handler';

const app = express();
const server = http.createServer(app);
const io = socket(server);
const port = process.env.PORT || config.port || 8080;

const poolDB = genericPool.createPool({
    create : () => mysql2.createConnection(config.dbCredentials),
    destroy : (connection: any) => connection.end(),
    validate : (connection: any) => connection.query(`SELECT 1`).then(() => true, () => false)
  }, { max : 10, min : 0, testOnBorrow : true });

const db = new Database(poolDB);

const lobbies: LobbyList = {};
const users: UserList = {};

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const assignAppVariablesMiddleware: any = (req: Request<any>, _res: Response, next: NextFunction) => {
  req.io = io;
  req.db = db;
  req.lobbies = lobbies;
  req.users = users;
  next();
}

app.use(assignAppVariablesMiddleware);

app.get('/', async (_req, res) => res.status(200).send({}));

app.use('/api', router);

io.on('connection', (socket: Socket) => socketHandler(io, socket, db, lobbies, users));

server.listen(port, () => {
  console.log('Started Server On Port: ' + port);
});
