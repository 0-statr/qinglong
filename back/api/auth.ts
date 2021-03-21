import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';
import * as fs from 'fs';
import config from '../config';
import jwt from 'jsonwebtoken';
const route = Router();

export default (app: Router) => {
  app.use('/', route);
  route.post(
    '/auth',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        let username = req.body.username;
        let password = req.body.password;
        fs.readFile(config.authConfigFile, 'utf8', function (err, data) {
          if (err) console.log(err);
          var con = JSON.parse(data);
          if (username && password) {
            if (username == con.user && password == con.password) {
              let token = jwt.sign(
                { username, password },
                config.secret as any,
                { expiresIn: 60 * 60 * 24 * 7, algorithm: 'HS384' },
              );
              res.send({ code: 200, token });
            } else {
              res.send({ code: 400, msg: config.authError });
            }
          } else {
            res.send({ err: 400, msg: '请输入用户名密码!' });
          }
        });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.post(
    '/user',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        fs.writeFile(config.authConfigFile, JSON.stringify(req.body), (err) => {
          if (err) console.log(err);
          res.send({ code: 200, msg: '更新成功' });
        });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
