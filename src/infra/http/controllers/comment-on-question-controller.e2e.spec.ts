import request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/databbase.module';
import { StudentFactory } from 'test/forum/factories/make-student';
import { QuestionFactory } from 'test/forum/factories/make-question';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Comment on question (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);

		await app.init();
	});

	test('[POST] /questions/:questionId/comments', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const questionId = question.id.toString();

		const response = await request(app.getHttpServer()).post(`/questions/${questionId}/comments`).set('Authorization', `Bearer ${accessToken}`).send({
			content: 'New comment',
		});

		const commentOnDatabase = await prisma.comment.findFirst({
			where: {
				content: 'New comment',
			},
		});

		expect(response.statusCode).toBe(201);
		expect(commentOnDatabase).toBeTruthy();
	});
});
