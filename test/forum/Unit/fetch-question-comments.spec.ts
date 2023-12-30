import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeQuestionComments } from '../factories/make-question-comments';
import { InMemmoryQuestionCommentsRepository } from '../in-memory/in-memmory-question-comments-repository';
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments';

let questionCommentsRepository: InMemmoryQuestionCommentsRepository;
let fetchQuestionCommentsUseCase: FetchQuestionCommentsUseCase;

describe('Fetch Questions Comments', () => {
	beforeEach(() => {
		questionCommentsRepository = new InMemmoryQuestionCommentsRepository();
		fetchQuestionCommentsUseCase = new FetchQuestionCommentsUseCase(questionCommentsRepository);
	});

	it('Should be able to fetch question comments', async () => {
		await questionCommentsRepository.create(makeQuestionComments({ questionId: new UniqueEntityId('question-1') }));
		await questionCommentsRepository.create(makeQuestionComments({ questionId: new UniqueEntityId('question-1') }));
		await questionCommentsRepository.create(makeQuestionComments({ questionId: new UniqueEntityId('question-1') }));

		const result = await fetchQuestionCommentsUseCase.execute({ questionId: 'question-1', page: 1 });

		expect(result.value?.questionComments).toHaveLength(3);
	});

	it('Should be able to fetch paginate questions comments', async () => {
		for (let i = 1; i <= 22; i++) {
			await questionCommentsRepository.create(makeQuestionComments({ questionId: new UniqueEntityId('question-1') }));
		}

		const result = await fetchQuestionCommentsUseCase.execute({ questionId: 'question-1', page: 2 });

		expect(result.value?.questionComments).toHaveLength(2);
	});
});
