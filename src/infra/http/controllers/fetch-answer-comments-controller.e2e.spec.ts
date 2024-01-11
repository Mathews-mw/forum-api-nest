import request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { AnswerFactory } from 'test/forum/factories/make-answer';
import { DatabaseModule } from '@/infra/database/databbase.module';
import { StudentFactory } from 'test/forum/factories/make-student';
import { QuestionFactory } from 'test/forum/factories/make-question';
import { AnswerCommentFactory } from 'test/forum/factories/make-answer-comments';

describe('fetch answer comments (E2E)', () => {
	let app: INestApplication;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;
	let answerCommentFactory: AnswerCommentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [QuestionFactory, StudentFactory, AnswerFactory, AnswerCommentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		answerCommentFactory = moduleRef.get(AnswerCommentFactory);

		await app.init();
	});

	test('[GET] /answers/:answerId/comments', async () => {
		const user = await studentFactory.makePrismaStudent({
			name: 'John Doe',
		});

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		await Promise.all([
			answerCommentFactory.makePrismaAnswer({ authorId: user.id, answerId: answer.id, content: 'Comment 01' }),
			answerCommentFactory.makePrismaAnswer({ authorId: user.id, answerId: answer.id, content: 'Comment 02' }),
		]);

		const response = await request(app.getHttpServer()).get(`/answers/${question.id.toString()}/comments`).set('Authorization', `Bearer ${accessToken}`).send();

		expect(response.statusCode).toBe(200);

		expect(response.body).toEqual({
			comments: expect.arrayContaining([
				expect.objectContaining({ content: 'Comment 01', authorName: 'John Doe' }),
				expect.objectContaining({ content: 'Comment 02', authorName: 'John Doe' }),
			]),
		});
	});
});
