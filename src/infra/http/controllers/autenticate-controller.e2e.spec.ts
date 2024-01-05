import request from 'supertest';
import { hash } from 'bcryptjs';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/databbase.module';
import { StudentFactory } from 'test/forum/factories/make-student';

describe('Authenticate user (E2E)', () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		studentFactory = moduleRef.get(StudentFactory);

		await app.init();
	});

	test('[POST] /sessions', async () => {
		await studentFactory.makePrismaStudent({
			email: 'johndoe@example.com',
			password: await hash('123456', 8),
		});

		const response = await request(app.getHttpServer()).post('/sessions').send({
			email: 'johndoe@example.com',
			password: '123456',
		});

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			access_token: expect.any(String),
		});
	});
});
