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

describe('Answer question (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let attachmentFactory: AttachmentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AttachmentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);

		await app.init();
	});

	test('[POST] /questions/:questionId/answers', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const questionId = question.id.toString();

		const attachment1 = await attachmentFactory.makePrismaAttachment();
		const attachment2 = await attachmentFactory.makePrismaAttachment();

		const response = await request(app.getHttpServer())
			.put(`/questions/${questionId}/answers`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				content: 'New answer content',
				attachments: [attachment1.id.toString(), attachment2.id.toString()],
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
				answerId: answerOnDatabase?.id,
			},
		});

		expect(attachmentsOnDatabase).toHaveLength(2);
	});
});
