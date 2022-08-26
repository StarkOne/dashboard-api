import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { IControllerRoute } from '../common/router.interface';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../type';
import { IUserController } from './users.interface';
import { UserLoginDto } from './dto/user-login.dt';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';

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

	public login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(req.body);
		this.ok(res, 'login');
		// next(new HTTPError(401, 'ошибка авторизации', 'login'));
	}

	public async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const newUser = new User(body.email, body.name);
		await newUser.setPassword(body.password);
		console.log(newUser);

		this.ok(res, 'register');
	}
}
