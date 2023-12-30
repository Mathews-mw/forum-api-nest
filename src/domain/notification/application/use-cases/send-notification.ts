import { Either, success } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Notification } from '../../enterprise/entities/notification';
import { INotificaticationsRepository } from '../repositories/implementations/INotificationsRepository';

export interface ISendNotificationUseCaseRequest {
	recipientId: string;
	title: string;
	content: string;
}

export type TSendNotificationUseCaseResponse = Either<
	null,
	{
		notification: Notification;
	}
>;

export class SendNotificationUseCase {
	constructor(private notificationRepository: INotificaticationsRepository) {}

	async execute({ recipientId, title, content }: ISendNotificationUseCaseRequest): Promise<TSendNotificationUseCaseResponse> {
		const notification = Notification.create({ recipientId: new UniqueEntityId(recipientId), title, content });

		await this.notificationRepository.create(notification);

		return success({
			notification,
		});
	}
}
