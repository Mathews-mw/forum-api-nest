import request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { AnswerFactory } from 'test/forum/factories/make-answer';
import { DatabaseModule } from '@/infra/database/databbase.module';
import { StudentFactory } from 'test/forum/factories/make-student';
import { QuestionFactory } from 'test/forum/factories/make-question';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { QuestionCommentFactory } from 'test/forum/factories/make-question-comments';
import { AnswerCommentFactory } from 'test/forum/factories/make-answer-comments';

describe('Delete answer comment (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;

	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let questioncommentFactory: QuestionCommentFactory;
	let answerFactory: AnswerFactory;
	let answerCommentFactory: AnswerCommentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AnswerFactory, AnswerCommentFactory, AnswerFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		questioncommentFactory = moduleRef.get(QuestionCommentFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		answerCommentFactory = moduleRef.get(AnswerCommentFactory);

		await app.init();
	});

	test('[DELETE] /answers/comments/:id', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const answerComment = await answerCommentFactory.makePrismaAnswer({
			authorId: user.id,
			answerId: answer.id,
		});

		const response = await request(app.getHttpServer())
			.delete(`/answers/comments/${answerComment.id.toString()}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		const commentOnDatabase = await prisma.comment.findUnique({
			where: {
				id: answerComment.id.toString(),
			},
		});

		expect(response.statusCode).toBe(204);
		expect(commentOnDatabase).toBeNull();
	});
});
