import { makeAnswer } from '../factories/make-answer';
import { makeQuestion } from '../factories/make-question';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerRepository } from '../in-memory/in-memory-answer-repository';
import { InMemoryQuestionRepository } from '../in-memory/in-memory-question-repository';
import { InMemoryAnswerAttachmentsRepository } from '../in-memory/in-memory-answer-attachments-repository';
import { InMemoryQestionAttachmentsRepository } from '../in-memory/in-memory-question-attachments-repository';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer-use-case';

let answerRepository: InMemoryAnswerRepository;
let questionRepository: InMemoryQuestionRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase;
let questionAttachmentsRepository: InMemoryQestionAttachmentsRepository;

describe('Choose Question Best Answer', () => {
	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		questionAttachmentsRepository = new InMemoryQestionAttachmentsRepository();
		answerRepository = new InMemoryAnswerRepository(answerAttachmentsRepository);
		questionRepository = new InMemoryQuestionRepository(questionAttachmentsRepository);
		chooseQuestionBestAnswerUseCase = new ChooseQuestionBestAnswerUseCase(questionRepository, answerRepository);
	});

	test('Should be able to choose the quest best answer', async () => {
		const question = makeQuestion();
		const answer = makeAnswer({ questionId: question.id });

		await answerRepository.create(answer);
		await questionRepository.create(question);

		await chooseQuestionBestAnswerUseCase.execute({
			answerId: answer.id.toString(),
			authorId: question.authorId.toString(),
		});

		expect(questionRepository.items[0].bestAnswerId).toEqual(answer.id);
	});

	test('Should not be able to choose another user question best answer', async () => {
		const question = makeQuestion({
			authorId: new UniqueEntityId('author-1'),
		});
		const answer = makeAnswer({ questionId: question.id });

		await answerRepository.create(answer);
		await questionRepository.create(question);

		expect(() => {
			return chooseQuestionBestAnswerUseCase.execute({
				answerId: answer.id.toString(),
				authorId: 'author-2',
			});
		}).rejects.toBeInstanceOf(Error);
	});
});
