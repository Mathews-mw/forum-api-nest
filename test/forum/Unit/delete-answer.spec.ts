import { makeAnswer } from '../factories/make-answer';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeAnswerAttachment } from '../factories/make-answer-attachment';
import { InMemoryAnswerRepository } from '../in-memory/in-memory-answer-repository';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';
import { InMemoryAnswerAttachmentsRepository } from '../in-memory/in-memory-answer-attachments-repository';

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let answerRepository: InMemoryAnswerRepository;
let deleteAnswerUseCase: DeleteAnswerUseCase;

describe('Delete Answer', () => {
	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answerRepository = new InMemoryAnswerRepository(answerAttachmentsRepository);
		deleteAnswerUseCase = new DeleteAnswerUseCase(answerRepository);
	});

	test('Should be able to delete a answer', async () => {
		const newAnswer = makeAnswer({ authorId: new UniqueEntityId('author-1') }, new UniqueEntityId('answer-1'));

		await answerRepository.create(newAnswer);

		answerAttachmentsRepository.items.push(
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId('2'),
			})
		);

		await deleteAnswerUseCase.execute({ authorId: 'author-1', answerId: 'answer-1' });

		expect(answerRepository.items).toHaveLength(0);
		expect(answerAttachmentsRepository.items).toHaveLength(0);
	});

	test('Should not be able to delete a answer from another user', async () => {
		const newAnswer = makeAnswer({ authorId: new UniqueEntityId('author-1') }, new UniqueEntityId('answer-1'));

		await answerRepository.create(newAnswer);

		await deleteAnswerUseCase.execute({ authorId: 'author-1', answerId: 'answer-1' });

		expect(() => {
			return deleteAnswerUseCase.execute({
				answerId: 'answer-1',
				authorId: 'author-2',
			});
		}).rejects.toBeInstanceOf(Error);
	});
});
