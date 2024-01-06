import request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/databbase.module';
import { StudentFactory } from 'test/forum/factories/make-student';
import { QuestionFactory } from 'test/forum/factories/make-question';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AnswerFactory } from 'test/forum/factories/make-answer';
import { QuestionCommentFactory } from 'test/forum/factories/make-question-comments';

describe('Delete question comment (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let questioncommentFactory: QuestionCommentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule, AnswerFactory],
			providers: [StudentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		questioncommentFactory = moduleRef.get(QuestionCommentFactory);

		await app.init();
	});

	test('[DELETE] /questions/comments/:id', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const questionComment = await questioncommentFactory.makePrismaQuestion({
			authorId: user.id,
			questionId: question.id,
		});

		const response = await request(app.getHttpServer())
			.delete(`/questions/comments/${questionComment.id.toString()}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		const commentOnDatabase = await prisma.comment.findUnique({
			where: {
				id: questionComment.id.toString(),
			},
		});

		expect(response.statusCode).toBe(204);
		expect(commentOnDatabase).toBeNull();
	});
});
