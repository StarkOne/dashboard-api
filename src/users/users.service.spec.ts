import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../type';
import { User } from './user.entity';
import { IUserRepository } from './users.repository.interface';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUserRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUserRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUserRepository>(TYPES.UsersRepositiry).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUserRepository>(TYPES.UsersRepositiry);
	userService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);

		createdUser = await userService.createUser({
			email: 'test@test.ru',
			name: 'Vlad',
			password: '1',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validateUser - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const validate = await userService.validateUser({
			email: 'test@test.ru',
			password: '1',
		});

		expect(validate).toBeTruthy();
	});

	it('validateUser - bad', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const notValidate = await userService.validateUser({
			email: 'test123@test.ru',
			password: '213',
		});

		expect(notValidate).toBeFalsy();
	});

	it('validateUser - bad email', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);

		const invalidEmail = await userService.validateUser({
			email: '123123213@test.ru',
			password: '213',
		});

		expect(invalidEmail).toBeFalsy();
	});
});
