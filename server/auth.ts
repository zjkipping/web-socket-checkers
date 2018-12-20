import bcyrpt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Response } from 'express'; 

import config from './config';
import { nullPropertiesCheck } from './util';
import { Request, RegisterRequestBody, LoginRequestBody } from './types';

export const login: any = async (req: Request<LoginRequestBody>, res: Response) => {
  const null_error = nullPropertiesCheck(req.body, ['username', 'password']);
  if (null_error) {
    res.status(400).send(null_error);
  }

  try {
    const [rows] = await req.db.execute('SELECT id, password from `User` where username = ?', [req.body.username]);
    if (rows.length === 0) {
      res.status(400).send({ error: true, code: 'NO_RESULT', message: 'No such user that matches given username & password' });
    } else {
      const uid = rows[0].id;
      const password = rows[0].password;
      const valid = await bcrypt.compareSync(req.body.password, password);
      if (valid) {
        const accessToken = jwt.sign({ uid } , config.accessSecret, { expiresIn: config.accessLife});
        res.status(200).send({ accessToken });
      } else {
        res.status(400).send({ error: true, code: 'NO_RESULT', message: 'No such user that matches given username & password' });
      }
    }
  } catch (err) {
    res.status(500).send({ error: true, code: err.code, message: err.message });
  }

}

export const register: any = async (req: Request<RegisterRequestBody>, res: Response) => {
  const null_error = nullPropertiesCheck(req.body, ['username', 'password', 'email']);
  if (null_error) {
    res.status(400).send(null_error);
  }

  try {
    const hashedPassword = await bcyrpt.hashSync(req.body.password, config.saltRounds);

    await req.db.execute(
      'INSERT INTO User (username, password, email, created) VALUES (?, ?, ?, UNIX_TIMESTAMP())',
      [req.body.username, hashedPassword, req.body.email]
    );
    res.status(200).send();
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      if (err.message.includes('email')) {
        res.status(400).send({ error: true, code: 'DUP_EMAIL', message: 'That email already exists.' });
      } else if (err.message.includes('username')) {
        res.status(400).send({ error: true, code: 'DUP_NAME', message: 'That username already exists.' });
      } else {
        res.status(400).send({ error: true, code: 'DUP_VALUE', message: err.message });
      }
    } else {
      res.status(500).send({ error: true, code: err.code, message: err.message });
    }
  }
}
