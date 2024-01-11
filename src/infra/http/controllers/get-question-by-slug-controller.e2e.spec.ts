import request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { StudentFactory } from 'test/forum/factories/make-student';
import { DatabaseModule } from '@/infra/database/databbase.module';
import { QuestionFactory } from 'test/forum/factories/make-question';
import { AttachmentFactory } from 'test/forum/factories/make-attachment';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { QuestionAttachmentFactory } from 'test/forum/factories/make-question-attachment';

describe('Get question by slug (E2E)', () => {
	let app: INestApplication;
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
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

		await app.init();
	});

	test('[GET] /questions/:slug', async () => {
		const user = await studentFactory.makePrismaStudent({
			name: 'John Doe',
		});

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: 'Question 01',
			slug: Slug.create('question-01'),
		});

		const attachment = await attachmentFactory.makePrismaAttachment({ title: 'attachment-1' });

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			questionId: question.id,
			attachmentId: attachment.id,
		});

		const response = await request(app.getHttpServer()).get('/questions/question-01').set('Authorization', `Bearer ${accessToken}`).send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			question: expect.objectContaining({ title: 'Question 01', author: 'John Doe', attachments: [expect.objectContaining({ title: 'attachment-1' })] }),
		});
	});
});
