import { makeQuestion } from '../factories/make-question';
import { InMemoryQuestionRepository } from '../in-memory/in-memory-question-repository';
import { InMemoryQestionAttachmentsRepository } from '../in-memory/in-memory-question-attachments-repository';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions-use-case';

let questionRepository: InMemoryQuestionRepository;
let fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase;
let questionAttachmentsRepository: InMemoryQestionAttachmentsRepository;

describe('Fetch Recente Questions', () => {
	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQestionAttachmentsRepository();
		questionRepository = new InMemoryQuestionRepository(questionAttachmentsRepository);
		fetchRecentQuestionsUseCase = new FetchRecentQuestionsUseCase(questionRepository);
	});

	it('Should be able to fetch recent questions', async () => {
		await questionRepository.create(makeQuestion({ createdAt: new Date(2023, 2, 10) }));
		await questionRepository.create(makeQuestion({ createdAt: new Date(2023, 2, 11) }));
		await questionRepository.create(makeQuestion({ createdAt: new Date(2023, 2, 14) }));

		const result = await fetchRecentQuestionsUseCase.execute({ page: 1 });

		expect(result).toEqual([
			expect.objectContaining({ createdAt: new Date(2023, 2, 10) }),
			expect.objectContaining({ createdAt: new Date(2023, 2, 11) }),
			expect.objectContaining({ createdAt: new Date(2023, 2, 14) }),
		]);
	});

	it('Should be able to fetch paginate recent questions', async () => {
		for (let i = 1; i <= 22; i++) {
			await questionRepository.create(makeQuestion());
		}

		const result = await fetchRecentQuestionsUseCase.execute({ page: 2 });

		expect(result.value?.questions).toHaveLength(2);
	});
});
