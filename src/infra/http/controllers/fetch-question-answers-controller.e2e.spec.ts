import request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/databbase.module';
import { StudentFactory } from 'test/forum/factories/make-student';
import { QuestionFactory } from 'test/forum/factories/make-question';
import { AnswerFactory } from 'test/forum/factories/make-answer';

describe('fetch question answers (E2E)', () => {
	let app: INestApplication;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [QuestionFactory, StudentFactory, AnswerFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);

		await app.init();
	});

	test('[GET] /questions/:questionId/answers', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		await Promise.all([
			answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id, content: 'Answer 01' }),
			answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id, content: 'Answer 02' }),
		]);

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id.toString()}/answers`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			answers: expect.arrayContaining([expect.objectContaining({ content: 'Answer 01' }), expect.objectContaining({ content: 'Answer 02' })]),
		});
	});
});
