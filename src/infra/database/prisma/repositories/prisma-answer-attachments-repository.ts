import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper';
import { IAnswerAttchmentsRepository } from '@/domain/forum/application/repositories/implementations/IAnswerAttachmentsRepository';

@Injectable()
export class PrismaAnswerAttachmentsRepository implements IAnswerAttchmentsRepository {
	constructor(private prisma: PrismaService) {}

	async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
		const answerAttachments = await this.prisma.attachment.findMany({
			where: {
				answerId,
			},
		});

		return answerAttachments.map(PrismaAnswerAttachmentMapper.toDomain);
	}

	async deleteManyByAnswerId(answerId: string): Promise<void> {
		await this.prisma.attachment.deleteMany({
			where: {
				answerId,
			},
		});
	}
}
