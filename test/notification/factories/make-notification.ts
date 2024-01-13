import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification-mapper';
import { INotificationProps, Notification } from '@/domain/notification/enterprise/entities/notification';

export function makeNotification(override: Partial<INotificationProps> = {}, id?: UniqueEntityId) {
	const notification = Notification.create(
		{
			recipientId: new UniqueEntityId(),
			title: faker.lorem.sentence(4),
			content: faker.lorem.sentence(12),
			...override,
		},
		id
	);

	return notification;
}

@Injectable()
export class NotificationFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaNotification(data: Partial<INotificationProps> = {}): Promise<Notification> {
		const notification = makeNotification(data);

		await this.prisma.notification.create({
			data: PrismaNotificationMapper.toPrisma(notification),
		});

		return notification;
	}
}
