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
import { AttachmentFactory } from 'test/forum/factories/make-attachment';
import { AnswerAttachmentFactory } from 'test/forum/factories/make-answer-attachment';

describe('Edit answer (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;
	let attachmentFactory: AttachmentFactory;
	let answerAttachmentFactory: AnswerAttachmentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [AnswerFactory, StudentFactory, QuestionFactory, AttachmentFactory, AnswerAttachmentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);

		await app.init();
	});

	test('[PUT] /answers/:id', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const attachment1 = await attachmentFactory.makePrismaAttachment();
		const attachment2 = await attachmentFactory.makePrismaAttachment();

		await answerAttachmentFactory.makePrismaAnswerAttachment({
			answerId: answer.id,
			attachmentId: attachment1.id,
		});

		await answerAttachmentFactory.makePrismaAnswerAttachment({
			answerId: answer.id,
			attachmentId: attachment2.id,
		});

		const attachment3 = await attachmentFactory.makePrismaAttachment();

		const response = await request(app.getHttpServer())
			.put(`/answers/${answer.id.toString()}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				content: 'New answer content',
				attachments: [attachment1.id.toString(), attachment3.id.toString()],
			});

		const answerOnDatabase = await prisma.answer.findFirst({
			where: {
				content: 'New answer content',
			},
		});

		expect(response.statusCode).toBe(201);
		expect(answerOnDatabase).toBeTruthy();

		const attachmentsOnDatabase = await prisma.attachment.findMany({
			where: {
				questionId: answerOnDatabase?.id,
			},
		});

		expect(attachmentsOnDatabase).toHaveLength(2);
		expect(attachmentsOnDatabase).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: attachment1.id.toString(),
				}),
				expect.objectContaining({
					id: attachment3.id.toString(),
				}),
			])
		);
	});
});
