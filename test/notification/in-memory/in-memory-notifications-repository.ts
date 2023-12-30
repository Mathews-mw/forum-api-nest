import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { INotificaticationsRepository } from '@/domain/notification/application/repositories/implementations/INotificationsRepository';

export class InMemoryNotificationsRepository implements INotificaticationsRepository {
	public items: Notification[] = [];

	async create(notification: Notification) {
		this.items.push(notification);
	}

	async save(notification: Notification) {
		const itemIdenx = this.items.findIndex((item) => item.id === notification.id);

		this.items[itemIdenx] = notification;
	}

	async findById(id: string) {
		const notification = this.items.find((item) => item.id.toString() === id);

		if (!notification) {
			return null;
		}

		return notification;
	}
}
