import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionRepository } from '../in-memory/in-memory-question-repository';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question-use-case';
import { InMemoryQestionAttachmentsRepository } from '../in-memory/in-memory-question-attachments-repository';

let questionAttachmentsRepository: InMemoryQestionAttachmentsRepository;
let questionRepository: InMemoryQuestionRepository;
let createQuestionUseCase: CreateQuestionUseCase;

describe('Create Question', () => {
	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQestionAttachmentsRepository();
		questionRepository = new InMemoryQuestionRepository(questionAttachmentsRepository);
		createQuestionUseCase = new CreateQuestionUseCase(questionRepository);
	});

	test('Should be able to create a question', async () => {
		const result = await createQuestionUseCase.execute({
			authorId: '1',
			title: 'Nova pergunta',
			content: 'Conteúdo da pergunta',
			attachmentsIds: ['1', '2'],
		});

		expect(result.isSucces).toBe(true);
		expect(questionRepository.items[0].id).toEqual(result.value?.question);
		expect(questionRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(questionRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
		]);
	});
});
