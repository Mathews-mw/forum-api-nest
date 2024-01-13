import request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { StudentFactory } from 'test/forum/factories/make-student';
import { DatabaseModule } from '@/infra/database/databbase.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { NotificationFactory } from 'test/notification/factories/make-notification';

describe('Read Notification (E2E)', () => {
	let jwt: JwtService;
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let notificationFactory: NotificationFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [PrismaService, StudentFactory, NotificationFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		jwt = moduleRef.get(JwtService);
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		notificationFactory = moduleRef.get(NotificationFactory);

		await app.init();
	});

	it('[PATCH] /notifications/:notificationId/read', async () => {
		const user = await studentFactory.makePrismaStudent({
			name: 'John Doe',
		});

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const notification = await notificationFactory.makePrismaNotification({
			recipientId: user.id,
		});

		const response = await request(app.getHttpServer())
			.patch(`/notifications/${notification.id.toString()}/read`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(204);

		const notificationOnDatabase = await prisma.notification.findFirst({
			where: {
				recipientId: user.id.toString(),
			},
		});

		expect(notificationOnDatabase?.readAt).not.toBeNull();
	});
});
