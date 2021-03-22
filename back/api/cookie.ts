import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import CookieService from '../services/cookie';
import { Logger } from 'winston';
const route = Router();

export default (app: Router) => {
  app.use('/', route);
  route.get(
    '/qrcode',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        if (req) {
          const cookieService = Container.get(CookieService);
          const { qrurl } = await cookieService.getQrUrl();
          return res.send({ code: 200, qrcode: qrurl });
        } else {
          return res.send({ code: 1, msg: 'loginFaild' });
        }
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.get(
    '/cookies',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const cookieService = Container.get(CookieService);
        const data = await cookieService.getCookies();
        return res.send({ code: 200, data });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.get(
    '/cookie',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const cookieService = Container.get(CookieService);
        const data = await cookieService.addQrCookie(
          req.query.cookie as string,
        );
        return res.send({ code: 200, data });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.post(
    '/cookie',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const cookieService = Container.get(CookieService);
        const data = await cookieService.addCookie(req.body.cookies);
        if (data) {
          return res.send({ code: 400, data });
        } else {
          return res.send({ code: 200, data: '新建成功' });
        }
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.put(
    '/cookie',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const cookieService = Container.get(CookieService);
        const data = await cookieService.updateCookie(req.body);
        if (data) {
          return res.send({ code: 400, data });
        } else {
          return res.send({ code: 200, data: '新建成功' });
        }
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.delete(
    '/cookie',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const cookieService = Container.get(CookieService);
        const data = await cookieService.deleteCookie(
          req.body.cookie as string,
        );
        if (data) {
          return res.send({ code: 400, data });
        } else {
          return res.send({ code: 200, data: '新建成功' });
        }
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.post(
    '/cookie/refresh',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const cookieService = Container.get(CookieService);
        const data = await cookieService.refreshCookie(req.body);
        return res.send({ code: 200, data });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
