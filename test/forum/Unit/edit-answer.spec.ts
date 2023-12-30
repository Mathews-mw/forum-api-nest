import { makeAnswer } from '../factories/make-answer';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeAnswerAttachment } from '../factories/make-answer-attachment';
import { InMemoryAnswerRepository } from '../in-memory/in-memory-answer-repository';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer-use-case';
import { InMemoryAnswerAttachmentsRepository } from '../in-memory/in-memory-answer-attachments-repository';

let editAnswerUseCase: EditAnswerUseCase;
let answerRepository: InMemoryAnswerRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;

describe('Edit Answer', () => {
	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answerRepository = new InMemoryAnswerRepository(answerAttachmentsRepository);
		editAnswerUseCase = new EditAnswerUseCase(answerRepository, answerAttachmentsRepository);
	});

	test('Should be able to edit a answer', async () => {
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

		await editAnswerUseCase.execute({ authorId: 'author-1', answerId: newAnswer.id.toValue(), content: 'Conteudo modificado', attachmentsIds: ['1', '3'] });

		expect(answerRepository.items[0]).toMatchObject({
			content: 'Conteudo modificado',
		});
		expect(answerRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(answerRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		]);
	});

	test('Should not be able to edit a answer from another user', async () => {
		const newAnswer = makeAnswer({ authorId: new UniqueEntityId('author-1') }, new UniqueEntityId('answer-1'));

		await answerRepository.create(newAnswer);

		expect(() => {
			return editAnswerUseCase.execute({ authorId: 'author-2', answerId: newAnswer.id.toValue(), content: 'Conteudo modificado', attachmentsIds: [] });
		}).rejects.toBeInstanceOf(Error);
	});
});
