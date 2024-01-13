import { Notification } from '@/domain/notification/enterprise/entities/notification';

export abstract class INotificaticationsRepository {
	abstract create(notification: Notification): Promise<void>;
	abstract save(notification: Notification): Promise<void>;
	abstract findById(id: string): Promise<Notification | null>;
}
