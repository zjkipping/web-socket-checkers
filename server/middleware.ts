import { Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import { Request } from './types';
import config from './config';

export const requestAuthMiddleware: any = async (req: Request<any>, res: Response, next: NextFunction) => {
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

export const socketNoAuthCheck: any = async (accessToken: string) => {
  if (accessToken) {
    try {
      await promisify(jwt.verify)(accessToken, config.accessSecret);
      return undefined;
    } catch (err) {
      return { type: 'access_token_expired' };
    }
  } else {
    return { type: 'missing_access_token' };
  }
}
