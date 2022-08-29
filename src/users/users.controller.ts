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
import { IUserService } from './users.service.interface';
import { HTTPError } from '../errors/http-error.class';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserService) private userService: IUserService,
	) {
		super(loggerService);

		const routes: IControllerRoute[] = [
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		];

		this.bindRoutes(routes);
	}

	public async info(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const user = await this.userService.getUserInfo(req.user);
		this.ok(res, {
			id: user?.id,
			email: user?.email,
		});
	}

	public async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);
		if (!result) {
			return next(new HTTPError(401, 'Ошибка авторизации', 'users:login'));
		}
		const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));

		this.ok(res, {
			token: jwt,
		});
	}

	public async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует!', 'users:register'));
		}
		this.ok(res, { email: result.email, name: result.name, id: result.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
