import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { IControllerRoute } from '../common/router.interface';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../type';
import { IUserController } from './users.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
    super(loggerService);

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
