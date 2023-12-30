import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event';
import { IQuestionRepository } from '@/domain/forum/application/repositories/implementations/IQuestionRepository';

export class OnAnswerCreated implements EventHandler {
	constructor(
		private questionRepository: IQuestionRepository,
		private sendNotificationUsecase: SendNotificationUseCase
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		// OnAnswerCreated.name => Retorna o próprio nome da classe
		// bind(this) => Deixa de forma explícita que o contexto do this se refere à classe OnAnswerCreated
		DomainEvents.register(this.sendNewAnswerNotification.bind(this), OnAnswerCreated.name);
	}

	private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
		const question = await this.questionRepository.findById(answer.questionId.toString());

		if (question) {
			await this.sendNotificationUsecase.execute({
				recipientId: question.authorId.toString(),
				title: `Nova resposta em ${question.title.substring(0, 40).concat('...')}`,
				content: answer.excerpt,
			});
		}
	}
}
