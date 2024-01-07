import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { IAttachmentRepository } from '@/domain/forum/application/repositories/implementations/IAttachmentRepository';
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper';

@Injectable()
export class PrismaAttachmentsRepository implements IAttachmentRepository {
	constructor(private prisma: PrismaService) {}

	async create(attachment: Attachment): Promise<void> {
		const data = PrismaAttachmentMapper.toPrisma(attachment);

		await this.prisma.attachment.create({
			data,
		});
	}
}
