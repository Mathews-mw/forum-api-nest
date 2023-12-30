import { makeQuestion } from '../factories/make-question';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeQuestionAttachment } from '../factories/make-question-attachment';
import { InMemoryQuestionRepository } from '../in-memory/in-memory-question-repository';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { InMemoryQestionAttachmentsRepository } from '../in-memory/in-memory-question-attachments-repository';

let questionRepository: InMemoryQuestionRepository;
let questionAttachmentsRepository: InMemoryQestionAttachmentsRepository;
let deleteQuestionUseCase: DeleteQuestionUseCase;

describe('Delete Question', () => {
	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQestionAttachmentsRepository();
		questionRepository = new InMemoryQuestionRepository(questionAttachmentsRepository);
		deleteQuestionUseCase = new DeleteQuestionUseCase(questionRepository);
	});

	test('Should be able to delete a question', async () => {
		const newQuestion = makeQuestion({ authorId: new UniqueEntityId('author-1') }, new UniqueEntityId('question-1'));

		await questionRepository.create(newQuestion);

		questionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('2'),
			})
		);

		await deleteQuestionUseCase.execute({ authorId: 'author-1', questionId: 'question-1' });

		expect(questionRepository.items).toHaveLength(0);
		expect(questionAttachmentsRepository.items).toHaveLength(0);
	});

	test('Should not be able to delete a question from another user', async () => {
		const newQuestion = makeQuestion({ authorId: new UniqueEntityId('author-1') }, new UniqueEntityId('question-1'));

		await questionRepository.create(newQuestion);

		await deleteQuestionUseCase.execute({ authorId: 'author-1', questionId: 'question-1' });

		expect(() => {
			return deleteQuestionUseCase.execute({
				questionId: 'question-1',
				authorId: 'author-2',
			});
		}).rejects.toBeInstanceOf(Error);
	});
});
