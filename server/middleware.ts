import { Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

import { Request } from './types';
import config from './config';

export const requestAuthMiddleware: any = (req: Request<any>, res: Response, next: NextFunction) => {
  const accessToken = req.body.token || req.query.token || req.headers['x-access-token'];
  if (accessToken) {
    jwt.verify(accessToken, config.accessSecret, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ error: true, code: 'EXP_TOK', message: 'Token has expired.' });
      }
      req.uid = decoded.uid;
      next();
    });
  } else {
    return res.status(401).send({ error: true, code: 'NO_TOK',  message: 'No token provided.' });
  }
}

export const socketNoAuthCheck: any = (accessToken: string, next: any) => {
  if (accessToken) {
    jwt.verify(accessToken, config.accessSecret, (err: any, decoded: any) => {
      if (err) {
        const error: any = new Error('authentication error');
        error.data = { type: 'access_token_expired' }
        return error;
      } else {
        return undefined;
      }
    });
  } else {
    const error: any = new Error('authentication error');
    error.data = { type: 'missing_access_token' }
    return error;
  }
}
