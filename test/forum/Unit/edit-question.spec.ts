import { makeQuestion } from '../factories/make-question';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeQuestionAttachment } from '../factories/make-question-attachment';
import { InMemoryQuestionRepository } from '../in-memory/in-memory-question-repository';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question-use-case';
import { InMemoryQestionAttachmentsRepository } from '../in-memory/in-memory-question-attachments-repository';
import { InMemoryStudentsRepository } from '../in-memory/in-memory-students-repository';
import { InMemoryAttachmentsRepository } from '../in-memory/in-memmory-attachments-repository';

let editQuestionUseCase: EditQuestionUseCase;
let questionRepository: InMemoryQuestionRepository;
let questionAttachmentsRepository: InMemoryQestionAttachmentsRepository;
let studentsRepository: InMemoryStudentsRepository;
let attachmentRepository: InMemoryAttachmentsRepository;

describe('Edit Question', () => {
	beforeEach(() => {
		studentsRepository = new InMemoryStudentsRepository();
		attachmentRepository = new InMemoryAttachmentsRepository();
		questionAttachmentsRepository = new InMemoryQestionAttachmentsRepository();
		questionRepository = new InMemoryQuestionRepository(questionAttachmentsRepository, attachmentRepository, studentsRepository);
		editQuestionUseCase = new EditQuestionUseCase(questionRepository, questionAttachmentsRepository);
	});

	test('Should be able to edit a question', async () => {
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

		await editQuestionUseCase.execute({
			authorId: 'author-1',
			questionId: newQuestion.id.toValue(),
			title: 'Título modificado',
			content: 'Conteudo modificado',
			attachmentsIds: ['1', '3'],
		});

		expect(questionRepository.items[0]).toMatchObject({
			title: 'Título modificado',
			content: 'Conteudo modificado',
		});
		expect(questionRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(questionRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		]);
	});

	test('Should not be able to edit a question from another user', async () => {
		const newQuestion = makeQuestion({ authorId: new UniqueEntityId('author-1') }, new UniqueEntityId('question-1'));

		await questionRepository.create(newQuestion);

		expect(() => {
			return editQuestionUseCase.execute({
				authorId: 'author-2',
				questionId: newQuestion.id.toValue(),
				title: 'Título modificado',
				content: 'Conteudo modificado',
				attachmentsIds: [],
			});
		}).rejects.toBeInstanceOf(Error);
	});

	it('Should sync new and removed attachments when editing a question', async () => {
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

		const result = await editQuestionUseCase.execute({
			authorId: 'author-1',
			questionId: newQuestion.id.toValue(),
			title: 'Título modificado',
			content: 'Conteudo modificado',
			attachmentsIds: ['1', '3'],
		});

		expect(result.isSucces()).toBe(true);
		expect(questionAttachmentsRepository.items).toHaveLength(2);
		expect(questionAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attachmentId: new UniqueEntityId('1'),
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityId('3'),
				}),
			])
		);
	});
});
