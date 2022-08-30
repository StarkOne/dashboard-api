import request from 'supertest';
import { App } from '../src/app';
import { boot } from '../src/main';

let application: App;
let token: string;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - err', async () => {
		const res = await request(application.app).post('/users/register').send({
			email: 'test1@test.ru',
			password: '123456',
			name: 'Vlad',
		});

		expect(res.statusCode).toBe(422);
	});

	it('Login - check token', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'test1@test.ru',
			password: '123456',
		});

		token = res.body.token;

		expect(res.body.token).not.toBeNull();
	});

	it('Login - err', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: '123123213@test.ru',
			password: '213123123',
		});

		expect(res.statusCode).toBe(401);
	});

	it('User - info', async () => {
		const res = await request(application.app).get('/users/info').auth(token, { type: 'bearer' });

		expect(res.statusCode).toBe(200);
		expect(res.body.id).toBe(2);
		expect(res.body.email).toBe('test1@test.ru');
	});

	it('User - bad info', async () => {
		const res = await request(application.app).get('/users/info');

		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
