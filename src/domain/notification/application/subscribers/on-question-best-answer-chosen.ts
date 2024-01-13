import { Injectable } from '@nestjs/common';
import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { IAnswerRepository } from '@/domain/forum/application/repositories/implementations/IAnswerRepository';
import { QuestBestAnswerChoseEvent } from '@/domain/forum/enterprise/events/quest-best-answer-chosen-event';

@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
	constructor(
		private answerRepository: IAnswerRepository,
		private sendNotificationUsecase: SendNotificationUseCase
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		DomainEvents.register(this.sendQuestionbestAnswerNotification.bind(this), OnQuestionBestAnswerChosen.name);
	}

	private async sendQuestionbestAnswerNotification({ question, bestAnswerId }: QuestBestAnswerChoseEvent) {
		const answer = await this.answerRepository.findById(bestAnswerId.toString());

		if (answer) {
			await this.sendNotificationUsecase.execute({
				recipientId: answer.authorId.toString(),
				title: `Sua resposta foi escolhida!`,
				content: `A resposta que você enviou em "${question.title.substring(0, 20).concat('...')}" foi escolhida pelo autor.`,
			});
		}
	}
}
