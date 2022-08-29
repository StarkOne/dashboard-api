import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface';

export class AuthGuard implements IMiddleware {
	execute({ user }: Request, res: Response, next: NextFunction): void {
		if (user) {
			return next();
		} else {
			res.status(401).json({
				error: 'Доступ запрещен!',
			});
		}
	}
}
