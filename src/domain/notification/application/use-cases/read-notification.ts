import { Either, failure, success } from '@/core/either';
import { NotallowedError } from '@/core/errors/not-allowed-error';
import { Notification } from '../../enterprise/entities/notification';
import { ResourceNotfounError } from '@/core/errors/resource-not-found-error';
import { INotificaticationsRepository } from '../repositories/implementations/INotificationsRepository';

interface IReadNotificationUseCaseRequest {
	recipientId: string;
	notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<
	ResourceNotfounError | NotallowedError,
	{
		notification: Notification;
	}
>;

export class ReadNotificationUseCase {
	constructor(private notificationRepository: INotificaticationsRepository) {}

	async execute({ recipientId, notificationId }: IReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
		const notification = await this.notificationRepository.findById(notificationId);

		if (!notification) {
			return failure(new ResourceNotfounError());
		}

		if (recipientId !== notification.recipientId.toString()) {
			return failure(new NotallowedError());
		}

		notification.read();

		await this.notificationRepository.save(notification);

		return success({
			notification,
		});
	}
}
