import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerRepository } from '../in-memory/in-memory-answer-repository';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question-use-case';
import { InMemoryAnswerAttachmentsRepository } from '../in-memory/in-memory-answer-attachments-repository';

let answerRepository: InMemoryAnswerRepository;
let answerQuestionUseCase: AnswerQuestionUseCase;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;

describe('Answer Question', () => {
	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answerRepository = new InMemoryAnswerRepository(answerAttachmentsRepository);
		answerQuestionUseCase = new AnswerQuestionUseCase(answerRepository);
	});

	test('Should be able to create an answer', async () => {
		const result = await answerQuestionUseCase.execute({
			instructorId: '1',
			questionId: '1',
			content: 'Nova resposta',
			attachmentsIds: ['1', '2'],
		});

		expect(result.isSucces()).toBe(true);
		expect(answerRepository.items[0].id).toEqual(result.value?.answer);
		expect(answerRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(answerRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
		]);
	});
});
