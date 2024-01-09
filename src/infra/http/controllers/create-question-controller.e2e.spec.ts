import request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/databbase.module';
import { StudentFactory } from 'test/forum/factories/make-student';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AttachmentFactory } from 'test/forum/factories/make-attachment';

describe('Create question (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let attachmentFactory: AttachmentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, AttachmentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);

		await app.init();
	});

	test('[POST] /questions', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const attachment1 = await attachmentFactory.makePrismaAttachment();
		const attachment2 = await attachmentFactory.makePrismaAttachment();

		const response = await request(app.getHttpServer())
			.post('/questions')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'New question',
				content: 'Question content',
				attachments: [attachment1.id.toString(), attachment2.id.toString()],
			});

		const questionOnDatabase = await prisma.question.findFirst({
			where: {
				title: 'New question',
			},
		});

		expect(response.statusCode).toBe(201);

		const attachmentsOnDatabase = await prisma.attachment.findMany({
			where: {
				questionId: questionOnDatabase?.id,
			},
		});

		expect(attachmentsOnDatabase).toHaveLength(2);
	});
});
