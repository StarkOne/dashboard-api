import { UserLoginDto } from './dto/user-login.dt';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<User | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
