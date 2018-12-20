import { Request } from 'express';
import { Server } from 'socket.io';
import { Pool } from 'generic-pool';

export interface Request<T> extends Request {
  uid: number;
  io: Server;
  db: Database;
  lobbies: LobbyList;
  users: UserList;
  body: T;
}

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

export interface GenericError {
  code: string;
  message: string;
}

export interface MYSQL_DB {
  execute: (query: string, values?: (string | number)[]) => Promise<any>,
  query: (query: string) => Promise<any[]>
}

export interface LobbyList {
  [key: string]: Lobby;
}

export interface Lobby {
  id: string;
  name: string;
  owner: string;
  created: number;
}

export interface UserList {
  [key: string]: User;
}

export interface User {
  id: string;
  uid: number;
  accessToken: string;
  username: string;
  lobbyID?: string;
}

export interface ChatMessage {
  username: string;
  timestamp: number;
  message: string;
}

export class Database {
  constructor(private pool: Pool<MYSQL_DB>) { }

  public async execute(query: string, values: (string | number)[]): Promise<any> {
    let conn: any;
    try {
      conn = await this.pool.acquire();
      const result = await conn.execute(query, values);
      await this.pool.release(conn);
      return result;
    } catch (error) {
      if(conn) await this.pool.destroy(conn);
      throw error;
    }
  }
}
