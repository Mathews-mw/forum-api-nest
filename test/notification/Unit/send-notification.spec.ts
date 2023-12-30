import { InMemoryNotificationsRepository } from '../in-memory/in-memory-notifications-repository';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';

let notificationRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

describe('Send Notification', () => {
	beforeEach(() => {
		notificationRepository = new InMemoryNotificationsRepository();
		sendNotificationUseCase = new SendNotificationUseCase(notificationRepository);
	});

	test('Should be able to send a notification', async () => {
		const result = await sendNotificationUseCase.execute({
			recipientId: '1',
			title: 'Nova notificação',
			content: 'Conteúdo da notificação',
		});

		expect(result.isSucces).toBe(true);
		expect(notificationRepository.items[0].id).toEqual(result.value?.notification);
	});
});
