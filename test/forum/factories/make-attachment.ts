import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Attachment, IAttachmentProps } from '@/domain/forum/enterprise/entities/attachment';
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper';

export function makeAttachment(override: Partial<IAttachmentProps> = {}, id?: UniqueEntityId) {
	const attachment = Attachment.create(
		{
			title: faker.lorem.slug(),
			url: faker.internet.url(),
			...override,
		},
		id
	);

	return attachment;
}

@Injectable()
export class AttachmentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAttachment(data: Partial<IAttachmentProps> = {}): Promise<Attachment> {
		const attachment = makeAttachment(data);

		await this.prisma.attachment.create({
			data: PrismaAttachmentMapper.toPrisma(attachment),
		});

		return attachment;
	}
}
