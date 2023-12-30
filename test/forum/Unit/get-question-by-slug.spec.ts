import { makeQuestion } from '../factories/make-question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { InMemoryQuestionRepository } from '../in-memory/in-memory-question-repository';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { InMemoryQestionAttachmentsRepository } from '../in-memory/in-memory-question-attachments-repository';

let questionRepository: InMemoryQuestionRepository;
let getQuestionBySlugUseCase: GetQuestionBySlugUseCase;
let questionAttachmentsRepository: InMemoryQestionAttachmentsRepository;

describe('Get Question by Slug', () => {
	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQestionAttachmentsRepository();
		questionRepository = new InMemoryQuestionRepository(questionAttachmentsRepository);
		getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(questionRepository);
	});

	it('Should be able to get a question by slug', async () => {
		const newQuestion = makeQuestion({ slug: Slug.create('example-question') });

		await questionRepository.create(newQuestion);

		const result = await getQuestionBySlugUseCase.execute({ slug: 'example-question' });

		expect(result.value).toMatchObject({
			question: expect.objectContaining({
				title: newQuestion.title,
			}),
		});
	});
});
