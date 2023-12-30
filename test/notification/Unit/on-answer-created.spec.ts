import { SpyInstance } from 'vitest';

import { waitFor } from 'test/utils/wait-for';
import { makeAnswer } from 'test/forum/factories/make-answer';
import { makeQuestion } from 'test/forum/factories/make-question';
import { InMemoryAnswerRepository } from 'test/forum/in-memory/in-memory-answer-repository';
import { InMemoryNotificationsRepository } from '../in-memory/in-memory-notifications-repository';
import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created';
import { InMemoryQuestionRepository } from 'test/forum/in-memory/in-memory-question-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/forum/in-memory/in-memory-answer-attachments-repository';
import { InMemoryQestionAttachmentsRepository } from 'test/forum/in-memory/in-memory-question-attachments-repository';
import { ISendNotificationUseCaseRequest, SendNotificationUseCase, TSendNotificationUseCaseResponse } from '@/domain/notification/application/use-cases/send-notification';

let answerRepository: InMemoryAnswerRepository;
let questionRepository: InMemoryQuestionRepository;
let sendNotificationUsecase: SendNotificationUseCase;
let notificationRepository: InMemoryNotificationsRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let qestionAttachmentsRepository: InMemoryQestionAttachmentsRepository;

let sendNotificationExecuteSpy: SpyInstance<[ISendNotificationUseCaseRequest], Promise<TSendNotificationUseCaseResponse>>;

describe(' On Answer Created', () => {
	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answerRepository = new InMemoryAnswerRepository(answerAttachmentsRepository);
		qestionAttachmentsRepository = new InMemoryQestionAttachmentsRepository();
		questionRepository = new InMemoryQuestionRepository(qestionAttachmentsRepository);
		notificationRepository = new InMemoryNotificationsRepository();
		sendNotificationUsecase = new SendNotificationUseCase(notificationRepository);

		// Fica espiando quando o método execute da classe SendNotificationUseCase será chamado
		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUsecase, 'execute');

		new OnAnswerCreated(questionRepository, sendNotificationUsecase);
	});

	it('Should be able to send a notification when an answer is created.', async () => {
		const question = makeQuestion();
		const answer = makeAnswer({ questionId: question.id });

		questionRepository.create(question);
		answerRepository.create(answer);

		await waitFor(() => {
			expect(sendNotificationExecuteSpy).toBeCalled();
		});
	});
});
