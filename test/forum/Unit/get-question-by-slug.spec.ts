import { makeQuestion } from '../factories/make-question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { InMemoryQuestionRepository } from '../in-memory/in-memory-question-repository';
import { InMemoryStudentsRepository } from '../in-memory/in-memory-students-repository';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { InMemoryAttachmentsRepository } from '../in-memory/in-memmory-attachments-repository';
import { InMemoryQestionAttachmentsRepository } from '../in-memory/in-memory-question-attachments-repository';
import { makeStudent } from '../factories/make-student';
import { makeAttachment } from '../factories/make-attachment';
import { makeQuestionAttachment } from '../factories/make-question-attachment';

let questionRepository: InMemoryQuestionRepository;
let studentsRepository: InMemoryStudentsRepository;
let attachmentsRepository: InMemoryAttachmentsRepository;
let getQuestionBySlugUseCase: GetQuestionBySlugUseCase;
let questionAttachmentsRepository: InMemoryQestionAttachmentsRepository;

describe('Get Question by Slug', () => {
	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQestionAttachmentsRepository();
		getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(questionRepository);
		studentsRepository = new InMemoryStudentsRepository();
		attachmentsRepository = new InMemoryAttachmentsRepository();
		questionRepository = new InMemoryQuestionRepository(questionAttachmentsRepository, attachmentsRepository, studentsRepository);
	});

	it('Should be able to get a question by slug', async () => {
		const student = makeStudent({ name: 'John Doe' });

		studentsRepository.items.push(student);

		const newQuestion = makeQuestion({ authorId: student.id, slug: Slug.create('example-question') });

		await questionRepository.create(newQuestion);

		const attachment = makeAttachment({ title: 'Attachment-1' });

		attachmentsRepository.items.push(attachment);

		questionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				attachmentId: attachment.id,
				questionId: newQuestion.id,
			})
		);

		const result = await getQuestionBySlugUseCase.execute({ slug: 'example-question' });

		expect(result.value).toMatchObject({
			question: expect.objectContaining({
				title: newQuestion.title,
				author: 'John Doe',
				attachments: [expect.objectContaining({ title: 'Attachment-1' })],
			}),
		});
	});
});
