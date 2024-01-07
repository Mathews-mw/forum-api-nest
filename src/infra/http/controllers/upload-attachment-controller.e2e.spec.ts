import request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { StudentFactory } from 'test/forum/factories/make-student';
import { DatabaseModule } from '@/infra/database/databbase.module';

describe('Upload attachment (E2E)', () => {
	let app: INestApplication;
	let jwt: JwtService;
	let studentFactory: StudentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);

		await app.init();
	});

	test('[POST] /attachments', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const response = await request(app.getHttpServer())
			.post('/attachments')
			.set('Authorization', `Bearer ${accessToken}`)
			.attach('file', './test/tmp/sample-upload.png');

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			attachmentId: expect.any(String),
		});
	});
});
