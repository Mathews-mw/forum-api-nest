import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { INotificaticationsRepository } from '@/domain/notification/application/repositories/implementations/INotificationsRepository';

@Injectable()
export class PrismaNotificationsRepository implements INotificaticationsRepository {
	constructor(private prisma: PrismaService) {}

	async create(notification: Notification): Promise<void> {
		const data = PrismaNotificationMapper.toPrisma(notification);

		await this.prisma.notification.create({
			data,
		});
	}

	async save(notification: Notification): Promise<void> {
		const data = PrismaNotificationMapper.toPrisma(notification);

		await this.prisma.notification.update({
			data,
			where: {
				id: data.id,
			},
		});
	}

	async findById(id: string): Promise<Notification | null> {
		const notification = await this.prisma.notification.findUnique({
			where: {
				id,
			},
		});

		if (!notification) {
			return null;
		}

		return PrismaNotificationMapper.toDomain(notification);
	}
}
