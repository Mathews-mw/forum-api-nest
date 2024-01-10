import request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/databbase.module';
import { StudentFactory } from 'test/forum/factories/make-student';
import { QuestionFactory } from 'test/forum/factories/make-question';
import { QuestionCommentFactory } from 'test/forum/factories/make-question-comments';

describe('fetch question comments (E2E)', () => {
	let app: INestApplication;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let questionCommentFactory: QuestionCommentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [QuestionFactory, StudentFactory, QuestionCommentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		questionCommentFactory = moduleRef.get(QuestionCommentFactory);

		await app.init();
	});

	test('[GET] /questions/:questionId/comments', async () => {
		const user = await studentFactory.makePrismaStudent({
			name: 'John Doe',
		});

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		await Promise.all([
			questionCommentFactory.makePrismaQuestion({ authorId: user.id, questionId: question.id, content: 'Comment 01' }),
			questionCommentFactory.makePrismaQuestion({ authorId: user.id, questionId: question.id, content: 'Comment 02' }),
		]);

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id.toString()}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			comments: expect.arrayContaining([
				expect.objectContaining({ content: 'Comment 01', authorName: 'John Doe' }),
				expect.objectContaining({ content: 'Comment 02', authorName: 'John Doe' }),
			]),
		});
	});
});
