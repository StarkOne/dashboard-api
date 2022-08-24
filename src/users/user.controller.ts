import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { IControllerRoute } from '../common/router.interface';
import { HTTPError } from '../errors/http-error.class';
import { LoggerService } from '../logger/logger.service';

export class UserCotroller extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);

    const routes: IControllerRoute[] = [
      { path: '/login', method: 'post', func: this.login },
      { path: '/register', method: 'post', func: this.register },
    ];

    this.bindRoutes(routes);
  }

  public register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, 'register');
  }

  public login(req: Request, res: Response, next: NextFunction) {
    this.ok(res, 'login');
    // next(new HTTPError(401, 'ошибка авторизации', 'login'));
  }
}
