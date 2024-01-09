import request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/databbase.module';
import { StudentFactory } from 'test/forum/factories/make-student';
import { QuestionFactory } from 'test/forum/factories/make-question';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AttachmentFactory } from 'test/forum/factories/make-attachment';
import { QuestionAttachmentFactory } from 'test/forum/factories/make-question-attachment';

describe('Edit question (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let attachmentFactory: AttachmentFactory;
	let questionAttachmentFactory: QuestionAttachmentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

		await app.init();
	});

	test('[PUT] /questions/:id', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const attachment1 = await attachmentFactory.makePrismaAttachment();
		const attachment2 = await attachmentFactory.makePrismaAttachment();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			questionId: question.id,
			attachmentId: attachment1.id,
		});

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			questionId: question.id,
			attachmentId: attachment2.id,
		});

		const attachment3 = await attachmentFactory.makePrismaAttachment();

		const questionId = question.id.toString();

		const response = await request(app.getHttpServer())
			.put(`/questions/${questionId}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'New question',
				content: 'Question content',
				attachments: [attachment1.id.toString(), attachment3.id.toString()],
			});

		const questionOnDatabase = await prisma.question.findFirst({
			where: {
				title: 'New question',
				content: 'Question content',
			},
		});

		expect(response.statusCode).toBe(204);
		expect(questionOnDatabase).toBeTruthy();

		const attachmentsOnDatabase = await prisma.attachment.findMany({
			where: {
				questionId: questionOnDatabase?.id,
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
