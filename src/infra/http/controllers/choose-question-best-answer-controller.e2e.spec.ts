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

describe('Choose question best answer (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [AnswerFactory, StudentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);

		await app.init();
	});

	test('[PATCH] /answers/:answerId/choose-as-best', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const response = await request(app.getHttpServer())
			.put(`/answers/${answer.id.toString()}/choose-as-best`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		const questionOnDatabase = await prisma.question.findUnique({
			where: {
				id: question.id.toString(),
			},
		});

		expect(response.statusCode).toBe(201);
		expect(questionOnDatabase).toEqual(answer.id.toString());
	});
});
