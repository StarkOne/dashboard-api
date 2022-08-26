import { injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dt';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './users.service.interface';

@injectable()
export class UserService implements IUserService {
	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password);

		return newUser;
	}
	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		return true;
	}
}
