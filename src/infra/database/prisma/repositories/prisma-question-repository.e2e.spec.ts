import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { CacheModule } from '@/infra/cache/cache.module';
import { ICacheRepository } from '@/infra/cache/ICacheRepository';
import { StudentFactory } from 'test/forum/factories/make-student';
import { DatabaseModule } from '@/infra/database/databbase.module';
import { QuestionFactory } from 'test/forum/factories/make-question';
import { AttachmentFactory } from 'test/forum/factories/make-attachment';
import { QuestionAttachmentFactory } from 'test/forum/factories/make-question-attachment';
import { IQuestionRepository } from '@/domain/forum/application/repositories/implementations/IQuestionRepository';

describe('Prisma Question Repository (E2E)', () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let attachmentFactory: AttachmentFactory;
	let questionAttachmentFactory: QuestionAttachmentFactory;
	let cacheRepository: ICacheRepository;
	let questionRepository: IQuestionRepository;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule, CacheModule],
			providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
		cacheRepository = moduleRef.get(ICacheRepository);
		questionRepository = moduleRef.get(IQuestionRepository);

		await app.init();
	});

	it('should cache question details', async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const attachment = await attachmentFactory.makePrismaAttachment();

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			questionId: question.id,
			attachmentId: attachment.id,
		});

		const slug = question.slug.value;

		const questionDetails = await questionRepository.findBySlug(slug);

		const cached = await cacheRepository.get(`question:${slug}:details`);

		expect(cached).toEqual(JSON.stringify(questionDetails));
	});

	it('should return cached question details on subsequent calls', async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const attachment = await attachmentFactory.makePrismaAttachment();

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			questionId: question.id,
			attachmentId: attachment.id,
		});

		const slug = question.slug.value;

		await cacheRepository.set(`question:${slug}:details`, JSON.stringify({ content: 'some cotent' }));

		const questionDetails = await questionRepository.findBySlug(slug);

		expect(questionDetails).toEqual({ content: 'some cotent' });
	});

	it('should reset question details cache when saving the question', async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const attachment = await attachmentFactory.makePrismaAttachment();

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			questionId: question.id,
			attachmentId: attachment.id,
		});

		const slug = question.slug.value;

		await cacheRepository.set(`question:${slug}:details`, JSON.stringify({ content: 'some cotent' }));

		await questionRepository.save(question);

		const cached = await cacheRepository.get(`question:${slug}:details`);

		expect(cached).toBeNull();
	});
});
