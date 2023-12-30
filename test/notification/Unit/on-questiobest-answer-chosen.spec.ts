import { SpyInstance } from 'vitest';

import { waitFor } from 'test/utils/wait-for';
import { makeAnswer } from 'test/forum/factories/make-answer';
import { makeQuestion } from 'test/forum/factories/make-question';
import { InMemoryAnswerRepository } from 'test/forum/in-memory/in-memory-answer-repository';
import { InMemoryNotificationsRepository } from '../in-memory/in-memory-notifications-repository';
import { InMemoryQuestionRepository } from 'test/forum/in-memory/in-memory-question-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/forum/in-memory/in-memory-answer-attachments-repository';
import { InMemoryQestionAttachmentsRepository } from 'test/forum/in-memory/in-memory-question-attachments-repository';
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-chosen';
import { ISendNotificationUseCaseRequest, SendNotificationUseCase, TSendNotificationUseCaseResponse } from '@/domain/notification/application/use-cases/send-notification';

let answerRepository: InMemoryAnswerRepository;
let questionRepository: InMemoryQuestionRepository;
let sendNotificationUsecase: SendNotificationUseCase;
let notificationRepository: InMemoryNotificationsRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let qestionAttachmentsRepository: InMemoryQestionAttachmentsRepository;

let sendNotificationExecuteSpy: SpyInstance<[ISendNotificationUseCaseRequest], Promise<TSendNotificationUseCaseResponse>>;

describe(' On Question Best Answer', () => {
	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answerRepository = new InMemoryAnswerRepository(answerAttachmentsRepository);
		qestionAttachmentsRepository = new InMemoryQestionAttachmentsRepository();
		questionRepository = new InMemoryQuestionRepository(qestionAttachmentsRepository);
		notificationRepository = new InMemoryNotificationsRepository();
		sendNotificationUsecase = new SendNotificationUseCase(notificationRepository);

		// Fica espiando quando o método execute da classe SendNotificationUseCase será chamado
		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUsecase, 'execute');

		new OnQuestionBestAnswerChosen(answerRepository, sendNotificationUsecase);
	});

	it('Should be able to send a notification when question have best answer chosen.', async () => {
		const question = makeQuestion();
		const answer = makeAnswer({ questionId: question.id });

		questionRepository.create(question);
		answerRepository.create(answer);

		question.bestAnswerId = answer.id;

		questionRepository.save(question);

		await waitFor(() => {
			expect(sendNotificationExecuteSpy).toBeCalled();
		});
	});
});
