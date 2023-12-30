import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeNotification } from '../factories/make-notification';
import { NotallowedError } from '@/core/errors/not-allowed-error';
import { InMemoryNotificationsRepository } from '../in-memory/in-memory-notifications-repository';
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification';

let notificationRepository: InMemoryNotificationsRepository;
let readNotificationUseCase: ReadNotificationUseCase;

describe('Read Notification', () => {
	beforeEach(() => {
		notificationRepository = new InMemoryNotificationsRepository();
		readNotificationUseCase = new ReadNotificationUseCase(notificationRepository);
	});

	test('Should be able to read a notification', async () => {
		const notification = makeNotification();

		await notificationRepository.create(notification);

		const result = await readNotificationUseCase.execute({
			recipientId: notification.recipientId.toString(),
			notificationId: notification.id.toString(),
		});

		expect(result.isSucces).toBe(true);
		expect(notificationRepository.items[0].readAt).toEqual(expect.any(Date));
	});

	test('Should not be able to read a notification from another user', async () => {
		const notification = makeNotification({
			recipientId: new UniqueEntityId('recipient-1'),
		});

		await notificationRepository.create(notification);

		const result = await readNotificationUseCase.execute({
			recipientId: 'recipient-2',
			notificationId: notification.id.toString(),
		});

		expect(result.isSucces).toBe(true);
		expect(result.value).toBeInstanceOf(NotallowedError);
	});
});
