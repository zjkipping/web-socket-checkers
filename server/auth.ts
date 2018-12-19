import bcyrpt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

import config from './config';
import { Request } from './types';

export const login = async (req: Request, res: Response) => {
  
}

export const register = async (req: Request, res: Response) => {
  try {
    const hashedPassword = bcyrpt.hashSync(req.body.password, config.saltRounds);
  } catch {

  }
}
