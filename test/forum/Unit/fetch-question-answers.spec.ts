import { makeAnswer } from '../factories/make-answer';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerRepository } from '../in-memory/in-memory-answer-repository';
import { InMemoryAnswerAttachmentsRepository } from '../in-memory/in-memory-answer-attachments-repository';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers-use-case';

let answerRepository: InMemoryAnswerRepository;
let fetchQuestionAnswersUsecase: FetchQuestionAnswersUseCase;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;

describe('Fetch Questions Answers', () => {
	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answerRepository = new InMemoryAnswerRepository(answerAttachmentsRepository);
		fetchQuestionAnswersUsecase = new FetchQuestionAnswersUseCase(answerRepository);
	});

	it('Should be able to fetch question answers', async () => {
		await answerRepository.create(makeAnswer({ questionId: new UniqueEntityId('question-1') }));
		await answerRepository.create(makeAnswer({ questionId: new UniqueEntityId('question-1') }));
		await answerRepository.create(makeAnswer({ questionId: new UniqueEntityId('question-1') }));

		const result = await fetchQuestionAnswersUsecase.execute({ questionId: 'question-1', page: 1 });

		expect(result.value?.answers).toHaveLength(3);
	});

	it('Should be able to fetch paginate recent questions', async () => {
		for (let i = 1; i <= 22; i++) {
			await answerRepository.create(makeAnswer({ questionId: new UniqueEntityId('question-1') }));
		}

		const result = await fetchQuestionAnswersUsecase.execute({ questionId: 'question-1', page: 2 });

		expect(result.value?.answers).toHaveLength(2);
	});
});
