import request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';

import { waitFor } from 'test/utils/wait-for';
import { AppModule } from '@/infra/app.module';
import { DomainEvents } from '@/core/events/domain-events';
import { AnswerFactory } from 'test/forum/factories/make-answer';
import { DatabaseModule } from '@/infra/database/databbase.module';
import { StudentFactory } from 'test/forum/factories/make-student';
import { QuestionFactory } from 'test/forum/factories/make-question';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('On question best answer chosen (E2E)', () => {
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

		DomainEvents.shouldRun = false;

		await app.init();
	});

	it('Should send a notification when best answer is chosen', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		await request(app.getHttpServer()).put(`/answers/${answer.id.toString()}/choose-as-best`).set('Authorization', `Bearer ${accessToken}`).send();

		await waitFor(async () => {
			const notificationOnDataBase = await prisma.notification.findFirst({
				where: {
					recipientId: user.id.toString(),
				},
			});

			expect(notificationOnDataBase).not.toBeNull();
		});
	});
});
